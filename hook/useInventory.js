import {useState, useEffect} from 'react';
import {db} from '../database/firebaseConfig';
import { collection, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';

export const useInventory = (pacienteId) => { 
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!pacienteId) return;

        const inventoryRef = collection(db, 'pacientes', pacienteId, 'medicines');

        const unsubscribe = onSnapshot(inventoryRef, (snapshot) => {
            const medicineList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMedicines(medicineList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [pacienteId]);

    const updateMedicineStock = async (medicineId, newQuantity) => {
        try {
            const medicineRef = doc(db, 'pacientes', pacienteId, 'inventario', medicineId);
            await updateDoc(medicineRef, { currentStock: newQuantity });
        } catch (error) {
            console.error("Error actualizando stock:", error);
        }
    };

    const addMedicine = async (medicineData) => {
        try {
            const inventoryRef = collection(db, 'pacientes', pacienteId, 'inventario');
            await addDoc(inventoryRef, { ...medicineData, lastUpdated: serverTimestamp() });
        } catch (error) {
            console.error("Error agregando medicina:", error);
        }
    };

    return { medicines, loading, updateMedicineStock, addMedicine };
}
