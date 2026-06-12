import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const getInventoryCacheKey = (pacienteId) => `inventoryCache_${pacienteId}`;

export const useInventory = (pacienteId) => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOfflineData, setIsOfflineData] = useState(false);

  const loadCachedInventory = async () => {
    try {
      if (!pacienteId) return false;

      const cachedRaw = await AsyncStorage.getItem(
        getInventoryCacheKey(pacienteId)
      );

      if (!cachedRaw) return false;

      const cachedMedicines = JSON.parse(cachedRaw);

      if (Array.isArray(cachedMedicines)) {
        setMedicines(cachedMedicines);
        setIsOfflineData(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error cargando inventario local:', error);
      return false;
    }
  };

  const saveInventoryCache = async (medicineList) => {
    try {
      if (!pacienteId) return;

      await AsyncStorage.setItem(
        getInventoryCacheKey(pacienteId),
        JSON.stringify(medicineList)
      );
    } catch (error) {
      console.error('Error guardando inventario local:', error);
    }
  };

  useEffect(() => {
    let unsubscribe = null;
    let isMounted = true;

    const startInventoryListener = async () => {
      if (!pacienteId) {
        setMedicines([]);
        setLoading(false);
        setIsOfflineData(false);
        return;
      }

      setLoading(true);

      const hasCache = await loadCachedInventory();

      if (hasCache && isMounted) {
        setLoading(false);
      }

      const inventoryRef = collection(db, 'pacientes', pacienteId, 'inventario');

      unsubscribe = onSnapshot(
        inventoryRef,
        async (snapshot) => {
          const medicineList = snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }));

          if (!isMounted) return;

          setMedicines(medicineList);
          setIsOfflineData(false);
          setLoading(false);

          await saveInventoryCache(medicineList);
        },
        async (error) => {
          console.error('Error obteniendo inventario:', error);

          const loadedCache = await loadCachedInventory();

          if (!loadedCache && isMounted) {
            setMedicines([]);
          }

          if (isMounted) {
            setLoading(false);
          }
        }
      );
    };

    startInventoryListener();

    return () => {
      isMounted = false;

      if (unsubscribe) {
        unsubscribe();
      }
    };
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
      const medicineRef = doc(
        db,
        'pacientes',
        pacienteId,
        'inventario',
        medicineId
      );

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

      const medicineRef = doc(
        db,
        'pacientes',
        pacienteId,
        'inventario',
        medicine.id
      );

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
      const medicineRef = doc(
        db,
        'pacientes',
        pacienteId,
        'inventario',
        medicineId
      );

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
        stockUnit: medicineData.stockUnit || 'unidad',
        previousStock: currentStock,
        newStock,
        description: `Reposición de ${quantityToAdd} ${
          medicineData.stockUnit || 'unidad'
        }`,
      });
    } catch (error) {
      console.error('Error reponiendo stock:', error);
    }
  };

  const addMedicine = async (medicineData) => {
    try {
      const inventoryRef = collection(db, 'pacientes', pacienteId, 'inventario');

      await addDoc(inventoryRef, {
        ...medicineData,
        currentStock: Number(medicineData.currentStock) || 0,
        initialStock:
          Number(medicineData.initialStock) ||
          Number(medicineData.currentStock) ||
          0,
        minStock: Number(medicineData.minStock) || 0,
        doseAmount: Number(medicineData.doseAmount) || 1,
        dailyDose: Number(medicineData.dailyDose) || 0,
        notificationIds: [],
        lastUpdated: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error agregando medicina:', error);
    }
  };

  const updateMedicine = async (medicineId, updateData) => {
    try {
      const medicineRef = doc(
        db,
        'pacientes',
        pacienteId,
        'inventario',
        medicineId
      );

      await updateDoc(medicineRef, {
        ...updateData,
        notificationIds: [],
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error actualizando medicamento: ', error);
    }
  };

  const deleteMedicine = async (medicineId) => {
    try {
      const medicineRef = doc(
        db,
        'pacientes',
        pacienteId,
        'inventario',
        medicineId
      );

      await deleteDoc(medicineRef);
    } catch (error) {
      console.error('Error al eliminar el medicamento: ', error);
    }
  };

  return {
    medicines,
    loading,
    isOfflineData,
    updateMedicineStock,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    consumeDose,
    replenishStock,
    addMovement,
  };
};