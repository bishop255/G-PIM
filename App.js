import React, { useState, useEffect } from 'react';
import SplashScreen from './screens/SplashScreen';
import UserTypeSelectionScreen from './screens/interfazAdultoMayor/UserTypeSelectionScreen';
import InventoryScreen from './screens/interfazCuidador/InventoryScreen';
import AddMedicineScreen from './screens/interfazCuidador/AddMedicineScreen';
import EditMedicineScreen from './screens/interfazCuidador/EditMedicineScreen';
import PatientFormScreen from './screens/interfazAdultoMayor/PatientFormScreen';
import AlertsScreen from './screens/interfazCuidador/AlertsScreen';
import OffersScreen from './screens/interfazCuidador/OffersScreen';
import MedicineDetailScreen from './screens/interfazCuidador/MedicineDetailScreen';

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  useEffect(() => {

    const timer = setTimeout(() => {
      setScreen('select');
    }, 3500);
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
        onMedicinePress={(medicine) => {
          setSelectedMedicine(medicine);
          setScreen('medicineDetail');
        }}
        onAlertsPress={() => setScreen('alerts')}
        onOffersPress={() => setScreen('offers')}
      />
    );
  }

    //Detalles Medicamento
  if (screen === 'medicineDetail') {
  return (
    <MedicineDetailScreen
      medicine={selectedMedicine}
      onBack={() => setScreen('inventory')}
      onEdit={() => setScreen('editMedicine')}
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


  // Alertas
  if (screen === 'alerts') {
    return (
      <AlertsScreen
        onBack={() => setScreen('inventory')}
        onGoInventory={() => setScreen('inventory')}
        onGoOffers={() => setScreen('offers')}
      />
    );
  }

  // Ofertas
  if (screen === 'offers') {
    return (
      <OffersScreen
      onBack={() => setScreen('inventory')}
      onGoInventory={() => setScreen('inventory')}
      onGoAlerts={() => setScreen('alerts')}
      />
    );
  }

  return null;
}