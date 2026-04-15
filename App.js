import React, { useState, useEffect } from 'react';
import SplashScreen from './screens/SplashScreen';
import UserTypeSelectionScreen from './screens/interfazAdultoMayor/UserTypeSelectionScreen';
import InventoryScreen from './screens/interfazCuidador/InventoryScreen';
import AddMedicineScreen from './screens/interfazCuidador/AddMedicineScreen';

export default function App() {
  const [screen, setScreen] = useState('splash');

  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('select');
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  // 🟢 Splash
  if (screen === 'splash') {
    return <SplashScreen />;
  }

  // 🟢 Selección de usuario
  if (screen === 'select') {
    return (
      <UserTypeSelectionScreen
        onSelect={(type) => {
          console.log('Tipo seleccionado:', type);
          setScreen('inventory');
        }}
      />
    );
  }

  // 🟢 Inventario
  if (screen === 'inventory') {
    return (
      <InventoryScreen
        onAddPress={() => setScreen('addMedicine')}
      />
    );
  }

  // 🟢 Añadir medicamento
  if (screen === 'addMedicine') {
    return (
      <AddMedicineScreen
        onCancel={() => setScreen('inventory')}
        onSaved={() => setScreen('inventory')}
      />
    );
  }

  return null;
}