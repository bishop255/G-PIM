import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore';

import { db } from '../database/firebaseConfig';

import {
  scheduleMedicineReminders,
  cancelMedicineReminders,
} from './notificationService';

const getStorageKey = (patientId) => `patientReminderIds_${patientId}`;
const getMapStorageKey = (patientId) => `patientReminderMap_${patientId}`;

const getDoseKey = ({ medicineId, scheduleIndex }) => {
  return `${medicineId}_${scheduleIndex}`;
};

export const schedulePatientMedicineReminders = async (patientId) => {
  if (!patientId) return;

  try {
    const oldIdsRaw = await AsyncStorage.getItem(getStorageKey(patientId));
    const oldIds = oldIdsRaw ? JSON.parse(oldIdsRaw) : [];

    if (Array.isArray(oldIds) && oldIds.length > 0) {
      await cancelMedicineReminders(oldIds);
    }

    const inventoryRef = collection(db, 'pacientes', patientId, 'inventario');
    const inventorySnap = await getDocs(inventoryRef);

    const allNotificationIds = [];
    const reminderMap = {};

    for (const docItem of inventorySnap.docs) {
      const medicine = {
        id: docItem.id,
        ...docItem.data(),
      };

      if (
        medicine.reminderEnabled &&
        Array.isArray(medicine.schedules) &&
        medicine.schedules.length > 0
      ) {
        const ids = await scheduleMedicineReminders({
          medicineId: medicine.id,
          medicineName: medicine.name,
          schedules: medicine.schedules,
        });

        allNotificationIds.push(...ids);

        medicine.schedules.forEach((schedule, index) => {
          const doseKey = getDoseKey({
            medicineId: medicine.id,
            scheduleIndex: index,
          });

          const start = index * 3;
          const doseNotificationIds = ids.slice(start, start + 3);

          reminderMap[doseKey] = doseNotificationIds;
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
      'Recordatorios del paciente programados:',
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
      console.log('Reintentos cancelados para dosis:', doseKey);
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