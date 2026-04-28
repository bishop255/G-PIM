    import * as Notifications from 'expo-notifications';
    import * as Device from 'expo-device';
    import { Platform } from 'react-native';

    Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
    });

    export const setupNotifications = async () => {
    if (!Device.isDevice) {
        console.log('Las notificaciones funcionan mejor en dispositivo físico.');
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Permiso de notificaciones denegado.');
        return false;
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('stock-alerts', {
        name: 'Alertas de stock',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#E74C3C',
        });
    }

    return true;
    };

    export const sendLocalStockNotification = async ({ title, body }) => {
    await Notifications.scheduleNotificationAsync({
        content: {
        title,
        body,
        sound: true,
        },
        trigger: null,
    });
    };