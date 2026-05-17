import { useState, useEffect } from 'react';
import { db } from '../database/firebaseConfig';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  scheduleMedicineReminders,
  cancelMedicineReminders,
} from '../services/notificationService';

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

  const addMovement = async (movementData) => {
  try {
    const movementsRef = collection(db, 'pacientes', pacienteId, 'movimientos');

    await addDoc(movementsRef, {
      ...movementData,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error registrando movimiento:', error);
  }
};

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

  const consumeDose = async (medicine) => {
  try {
    const currentStock = Number(medicine.currentStock || 0);
    const dailyDose = Number(medicine.dailyDose || 0);

    const newStock = Math.max(currentStock - dailyDose, 0);

    const medicineRef = doc(db, 'pacientes', pacienteId, 'inventario', medicine.id);

    await updateDoc(medicineRef, {
      currentStock: newStock,
      updatedAt: serverTimestamp(),
    });

    await addMovement({
      type: 'consume',
      medicineId: medicine.id,
      medicineName: medicine.name,
      amount: dailyDose,
      previousStock: currentStock,
      newStock,
      description: `Consumo de ${dailyDose} unidad(es)`,
    });
  } catch (error) {
    console.error('Error consumiendo dosis:', error);
  }
};

const replenishStock = async (medicineId, amount) => {
  try {
    const medicineRef = doc(db, 'pacientes', pacienteId, 'inventario', medicineId);

    const medicineSnap = await getDoc(medicineRef);

    if (!medicineSnap.exists()) return;

    const medicineData = medicineSnap.data();
    const currentStock = Number(medicineData.currentStock || 0);
    const quantityToAdd = Number(amount || 0);
    const newStock = currentStock + quantityToAdd;

    await updateDoc(medicineRef, {
      currentStock: newStock,
      updatedAt: serverTimestamp(),
    });

    await addMovement({
      type: 'replenish',
      medicineId,
      medicineName: medicineData.name,
      amount: quantityToAdd,
      previousStock: currentStock,
      newStock,
      description: `Reposición de ${quantityToAdd} unidad(es)`,
    });
  } catch (error) {
    console.error('Error reponiendo stock:', error);
  }
};


  // MEDICAMENTO//


  //Agregar Medicamento//
  const addMedicine = async (medicineData) => {
    try {
      const inventoryRef = collection(db, 'pacientes', pacienteId, 'inventario');

      const medicineRef = await addDoc(inventoryRef, {
        ...medicineData,
        currentStock: Number(medicineData.currentStock) || 0,
        minStock: Number(medicineData.minStock) || 0,
        dailyDose: Number(medicineData.dailyDose) || 0,
        notificationIds: [],
        lastUpdated: serverTimestamp(),
      });

      if (
        medicineData.reminderEnabled &&
        Array.isArray(medicineData.schedules) &&
        medicineData.schedules.length > 0
      ) {
        const notificationIds = await scheduleMedicineReminders({
          medicineId: medicineRef.id,
          medicineName: medicineData.name,
          schedules: medicineData.schedules,
        });

        await updateDoc(medicineRef, {
          notificationIds,
        });
      }
    } catch (error) {
      console.error('Error agregando medicina:', error);
    }
  };

  //Actualizar Medicamento//

  const updateMedicine = async (medicineId, updateData) => {
    try {
      const medicineRef = doc(db, 'pacientes', pacienteId, 'inventario', medicineId);

      await updateDoc(medicineRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error actualizando medicamento: ', error);
    }
  };

  //Eliminar Medicamento//

  const deleteMedicine = async (medicineId) => {
    try {
      const medicineRef = doc(db, 'pacientes', pacienteId, 'inventario', medicineId);

      const medicineSnap = await getDoc(medicineRef);

      if (medicineSnap.exists()) {
        const medicineData = medicineSnap.data();

        if (Array.isArray(medicineData.notificationIds)) {
          await cancelMedicineReminders(medicineData.notificationIds);
        }
      }

      await deleteDoc(medicineRef);
    } catch (error) {
      console.error('Error al eliminar el medicamento: ', error);
    }
  };


  return {
    medicines,
    loading,
    updateMedicineStock,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    consumeDose,
    replenishStock,
    addMovement,
  };
};