import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '../database/firebaseConfig';

const BEFORE_MINUTES = 30;
const AFTER_MINUTES = 120;

const pad = (value) => String(value).padStart(2, '0');

export const getTodayKey = () => {
  const now = new Date();

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

export const getScheduleTimeText = (schedule) => {
  return `${pad(schedule.hour)}:${pad(schedule.minute)}`;
};

export const getDoseWindowStatus = (schedule) => {
  const now = new Date();

  const scheduledDate = new Date();
  scheduledDate.setHours(Number(schedule.hour));
  scheduledDate.setMinutes(Number(schedule.minute));
  scheduledDate.setSeconds(0);
  scheduledDate.setMilliseconds(0);

  const availableFrom = new Date(
    scheduledDate.getTime() - BEFORE_MINUTES * 60 * 1000
  );

  const availableUntil = new Date(
    scheduledDate.getTime() + AFTER_MINUTES * 60 * 1000
  );

  if (now < availableFrom) {
    return {
      status: 'locked',
      label: `Disponible a las ${pad(availableFrom.getHours())}:${pad(
        availableFrom.getMinutes()
      )}`,
      availableFrom,
      availableUntil,
    };
  }

  if (now > availableUntil) {
    return {
      status: 'expired',
      label: 'Dosis vencida',
      availableFrom,
      availableUntil,
    };
  }

  return {
    status: 'available',
    label: 'Tomar ahora',
    availableFrom,
    availableUntil,
  };
};

export const getDoseTakenId = ({ medicineId, dateKey, scheduleIndex }) => {
  return `${medicineId}_${dateKey}_${scheduleIndex}`;
};

export const registerMedicineDoseTaken = async ({
  patientId,
  medicineId,
  scheduleIndex,
  source = 'manual',
  allowOutsideWindow = false,
}) => {
  if (!patientId || !medicineId) {
    return {
      ok: false,
      reason: 'missing_data',
      message: 'Faltan datos del paciente o medicamento.',
    };
  }

  try {
    const medicineRef = doc(
      db,
      'pacientes',
      patientId,
      'inventario',
      medicineId
    );

    const medicineSnap = await getDoc(medicineRef);

    if (!medicineSnap.exists()) {
      return {
        ok: false,
        reason: 'medicine_not_found',
        message: 'No se encontró el medicamento.',
      };
    }

    const medicine = {
      id: medicineSnap.id,
      ...medicineSnap.data(),
    };

    const schedules = Array.isArray(medicine.schedules)
      ? medicine.schedules
      : [];

    const schedule = schedules[scheduleIndex];

    if (!schedule) {
      return {
        ok: false,
        reason: 'schedule_not_found',
        message: 'No se encontró el horario de esta dosis.',
      };
    }

    const windowStatus = getDoseWindowStatus(schedule);

    if (
      !allowOutsideWindow &&
      windowStatus.status === 'locked'
    ) {
      return {
        ok: false,
        reason: 'locked',
        message: `Esta dosis todavía no está disponible. ${windowStatus.label}.`,
      };
    }

    if (
      !allowOutsideWindow &&
      windowStatus.status === 'expired'
    ) {
      return {
        ok: false,
        reason: 'expired',
        message: 'Esta dosis ya venció.',
      };
    }

    const dateKey = getTodayKey();

    const doseId = getDoseTakenId({
      medicineId,
      dateKey,
      scheduleIndex,
    });

    const doseRef = doc(
      db,
      'pacientes',
      patientId,
      'dosisTomadas',
      doseId
    );

    const doseSnap = await getDoc(doseRef);

    if (doseSnap.exists()) {
      return {
        ok: false,
        reason: 'already_taken',
        message: 'Esta dosis ya fue registrada.',
      };
    }

    const currentStock = Number(medicine.currentStock || 0);
    const doseAmount = Number(medicine.doseAmount || 1);
    const stockUnit = medicine.stockUnit || 'unidad';

    const newStock = Math.max(currentStock - doseAmount, 0);
    const scheduledTime = getScheduleTimeText(schedule);

    await setDoc(doseRef, {
      patientId,
      medicineId,
      medicineName: medicine.name,
      scheduleIndex,
      scheduledTime,
      date: dateKey,
      status: 'taken',
      source,
      doseAmount,
      stockUnit,
      takenAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    });

    await updateDoc(medicineRef, {
      currentStock: newStock,
      updatedAt: serverTimestamp(),
    });

    await addDoc(
      collection(db, 'pacientes', patientId, 'movimientos'),
      {
        type: 'consume',
        medicineId,
        medicineName: medicine.name,
        amount: doseAmount, stockUnit,
        previousStock: currentStock,
        newStock,
        scheduleIndex,
        scheduledTime,
        date: dateKey,
        source,
        description: `Dosis ${scheduledTime} registrada desde ${
            source === 'notification' ? 'notificación' : 'manual'
        }. Cantidad: ${doseAmount} ${stockUnit}`,
        createdAt: serverTimestamp(),
      }
    );

    return {
      ok: true,
      medicine,
      newStock,
      scheduledTime,
      message: 'Dosis registrada correctamente.',
    };
  } catch (error) {
    console.error('Error registrando dosis:', error);

    return {
      ok: false,
      reason: 'error',
      message: 'No se pudo registrar la dosis.',
    };
  }
};