import ProfileScreen from './screens/interfazCuidador/ProfileScreen';
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
import HistoryScreen from './screens/interfazCuidador/HistoryScreen';
import { setupNotifications } from './services/notificationService';
import SettingsScreen from './screens/interfazCuidador/SettingsScreen';

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [settings, setSettings] = useState({ darkMode: false, largeText: false})

useEffect(() => {
// setupNotifications(); // ⚠️ Activar solo en development build

  const timer = setTimeout(() => {
    setScreen('select');
  }, 3500);

  return () => clearTimeout(timer);
}, []);

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

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

  // Formulario paciente
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
    settings={settings}
    onAddPress={() => setScreen('addMedicine')}
    // ... otros on...Press
    onSettingsPress={() => setScreen('settings')}
    onProfilePress={() => setScreen('profile')} // <--- ESTA ES LA CONEXIÓN CLAVE
  />
);
  }

    //Detalles Medicamento
  if (screen === 'medicineDetail') {
  return (
    <MedicineDetailScreen
      settings={settings}
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
        settings={settings}
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
      settings={settings}
      onBack={() => setScreen('inventory')}
      onGoInventory={() => setScreen('inventory')}
      onGoAlerts={() => setScreen('alerts')}
      />
    );
  }

  // Perfil 
  // Lógica para mostrar la pantalla de Perfil
  if (screen === 'profile') {
    return (
      <ProfileScreen 
        onBack={() => setScreen('inventory')} // Esto hace que el botón "Volver" funcione
      />
    );
  }

  //----------Boton Hamburguesa----------------

  // Historial Movimientos
  if (screen === 'history') {
    return (
      <HistoryScreen
      onBack={() => setScreen('inventory')}
      />
    );
  }

  //Ajuste
  if (screen === 'settings') {
    return (
      <SettingsScreen
      settings={settings}
      onBack={() => setScreen('inventory')}
      onUpdateSettings={updateSettings}
      />
    )
  }



  return null;
}