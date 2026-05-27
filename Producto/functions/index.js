const { setGlobalOptions } = require('firebase-functions');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const admin = require('firebase-admin');
const { Expo } = require('expo-server-sdk');

admin.initializeApp();
setGlobalOptions({ maxInstances: 10 });

const db = admin.firestore();
const expo = new Expo();

const BEFORE_MINUTES = 30;
const AFTER_MINUTES = 120;
const TIME_ZONE = 'America/Santiago';

const pad = (value) => String(value).padStart(2, '0');

const getChileDateParts = () => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date());
  const data = {};

  parts.forEach((part) => {
    data[part.type] = part.value;
  });

  return {
    dateKey: `${data.year}-${data.month}-${data.day}`,
    hour: Number(data.hour),
    minute: Number(data.minute),
  };
};

const getDoseTakenId = ({ medicineId, dateKey, scheduleIndex }) => {
  return `${medicineId}_${dateKey}_${scheduleIndex}`;
};

const getScheduleTimeText = (schedule) => {
  return `${pad(schedule.hour)}:${pad(schedule.minute)}`;
};

const sendPush = async ({ expoPushToken, title, body, data = {} }) => {
  if (!expoPushToken || !Expo.isExpoPushToken(expoPushToken)) return;

  const messages = [
    {
      to: expoPushToken,
      sound: 'default',
      title,
      body,
      data,
    },
  ];

  const chunks = expo.chunkPushNotifications(messages);

  for (const chunk of chunks) {
    await expo.sendPushNotificationsAsync(chunk);
  }
};

