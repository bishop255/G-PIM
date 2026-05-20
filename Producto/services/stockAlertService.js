import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore';

import { db } from '../database/firebaseConfig';
import { scheduleStockLocalNotification } from './notificationService';

const pad = (value) => String(value).padStart(2, '0');

const getTodayKey = () => {
  const now = new Date();

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}`;
};

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
      body: `${medicine.name} ya no tiene stock disponible.`,
    };
  }

  if (remainingDays !== null && remainingDays <= 2) {
    return {
      type: 'stock_very_low',
      title: '⚠️ Se agota muy pronto',
      body: `${medicine.name} tiene stock para ${remainingDays} día(s).`,
    };
  }

  if (currentStock <= minStock) {
    return {
      type: 'stock_critical',
      title: '⚠️ Stock crítico',
      body: `${medicine.name} está igual o bajo el stock mínimo.`,
    };
  }

  if (remainingDays !== null && remainingDays <= 5) {
    return {
      type: 'stock_preventive',
      title: '📦 Reposición preventiva',
      body: `${medicine.name} tiene stock para ${remainingDays} día(s).`,
    };
  }

  return null;
};

export const checkAndNotifyStockAlerts = async (patientId) => {
  if (!patientId) return;

  try {
    const today = getTodayKey();

    const inventoryRef = collection(db, 'pacientes', patientId, 'inventario');
    const inventorySnap = await getDocs(inventoryRef);

    for (const docItem of inventorySnap.docs) {
      const medicine = {
        id: docItem.id,
        ...docItem.data(),
      };

      const alertInfo = getStockAlertInfo(medicine);

      if (!alertInfo) continue;

      const storageKey = `stockAlert_${patientId}_${medicine.id}_${alertInfo.type}_${today}`;

      const alreadySent = await AsyncStorage.getItem(storageKey);

      if (alreadySent === 'true') continue;

      await scheduleStockLocalNotification({
        title: alertInfo.title,
        body: alertInfo.body,
        medicineName: medicine.name,
        type: alertInfo.type,
      });

      await AsyncStorage.setItem(storageKey, 'true');
    }
  } catch (error) {
    console.error('Error revisando alertas locales de stock:', error);
  }
};