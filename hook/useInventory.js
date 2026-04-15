import { useState, useEffect } from 'react';
import { db } from '../database/firebaseConfig';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

export const useInventory = (pacienteId) => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pacienteId) {
      setMedicines([]);
      setLoading(false);
      return;
    }

    const inventoryRef = collection(db, 'pacientes', pacienteId, 'inventario');

    const unsubscribe = onSnapshot(
      inventoryRef,
      (snapshot) => {
        const medicineList = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setMedicines(medicineList);
        setLoading(false);
      },
      (error) => {
        console.error('Error obteniendo inventario:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [pacienteId]);

  const updateMedicineStock = async (medicineId, newQuantity) => {
    try {
      const medicineRef = doc(db, 'pacientes', pacienteId, 'inventario', medicineId);

      await updateDoc(medicineRef, {
        currentStock: newQuantity,
        lastUpdated: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error actualizando stock:', error);
    }
  };

  const addMedicine = async (medicineData) => {
    try {
      const inventoryRef = collection(db, 'pacientes', pacienteId, 'inventario');

      await addDoc(inventoryRef, {
        ...medicineData,
        currentStock: Number(medicineData.currentStock) || 0,
        minStock: Number(medicineData.minStock) || 0,
        dailyDose: Number(medicineData.dailyDose) || 0,
        lastUpdated: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error agregando medicina:', error);
    }
  };

  return {
    medicines,
    loading,
    updateMedicineStock,
    addMedicine,
  };
};