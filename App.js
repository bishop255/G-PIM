import React, { useState, useEffect } from 'react';
import SplashScreen from './screens/SplashScreen';
import UserTypeSelectionScreen from './screens/interfazAdultoMayor/UserTypeSelectionScreen';
import InventoryScreen from './screens/interfazCuidador/InventoryScreen';
import AddMedicineScreen from './screens/interfazCuidador/AddMedicineScreen';
import EditMedicineScreen from './screens/interfazCuidador/EditMedicineScreen';
<<<<<<< HEAD
import PatientFormScreen from './screens/interfazAdultoMayor/PatientFormScreen';
=======
import AlertsScreen from './screens/interfazCuidador/AlertsScreen';
import OffersScreen from './screens/interfazCuidador/OffersScreen';
>>>>>>> 19375000cdd1b470a640cd7dff88c90c94e6c7da

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  useEffect(() => {

    const timer = setTimeout(() => {
      setScreen('select');
    }, 3500);
<<<<<<< HEAD
=======

>>>>>>> 19375000cdd1b470a640cd7dff88c90c94e6c7da
    return () => clearTimeout(timer);
  }, []);

  // Splash
  if (screen === 'splash') return <SplashScreen />;

  // Selección
  if (screen === 'select') {
    return (
      <UserTypeSelectionScreen
        onSelect={(type) => {
          if (type === 'admin') {
            setScreen('patientForm'); // Familiar → formulario
          } else {
            setScreen('inventory'); // Paciente → directo
          }
        }}
      />
    );
  }

  // FORMULARIO PACIENTE
  if (screen === 'patientForm') {
    return (
      <PatientFormScreen
        onSaved={() => setScreen('inventory')}
        onCancel={() => setScreen('select')}
      />
    );
  }

  // Inventario
  if (screen === 'inventory') {
    return (
      <InventoryScreen
        onAddPress={() => setScreen('addMedicine')}
        onEditPress={(medicine) => {
          setSelectedMedicine(medicine);
          setScreen('editMedicine');
        }}
        onAlertsPress={() => setScreen('alerts')}
        onOffersPress={() => setScreen('offers')}
      />
    );
  }

  // Añadir
  if (screen === 'addMedicine') {
    return (
      <AddMedicineScreen
        onCancel={() => setScreen('inventory')}
        onSaved={() => setScreen('inventory')}
      />
    );
  }

  // Editar
  if (screen === 'editMedicine') {
    return (
      <EditMedicineScreen
        medicine={selectedMedicine}
        onCancel={() => setScreen('inventory')}
        onSaved={() => {
          setSelectedMedicine(null);
          setScreen('inventory');
        }}
      />
    );
  }

<<<<<<< HEAD
=======
  // Alertas
  if (screen === 'alerts') {
    return (
      <AlertsScreen
        onBack={() => setScreen('inventory')}
        onGoInventory={() => setScreen('inventory')}
      />
    );
  }

  // Ofertas
  if (screen === 'offers') {
    return (
      <OffersScreen
      onBack={() => setScreen('inventory')}
      onGoInventory={() => setScreen('inventory')}
       />
    );
  }

>>>>>>> 19375000cdd1b470a640cd7dff88c90c94e6c7da
  return null;
}