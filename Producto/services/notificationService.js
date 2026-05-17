import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
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
      buttonTitle: 'Ya la tomé',
      options: {
        opensAppToForeground: true,
      },
    },
    {
      identifier: 'SNOOZE_5',
      buttonTitle: 'Avisarme en 5 min',
      options: {
        opensAppToForeground: false,
      },
    },
  ]);
};

export const setupNotifications = async () => {
  try {
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
    }

    if (!Device.isDevice) {
      console.log('Las notificaciones push requieren un dispositivo físico.');
      return null;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert(
        'Permiso requerido',
        'Activa las notificaciones para recibir alertas de G-PIM.'
      );
      return null;
    }

    const tokenResponse = await Notifications.getExpoPushTokenAsync();
    const token = tokenResponse.data;

    const user = auth.currentUser;

    if (user) {
      await updateDoc(doc(db, 'usuarios', user.uid), {
        expoPushToken: token,
      });
    }

    return token;
  } catch (error) {
    console.error('Error configurando notificaciones:', error);
    return null;
  }
};

export const scheduleMedicineReminder = async ({
  title = 'Hora de tomar medicamento',
  body = 'Recuerda registrar tu dosis en G-PIM.',
  hour,
  minute,
  medicineId,
  medicineName,
  scheduleIndex,
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
}) => {
  const notificationIds = [];

  for (let index = 0; index < schedules.length; index++) {
    const schedule = schedules[index];

    if (
      schedule?.hour === undefined ||
      schedule?.minute === undefined
    ) {
      continue;
    }

    const notificationId = await scheduleMedicineReminder({
      medicineId,
      medicineName,
      scheduleIndex: index,
      title: `Hora de tomar ${medicineName}`,
      body: `Recuerda tomar tu dosis de ${medicineName}.`,
      hour: Number(schedule.hour),
      minute: Number(schedule.minute),
    });

    notificationIds.push(notificationId);
  }

  return notificationIds;
};

export const scheduleSnoozeReminder = async ({
  medicineId,
  medicineName = 'tu medicamento',
}) => {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: `Recordatorio: ${medicineName}`,
      body: 'Te avisamos nuevamente para que tomes tu medicamento.',
      sound: true,
      categoryIdentifier: 'MEDICINE_REMINDER',
      data: {
        type: 'medicine_reminder',
        medicineId,
        snoozed: true,
      },
    },
    trigger: {
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

export const scheduleStockLocalNotification = async ({ medicineName }) => {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Stock crítico',
      body: `${medicineName} necesita reposición pronto.`,
      sound: true,
      data: {
        type: 'stock_alert',
      },
    },
    trigger: null,
  });
};

export const sendExpoPushNotification = async ({
  expoPushToken,
  title,
  body,
  data = {},
}) => {
  if (!expoPushToken) return;

  const message = {
    to: expoPushToken,
    sound: 'default',
    title,
    body,
    data,
  };

  try {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.error('Error enviando push:', error);
  }
};