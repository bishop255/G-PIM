export interface MedicineSchedule {
  hour: number;
  minute: number;
}

export interface Medicine {
  id?: string;
  name: string;
  dosage?: string;
  // Inventario
  currentStock: number;
  initialStock?: number;
  minStock: number;
  // Configuración de consumo
  dailyDose: number;
  // Horarios reales
  schedules?: MedicineSchedule[];
  // Notificaciones
  notificationIds?: string[];
  // Categoría
  category:
    | 'Tableta'
    | 'Jarabe'
    | 'Inyección'
    | 'Otro'
    | string;
  // Metadata
  createdAt?: any;
  updatedAt?: any;
  lastUpdated?: any;
}