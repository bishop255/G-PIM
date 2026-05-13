// Servicio de notificaciones desactivado temporalmente para evitar errores en Expo Go

export const setupNotifications = async () => {
  console.log('Notificaciones desactivadas temporalmente en Expo Go.');
  return false;
};

export const scheduleStockNotification = async ({ title, body, seconds = 5 }) => {
  console.log('Notificación omitida:', { title, body, seconds });
  return null;
};

export const cancelAllStockNotifications = async () => {
  console.log('Cancelación de notificaciones omitida.');
  return null;
};