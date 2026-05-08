import React, { useState, useEffect } from 'react';

import { Alert } from 'react-native';
import { auth, db } from './database/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import SplashScreen from './screens/SplashScreen';
import UserTypeSelectionScreen from './screens/UserTypeSelectionScreen';

import LoginScreen from './screens/Auth/LoginScreen';
import RegisterScreen from './screens/Auth/RegisterScreen';

import PatientFormScreen from './screens/interfazAdultoMayor/PatientFormScreen';

import InventoryScreen from './screens/interfazCuidador/InventoryScreen';
import AddMedicineScreen from './screens/interfazCuidador/AddMedicineScreen';
import EditMedicineScreen from './screens/interfazCuidador/EditMedicineScreen';
import AlertsScreen from './screens/interfazCuidador/AlertsScreen';
import OffersScreen from './screens/interfazCuidador/OffersScreen';
import MedicineDetailScreen from './screens/interfazCuidador/MedicineDetailScreen';
import HistoryScreen from './screens/interfazCuidador/HistoryScreen';
import SettingsScreen from './screens/interfazCuidador/SettingsScreen';
import ProfileScreen from './screens/interfazCuidador/ProfileScreen';



export default function App() {
  const [screen, setScreen] = useState('splash');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [settings, setSettings] = useState({ darkMode: false, largeText: false})

useEffect(() => {
// setupNotifications(); // ⚠️ Activar solo en development build

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setTimeout(() => {
      if (user) {
        setScreen('inventory');
      } else {
        setScreen('select');
      }
    }, 2000);
  });

  return unsubscribe;
}, []);

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

const handleRegister = async ({ name, email, phone, password, relationship }) => {
  if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
    Alert.alert('Campos incompletos', 'Completa todos los campos.');
    return;
  }

  if (password.length < 6) {
    Alert.alert(
      'Contraseña inválida',
      'La contraseña debe tener al menos 6 caracteres.'
    );
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    const user = userCredential.user;

    await setDoc(doc(db, 'usuarios', user.uid), {
      uid: user.uid,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      relationship: relationship || 'No definido',
      role: 'cuidador',
      createdAt: serverTimestamp(),
    });

    Alert.alert('Cuenta creada', 'Usuario registrado correctamente.');
    setScreen('patientForm');
    return true;
  } catch (error) {
    console.error('Error registrando usuario:', error);

    if (error.code === 'auth/email-already-in-use') {
      Alert.alert('Correo en uso', 'Ya existe una cuenta con este correo.');
      return false;
    }

    if (error.code === 'auth/invalid-email') {
      Alert.alert('Correo inválido', 'Ingresa un correo válido.');
      return false;
    }

    Alert.alert('Error', 'No se pudo crear el usuario.');
  }
};

const handleLogin = async ({ email, password }) => {
  if (!email.trim() || !password.trim()) {
    Alert.alert('Campos incompletos', 'Ingresa correo y contraseña.');
    return false;
  }

  try {
    await signInWithEmailAndPassword(auth, email.trim(), password);

    Alert.alert('Bienvenido', 'Inicio de sesión exitoso.');
    setScreen('inventory');
    return true;
  } catch (error) {
    console.error('Error iniciando sesión:', error);

    if (error.code === 'auth/invalid-email') {
      Alert.alert('Correo inválido', 'Ingresa un correo válido.');
      return false;
    }

    if (
      error.code === 'auth/user-not-found' ||
      error.code === 'auth/wrong-password' ||
      error.code === 'auth/invalid-credential'
    ) {
      Alert.alert('Error', 'Correo o contraseña incorrectos.');
      return false;
    }

    Alert.alert('Error', 'No se pudo iniciar sesión.');
    return false;
  }
};

const handleLogout = async () => {
  try {
    await signOut(auth);
    setSelectedMedicine(null)
    setScreen('login')
  } catch (error) {
    console.error('Error cerrando sesión', error);
    Alert.alert('Error', 'No se pudo cerrar sesión');
  }
  
}

  // Splash
  if (screen === 'splash') return <SplashScreen />;

  // Selección
  if (screen === 'select') {
    return (
      <UserTypeSelectionScreen
        onSelect={(type) => {
          if (type === 'admin') {
            setScreen('login'); // Familiar -> login ->
          } else {
            setScreen('inventory'); // Paciente -> directo
          }
        }}
      />
    );
  }

  //---------- Flujo Familiar ----------------

  //Inicio Sesion
  if (screen === 'login') {
    return (
      <LoginScreen
        settings={settings}
        onBack={() => setScreen('select')}
        onGoRegister={() => setScreen('register')}
        onLogin={handleLogin}
      />
    )
  }

  //Registro de Usuario
  if (screen === 'register') {
    return (
      <RegisterScreen
      settings={settings}
      onBack={() => setScreen('login')}
      onGoLogin={() => setScreen('login')}
      onRegister={handleRegister}
      />
    )
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

  //---------- Inicio ----------------


  // Inventario
  if (screen === 'inventory') {
    return (
      <InventoryScreen
        settings={settings}
        onAddPress={() => setScreen('addMedicine')}
        onEditPress={(medicine) => {
          setSelectedMedicine(medicine);
          setScreen('editMedicine');
        }}
        onAlertsPress={() => setScreen('alerts')}
        onOffersPress={() => setScreen('offers')}
        onMedicinePress={(medicine) => {
          setSelectedMedicine(medicine);
          setScreen('medicineDetail');
        }}
        onHistoryPress={() => setScreen('history')}
        onSettingsPress={() => setScreen('settings')}
        onProfilePress={() => setScreen('profile')}
        onLogout={handleLogout}
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
        settings={settings}
        onCancel={() => setScreen('inventory')}
        onSaved={() => setScreen('inventory')}
      />
    );
  }

  // Editar
  if (screen === 'editMedicine') {
    return (
      <EditMedicineScreen
        settings={settings}
        medicine={selectedMedicine}
        onCancel={() => setScreen('inventory')}
        onSaved={() => {
          setSelectedMedicine(null);
          setScreen('inventory');
        }}
      />
    );
  }

  //----------Menu Navegacion----------------

  // Alertas
  if (screen === 'alerts') {
    return (
      <AlertsScreen
        settings={settings}
        onBack={() => setScreen('inventory')}
        onGoInventory={() => setScreen('inventory')}
        onGoOffers={() => setScreen('offers')}
        onGoProfile={() => setScreen('profile')}
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
      onGoProfile={() => setScreen('profile')}
      />
    );
  }

  // Perfil 
  if (screen === 'profile') {
    return (
      <ProfileScreen
        settings={settings}
        onBack={() => setScreen('inventory')}
        onLogout={handleLogout}
      />
    );
  }

  //----------Boton Hamburguesa----------------

  // Historial Movimientos
  if (screen === 'history') {
    return (
      <HistoryScreen
      settings={settings}
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