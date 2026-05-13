export interface Medicine {
    id?: String;
    name: string;
    dosage: string;
    currentStock: number;
    minStock: number;
    category: 'Tableta' | 'Jarabe' | 'Inyección' | 'Otro' | string;
    lastUpdated?: any; //Timestamp de Firebase
}