const notifyCaregivers = async ({
  caregiverIds,
  patientId,
  patientName,
  medicineId,
  medicineName,
  scheduledTime,
  type,
  title,
  message,
}) => {
  for (const caregiverId of caregiverIds) {
    const caregiverRef = db.collection('usuarios').doc(caregiverId);
    const caregiverSnap = await caregiverRef.get();

    if (!caregiverSnap.exists) continue;

    const caregiverData = caregiverSnap.data();

    await caregiverRef.collection('alertas').add({
      type,
      patientId,
      medicineId,
      patientName,
      medicineName,
      scheduledTime,
      message,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    if (caregiverData.expoPushToken) {
      await sendPush({
        expoPushToken: caregiverData.expoPushToken,
        title,
        body: message,
        data: {
          type,
          patientId,
          medicineId,
        },
      });
    }
  }
};

exports.checkMissedMedicineDoses = onSchedule(
  {
    schedule: 'every 5 minutes',
    timeZone: TIME_ZONE,
  },
  async () => {
    const { dateKey, hour, minute } = getChileDateParts();
    const nowMinutes = hour * 60 + minute;

    const patientsSnap = await db.collection('pacientes').get();

    for (const patientDoc of patientsSnap.docs) {
      const patientId = patientDoc.id;
      const patientData = patientDoc.data();

      const patientName =
        patientData.nombre || patientData.name || 'El paciente';

      const caregiverIds = Array.isArray(patientData.cuidadores)
        ? patientData.cuidadores
        : [];

      if (caregiverIds.length === 0) continue;

      const inventorySnap = await db
        .collection('pacientes')
        .doc(patientId)
        .collection('inventario')
        .get();

      for (const medicineDoc of inventorySnap.docs) {
        const medicine = {
          id: medicineDoc.id,
          ...medicineDoc.data(),
        };

        const schedules = Array.isArray(medicine.schedules)
          ? medicine.schedules
          : [];

        for (let index = 0; index < schedules.length; index++) {
          const schedule = schedules[index];

          if (
            schedule?.hour === undefined ||
            schedule?.minute === undefined
          ) {
            continue;
          }

          const scheduledMinutes =
            Number(schedule.hour) * 60 + Number(schedule.minute);

          const expired = nowMinutes > scheduledMinutes + AFTER_MINUTES;

          if (!expired) continue;

          const doseId = getDoseTakenId({
            medicineId: medicine.id,
            dateKey,
            scheduleIndex: index,
          });

          const doseRef = db
            .collection('pacientes')
            .doc(patientId)
            .collection('dosisTomadas')
            .doc(doseId);

          const doseSnap = await doseRef.get();

          if (doseSnap.exists) continue;

          const scheduledTime = getScheduleTimeText(schedule);
          const doseAmount = Number(medicine.doseAmount || 1);
          const stockUnit = medicine.stockUnit || 'unidad';

          await doseRef.set({
            patientId,
            medicineId: medicine.id,
            medicineName: medicine.name,
            scheduleIndex: index,
            scheduledTime,
            date: dateKey,
            status: 'missed',
            source: 'cloud_function',
            doseAmount,
            stockUnit,
            missedAt: admin.firestore.FieldValue.serverTimestamp(),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          await db
            .collection('pacientes')
            .doc(patientId)
            .collection('movimientos')
            .add({
              type: 'missed',
              medicineId: medicine.id,
              medicineName: medicine.name,
              amount: doseAmount,
              stockUnit,
              scheduleIndex: index,
              scheduledTime,
              date: dateKey,
              source: 'cloud_function',
              description: `Dosis ${scheduledTime} marcada como omitida automáticamente.`,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });

          await notifyCaregivers({
            caregiverIds,
            patientId,
            patientName,
            medicineId: medicine.id,
            medicineName: medicine.name,
            scheduledTime,
            type: 'medicine_missed',
            title: '⚠️ Dosis omitida',
            message: `${patientName} no registró ${medicine.name} (${scheduledTime})`,
          });
        }
      }
    }

    return null;
  }
);

const getRemainingDays = (medicine) => {
  const currentStock = Number(medicine.currentStock || 0);
  const dailyDose = Number(medicine.dailyDose || 0);
  const doseAmount = Number(medicine.doseAmount || 1);

  const dailyConsumption = dailyDose * doseAmount;

  if (currentStock <= 0) return 0;
  if (dailyConsumption <= 0) return null;

  return Math.floor(currentStock / dailyConsumption);
};

const getStockAlertInfo = (medicine) => {
  const currentStock = Number(medicine.currentStock || 0);
  const minStock = Number(medicine.minStock || 0);
  const remainingDays = getRemainingDays(medicine);

  if (currentStock <= 0) {
    return {
      type: 'stock_empty',
      title: '🚨 Sin stock',
      message: `${medicine.name} ya no tiene stock disponible.`,
      priority: 1,
    };
  }

  if (remainingDays !== null && remainingDays <= 2) {
    return {
      type: 'stock_very_low',
      title: '⚠️ Se agota muy pronto',
      message: `${medicine.name} tiene stock para ${remainingDays} día(s).`,
      priority: 2,
    };
  }

  if (currentStock <= minStock) {
    return {
      type: 'stock_critical',
      title: '⚠️ Stock crítico',
      message: `${medicine.name} está igual o bajo el stock mínimo.`,
      priority: 3,
    };
  }

  if (remainingDays !== null && remainingDays <= 5) {
    return {
      type: 'stock_preventive',
      title: '📦 Reposición preventiva',
      message: `${medicine.name} tiene stock para ${remainingDays} día(s).`,
      priority: 4,
    };
  }

  return null;
};

exports.sendDailyStockAlerts = onSchedule(
  {
    schedule: '0 9,20 * * *',
    timeZone: TIME_ZONE,
  },
  async () => {
    const { dateKey, hour } = getChileDateParts();
    const period = hour < 12 ? 'morning' : 'night';

    const patientsSnap = await db.collection('pacientes').get();

    for (const patientDoc of patientsSnap.docs) {
      const patientId = patientDoc.id;
      const patientData = patientDoc.data();

      const patientName =
        patientData.nombre || patientData.name || 'El paciente';

      const caregiverIds = Array.isArray(patientData.cuidadores)
        ? patientData.cuidadores
        : [];

      if (caregiverIds.length === 0) continue;

      const inventorySnap = await db
        .collection('pacientes')
        .doc(patientId)
        .collection('inventario')
        .get();

      for (const medicineDoc of inventorySnap.docs) {
        const medicine = {
          id: medicineDoc.id,
          ...medicineDoc.data(),
        };

        const alertInfo = getStockAlertInfo(medicine);

        if (!alertInfo) continue;

        const alertId = `${dateKey}_${period}_${medicine.id}_${alertInfo.type}`;

        const stockAlertRef = db
          .collection('pacientes')
          .doc(patientId)
          .collection('stockAlertasEnviadas')
          .doc(alertId);

        const stockAlertSnap = await stockAlertRef.get();

        if (stockAlertSnap.exists) continue;

        await stockAlertRef.set({
          patientId,
          medicineId: medicine.id,
          medicineName: medicine.name,
          type: alertInfo.type,
          period,
          date: dateKey,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        for (const caregiverId of caregiverIds) {
          const caregiverRef = db.collection('usuarios').doc(caregiverId);
          const caregiverSnap = await caregiverRef.get();

          if (!caregiverSnap.exists) continue;

          const caregiverData = caregiverSnap.data();

          await caregiverRef.collection('alertas').add({
            type: alertInfo.type,
            patientId,
            medicineId: medicine.id,
            patientName,
            medicineName: medicine.name,
            message: alertInfo.message,
            read: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          if (caregiverData.expoPushToken) {
            await sendPush({
              expoPushToken: caregiverData.expoPushToken,
              title: alertInfo.title,
              body: alertInfo.message,
              data: {
                type: alertInfo.type,
                patientId,
                medicineId: medicine.id,
              },
            });
          }
        }
      }
    }

    return null;
  }
);