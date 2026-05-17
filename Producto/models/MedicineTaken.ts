export interface MedicineTaken {
  id?: string;

  patientId: string;

  medicineId: string;
  medicineName: string;

  scheduleIndex: number;
  scheduledTime: string;

  date: string;

  status: 'taken' | 'missed';

  source: 'manual' | 'notification';

  takenAt?: any;
  createdAt?: any;
}