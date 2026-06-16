import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore';

import { db } from '../database/firebaseConfig';
import * as Notifications from 'expo-notifications';
import {
  scheduleMedicineReminders,
  cancelMedicineReminders,
} from './notificationService';

import { getTodayKey, getDoseTakenId } from './medicineTakenService';

const getStorageKey = (patientId) => `patientReminderIds_${patientId}`;
const getMapStorageKey = (patientId) => `patientReminderMap_${patientId}`;

const getDoseKey = ({ medicineId, scheduleIndex }) => {
  return `${medicineId}_${scheduleIndex}`;
};

export const schedulePatientMedicineReminders = async (patientId) => {
  if (!patientId) return;

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const oldIdsRaw = await AsyncStorage.getItem(getStorageKey(patientId));
    const oldIds = oldIdsRaw ? JSON.parse(oldIdsRaw) : [];

    if (Array.isArray(oldIds) && oldIds.length > 0) {
      await cancelMedicineReminders(oldIds);
    }

    const today = getTodayKey();

    const dosesRef = collection(db, 'pacientes', patientId, 'dosisTomadas');
    const dosesSnap = await getDocs(dosesRef);

    const registeredDoseIds = {};

    dosesSnap.docs.forEach((docItem) => {
      const data = docItem.data();

      if (
        data.date === today &&
        (data.status === 'taken' || data.status === 'missed')
      ) {
        registeredDoseIds[docItem.id] = true;
      }
    });

    const inventoryRef = collection(db, 'pacientes', patientId, 'inventario');
    const inventorySnap = await getDocs(inventoryRef);

    const allNotificationIds = [];
    const reminderMap = {};

    for (const docItem of inventorySnap.docs) {
      const medicine = {
        id: docItem.id,
        ...docItem.data(),
      };

      const currentStock = Number(medicine.currentStock || 0);

      if (currentStock <= 0) {
        console.log(
          `No se programan recordatorios para ${medicine.name}: stock 0`
        );
        continue;
      }

      if (
        medicine.reminderEnabled &&
        Array.isArray(medicine.schedules) &&
        medicine.schedules.length > 0
      ) {
        const pendingSchedules = [];
        const originalIndexes = [];

        medicine.schedules.forEach((schedule, index) => {
          const doseId = getDoseTakenId({
            medicineId: medicine.id,
            dateKey: today,
            scheduleIndex: index,
          });

          if (!registeredDoseIds[doseId]) {
            pendingSchedules.push(schedule);
            originalIndexes.push(index);
          }
        });

        if (pendingSchedules.length === 0) continue;

        const ids = await scheduleMedicineReminders({
          medicineId: medicine.id,
          medicineName: medicine.name,
          schedules: pendingSchedules,
          scheduleIndexes: originalIndexes,
        });

        allNotificationIds.push(...ids);

        originalIndexes.forEach((originalIndex, localIndex) => {
          const doseKey = getDoseKey({
            medicineId: medicine.id,
            scheduleIndex: originalIndex,
          });

          const start = localIndex * 3;
          reminderMap[doseKey] = ids.slice(start, start + 3);
        });
      }
    }

    await AsyncStorage.setItem(
      getStorageKey(patientId),
      JSON.stringify(allNotificationIds)
    );

    await AsyncStorage.setItem(
      getMapStorageKey(patientId),
      JSON.stringify(reminderMap)
    );

    console.log(
      'Recordatorios pendientes programados:',
      allNotificationIds.length
    );
    console.log('Mapa de recordatorios por dosis:', reminderMap);
  } catch (error) {
    console.error('Error programando recordatorios del paciente:', error);
  }
};

export const cancelPatientDoseReminders = async ({
  patientId,
  medicineId,
  scheduleIndex,
}) => {
  if (!patientId || !medicineId || scheduleIndex === undefined) return;

  try {
    const mapRaw = await AsyncStorage.getItem(getMapStorageKey(patientId));
    const reminderMap = mapRaw ? JSON.parse(mapRaw) : {};

    const doseKey = getDoseKey({
      medicineId,
      scheduleIndex,
    });

    const idsToCancel = reminderMap[doseKey] || [];

    if (Array.isArray(idsToCancel) && idsToCancel.length > 0) {
      await cancelMedicineReminders(idsToCancel);
      console.log('Recordatorios cancelados para dosis:', doseKey);
    }

    delete reminderMap[doseKey];

    await AsyncStorage.setItem(
      getMapStorageKey(patientId),
      JSON.stringify(reminderMap)
    );
  } catch (error) {
    console.error('Error cancelando recordatorios de dosis:', error);
  }
};

export const clearPatientMedicineReminders = async (patientId) => {
  if (!patientId) return;

  try {
    const idsRaw = await AsyncStorage.getItem(getStorageKey(patientId));
    const ids = idsRaw ? JSON.parse(idsRaw) : [];

    if (Array.isArray(ids) && ids.length > 0) {
      await cancelMedicineReminders(ids);
    }

    await AsyncStorage.removeItem(getStorageKey(patientId));
    await AsyncStorage.removeItem(getMapStorageKey(patientId));
  } catch (error) {
    console.error('Error limpiando recordatorios del paciente:', error);
  }
};