import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

import { Platform, Alert } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../database/firebaseConfig';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const setupNotificationCategories = async () => {
  await Notifications.setNotificationCategoryAsync('MEDICINE_REMINDER', [
    {
      identifier: 'TAKEN',
      buttonTitle: '💊 Ya la tomé',
      options: {
        opensAppToForeground: true,
      },
    },
    {
      identifier: 'SNOOZE_5',
      buttonTitle: '⏰ Avisarme en 5 min',
      options: {
        opensAppToForeground: false,
      },
    },
  ]);
};

export const setupNotifications = async () => {
  try {
    console.log('Iniciando configuración de notificaciones...');

    await setupNotificationCategories();

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'G-PIM',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#42B65A',
        sound: 'default',
      });

      await Notifications.setNotificationChannelAsync('medicine-reminders', {
        name: 'Recordatorios de medicamentos',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 250, 500, 250, 700],
        lightColor: '#42B65A',
        sound: 'default',
      });

      await Notifications.setNotificationChannelAsync('stock-alerts', {
        name: 'Alertas de stock',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 300, 200, 300],
        lightColor: '#F39C12',
        sound: 'default',
      });

      console.log('Canales Android configurados.');
    }

    if (!Device.isDevice) {
      console.log('Las notificaciones push requieren un dispositivo físico.');
      return null;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    console.log('Estado permiso notificaciones:', existingStatus);

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    console.log('Estado final permiso notificaciones:', finalStatus);

    if (finalStatus !== 'granted') {
      Alert.alert(
        'Permiso requerido',
        'Activa las notificaciones para recibir alertas de G-PIM.'
      );
      return null;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ||
      Constants?.easConfig?.projectId ||
      '1e06884b-ad1c-46c4-9953-2acf61688c68';

    console.log('Project ID usado para push:', projectId);

    const tokenResponse = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    const token = tokenResponse.data;

    console.log('Expo push token generado:', token);

    const user = auth.currentUser;

    if (!user) {
      console.log('No hay usuario autenticado. No se guardó expoPushToken.');
      return token;
    }

    await updateDoc(doc(db, 'usuarios', user.uid), {
      expoPushToken: token,
    });

    console.log('Expo push token guardado en usuario:', user.uid);

    return token;
  } catch (error) {
    console.error('Error configurando notificaciones:', error);
    return null;
  }
};

export const scheduleMedicineReminder = async ({
  title = '💊 Hora de tomar medicamento',
  body = 'Recuerda registrar tu dosis en G-PIM.',
  hour,
  minute,
  medicineId,
  medicineName,
  scheduleIndex,
  reminderAttempt = 0,
}) => {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      categoryIdentifier: 'MEDICINE_REMINDER',
      data: {
        type: 'medicine_reminder',
        medicineId,
        medicineName,
        scheduleIndex,
        reminderAttempt,
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: 'medicine-reminders',
    },
  });
};

export const scheduleMedicineReminders = async ({
  medicineId,
  medicineName,
  schedules = [],
  scheduleIndexes = [],
}) => {
  const notificationIds = [];

  const addMinutesToSchedule = (hour, minute, extraMinutes) => {
    const date = new Date();
    date.setHours(Number(hour));
    date.setMinutes(Number(minute) + extraMinutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return {
      hour: date.getHours(),
      minute: date.getMinutes(),
    };
  };

  for (let index = 0; index < schedules.length; index++) {
    const schedule = schedules[index];
    const originalScheduleIndex = scheduleIndexes[index] ?? index;

    if (
      schedule?.hour === undefined ||
      schedule?.minute === undefined
    ) {
      continue;
    }

    const mainId = await scheduleMedicineReminder({
      medicineId,
      medicineName,
      scheduleIndex: originalScheduleIndex,
      reminderAttempt: 0,
      title: `💊 Hora de tomar ${medicineName}`,
      body: `Recuerda tomar tu dosis de ${medicineName}.`,
      hour: Number(schedule.hour),
      minute: Number(schedule.minute),
    });

    notificationIds.push(mainId);

    const retryOneTime = addMinutesToSchedule(
      schedule.hour,
      schedule.minute,
      5
    );

    const retryOneId = await scheduleMedicineReminder({
      medicineId,
      medicineName,
      scheduleIndex: originalScheduleIndex,
      reminderAttempt: 1,
      title: `⏰ Recordatorio: ${medicineName}`,
      body: `Aún no registras tu dosis de ${medicineName}.`,
      hour: retryOneTime.hour,
      minute: retryOneTime.minute,
    });

    notificationIds.push(retryOneId);

    const retryTwoTime = addMinutesToSchedule(
      schedule.hour,
      schedule.minute,
      10
    );

    const retryTwoId = await scheduleMedicineReminder({
      medicineId,
      medicineName,
      scheduleIndex: originalScheduleIndex,
      reminderAttempt: 2,
      title: `⚠️ Último aviso: ${medicineName}`,
      body: `Registra tu dosis de ${medicineName} si ya la tomaste.`,
      hour: retryTwoTime.hour,
      minute: retryTwoTime.minute,
    });

    notificationIds.push(retryTwoId);
  }

  console.log(
    `Recordatorios + reintentos programados para ${medicineName}:`,
    notificationIds.length
  );

  return notificationIds;
};

export const scheduleSnoozeReminder = async ({
  medicineId,
  medicineName = 'tu medicamento',
  scheduleIndex = 0,
}) => {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: `⏰ Recordatorio: ${medicineName}`,
      body: 'Te avisamos nuevamente para que tomes tu medicamento.',
      sound: true,
      categoryIdentifier: 'MEDICINE_REMINDER',
      data: {
        type: 'medicine_reminder',
        medicineId,
        medicineName,
        scheduleIndex,
        snoozed: true,
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 300,
      channelId: 'medicine-reminders',
    },
  });
};

export const cancelMedicineReminders = async (notificationIds = []) => {
  try {
    for (const notificationId of notificationIds) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    }
  } catch (error) {
    console.error('Error cancelando recordatorios:', error);
  }
};

export const scheduleStockLocalNotification = async ({
  title = '⚠️ Stock crítico',
  body,
  medicineName,
  type = 'stock_alert',
}) => {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body: body || `${medicineName} necesita reposición pronto.`,
      sound: true,
      data: {
        type,
        medicineName,
      },
    },
    trigger: null,
  });
};

export const testLocalNotification = async () => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Prueba G-PIM',
        body: 'Si ves esto, las notificaciones locales funcionan.',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,
        channelId: 'medicine-reminders',
      },
    });

    console.log('Notificación local de prueba programada');
  } catch (error) {
    console.error('Error probando notificación local:', error);
  }
};

export const sendExpoPushNotification = async ({
  expoPushToken,
  title,
  body,
  data = {},
}) => {
  if (!expoPushToken) {
    console.log('No hay expoPushToken para enviar push.');
    return;
  }

  const message = {
    to: expoPushToken,
    sound: 'default',
    title,
    body,
    data,
  };

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();

    console.log('Respuesta push Expo:', result);

    return result;
  } catch (error) {
    console.error('Error enviando push:', error);
  }
};