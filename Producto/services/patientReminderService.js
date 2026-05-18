import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  getDocs,
} from 'firebase/firestore';

import { db } from '../database/firebaseConfig';

import {
  scheduleMedicineReminders,
  cancelMedicineReminders,
} from './notificationService';

const getStorageKey = (patientId) => `patientReminderIds_${patientId}`;

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

    const newNotificationIds = [];

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

        newNotificationIds.push(...ids);
      }
    }

    await AsyncStorage.setItem(
      getStorageKey(patientId),
      JSON.stringify(newNotificationIds)
    );

    console.log('Recordatorios del paciente programados:', newNotificationIds.length);
  } catch (error) {
    console.error('Error programando recordatorios del paciente:', error);
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
  } catch (error) {
    console.error('Error limpiando recordatorios del paciente:', error);
  }
};