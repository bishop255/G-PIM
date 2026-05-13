import React, { useState, useEffect } from 'react';

import { Alert } from 'react-native';
import { auth, db } from './database/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import SplashScreen from './screens/SplashScreen';
import UserTypeSelectionScreen from './screens/UserTypeSelectionScreen';

import LoginScreen from './screens/Auth/LoginScreen';
import RegisterScreen from './screens/Auth/RegisterScreen';

import PatientFormScreen from './screens/interfazAdultoMayor/PatientFormScreen';

import LinkPatientScreen from './screens/interfazAdultoMayor/LinkPatientScreen';
import PatientQRScreen from './screens/interfazAdultoMayor/PatientQRScreen';
import PatientWaitingLinkScreen from './screens/interfazAdultoMayor/PatientWaitingLinkScreen';

import HomeScreen from './screens/interfazAdultoMayor/HomeScreen';
import EmergencyScreen from './screens/interfazAdultoMayor/EmergencyScreen';


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
  const [patientId, setPatientId] = useState(null);
  const [adultPatientData, setAdultPatientData] = useState(null);

useEffect(() => {
// setupNotifications(); // ⚠️ Activar solo en development build

  const unsubscribe = onAuthStateChanged(auth, async (user) => {

    setTimeout(async () => {

      if (user) {

        try {

          const userRef = doc(db, 'usuarios', user.uid);

          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {

            const userData = userSnap.data();

            // Si ya tiene paciente -> inventario
            if (userData.hasPatient && userData.patientId) {
              setPatientId(userData.patientId)
              setScreen('inventory'); 
            }

            // Si NO tiene paciente -> formulario
            else {
              setPatientId(null);
              setScreen('patientForm');
            }

          } else {

            setScreen('select');

          }

        } catch (error) {

          console.log(error);
          setScreen('select');

        }

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
      hasPatient: false,
      patientId: null,
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
    // onAuthStateChanged decidirá si va a inventory o patientForm
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
    setPatientId(null)
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
            setScreen('login'); // Familiar -> login -> Home
          } else {
            setScreen('patientWaitingLink'); // Paciente -> QR Vinculación -> Home
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
        onSaved={(newPatientId) => {
          setPatientId(newPatientId);
          setScreen('inventory');
        }}
        onCancel={() => setScreen('select')}
      />
    );
  }

  //---------- Flujo Paciente ----------------

  if (screen === 'linkPatient') {
  return (
    <LinkPatientScreen
      settings={settings}
      patientId={patientId}
      onBack={() => setScreen('inventory')}
      onLinked={(newPatientId) => {
        setPatientId(newPatientId);
        setScreen('inventory');
      }}
    />
  );
}

  if (screen === 'patientWaitingLink') {
  return (
    <PatientWaitingLinkScreen
      onBack={() => setScreen('select')}
      onLinked={({ patientId, patientData }) => {
        setPatientId(patientId);
        setAdultPatientData(patientData);
        setScreen('adultoMayorHome');
      }}
    />
  );
}

  if (screen === 'patientQR') {
  return (
    <PatientQRScreen
      patientId={patientId}
      onBack={() => setScreen('select')}
    />
  );
}

  if (screen === 'adultoMayorHome') {
  return (
    <HomeScreen
      patientData={adultPatientData}
      onBack={() => setScreen('select')}
      onTakeMedicine={() =>
        Alert.alert('Próximamente', 'Aquí irá la acción de tomar medicamento')
      }
      onLowStock={() =>
        Alert.alert('Próximamente', 'Aquí irá la opción de stock bajo')
      }
      onEmergency={() => setScreen('adultoMayorEmergency')}
    />
  );
}

  if (screen === 'adultoMayorEmergency') {
  return (
    <EmergencyScreen
      onBack={() => setScreen('adultoMayorHome')}
      onCallFamily={() =>
        Alert.alert('Próximamente', 'Aquí irá la llamada al familiar')
      }
      onSendAlert={() => {}}
      onCancel={() => setScreen('adultoMayorHome')}
    />
  );
}

  //---------- Inicio ----------------


  // Inventario
  if (screen === 'inventory') {
    return (
      <InventoryScreen
        patientId={patientId}
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
        onLinkPatientPress={() => setScreen('linkPatient')}
      />
    );
  }

    //Detalles Medicamento
  if (screen === 'medicineDetail') {
  return (
    <MedicineDetailScreen
      patientId={patientId}
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
        patientId={patientId}
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
        patientId={patientId}
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
        patientId={patientId}
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
      patientId={patientId}
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