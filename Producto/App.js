import React, { useState, useEffect, useRef } from 'react';

import { Alert } from 'react-native';
import { auth, db } from './database/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, addDoc, collection, query, where, onSnapshot ,serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { registerMedicineDoseTaken } from './services/medicineTakenService';
import { schedulePatientMedicineReminders, cancelPatientDoseReminders } from './services/patientReminderService';
import {
  scheduleSnoozeReminder, setupNotifications,
} from './services/notificationService';
import { checkAndNotifyStockAlerts } from './services/stockAlertService';

// Importación de pantallas
import SplashScreen from './screens/SplashScreen';
import UserTypeSelectionScreen from './screens/UserTypeSelectionScreen';

import LoginScreen from './screens/Auth/LoginScreen';
import RegisterScreen from './screens/Auth/RegisterScreen';

import PatientFormScreen from './screens/interfazAdultoMayor/PatientFormScreen';
import PatientQRScreen from './screens/interfazAdultoMayor/PatientQRScreen';
import PatientWaitingLinkScreen from './screens/interfazAdultoMayor/PatientWaitingLinkScreen';

import HomeScreen from './screens/interfazAdultoMayor/HomeScreen';
import MyMedicinesOffersScreen from './screens/interfazCuidador/MyMedicinesOffersScreen';
import EmergencyScreen from './screens/interfazAdultoMayor/EmergencyScreen';
import TakeMedicineScreen from './screens/interfazAdultoMayor/TakeMedicineScreen';
import PatientLowStockScreen from './screens/interfazAdultoMayor/PatientLowStockScreen';

import LinkPatientScreen from './screens/interfazCuidador/LinkPatientScreen';
import InventoryScreen from './screens/interfazCuidador/InventoryScreen';
import AddMedicineScreen from './screens/interfazCuidador/AddMedicineScreen';
import EditMedicineScreen from './screens/interfazCuidador/EditMedicineScreen';
import AlertsScreen from './screens/interfazCuidador/AlertsScreen';
import OffersScreen from './screens/interfazCuidador/OffersScreen';
import MedicineDetailScreen from './screens/interfazCuidador/MedicineDetailScreen';
import HistoryScreen from './screens/interfazCuidador/HistoryScreen';
import SettingsScreen from './screens/interfazCuidador/SettingsScreen';
import ProfileScreen from './screens/interfazCuidador/ProfileScreen';
import EditProfileScreen from './screens/interfazCuidador/EditProfileScreen';
import DashboardScreen from './screens/interfazCuidador/DashboardScreen';
import EmergencyHistoryScreen from './screens/interfazCuidador/EmergencyHistoryScreen';


export default function App() {
  const [screen, setScreen] = useState('splash');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [settings, setSettings] = useState({ darkMode: false, largeText: false})
  const [patientId, setPatientId] = useState(null);
  const [adultPatientData, setAdultPatientData] = useState(null);
  const lastReminderFingerprintRef = useRef(null);
  const schedulingRemindersRef = useRef(false);

  useEffect(() => {
  const subscription = Notifications.addNotificationResponseReceivedListener(
    async (response) => {
      const actionId = response.actionIdentifier;
      const data = response.notification.request.content.data;

      const medicineId = data?.medicineId;
      const medicineName = data?.medicineName || 'tu medicamento';

      if (!medicineId || !patientId) return;

      // Usuario tocó "Avisarme en 5 min" 
      if (actionId === 'SNOOZE_5') {
        const notificationId = response.notification.request.identifier;

        await scheduleSnoozeReminder({
          medicineId,
          medicineName,
        });

        try {
          await Notifications.dismissNotificationAsync(notificationId);
        } catch (error) {
          console.log('No se pudo ocultar la notificación:', error);
        }

        return;
      }

      // Usuario tocó "Ya la tomé"
      if (actionId === 'TAKEN') {
        const scheduleIndex = Number(data?.scheduleIndex ?? 0);
        const notificationId = response.notification.request.identifier;

        const result = await registerMedicineDoseTaken({
          patientId,
          medicineId,
          scheduleIndex,
          source: 'notification',
          allowOutsideWindow: true,
        });

        try {
          await Notifications.dismissNotificationAsync(notificationId);
        } catch (error) {
          console.log('No se pudo ocultar la notificación:', error);
        }

        if (!result.ok) {
          console.log('No se pudo registrar la dosis:', result.message);
          return;
        }

        await cancelPatientDoseReminders({
          patientId,
          medicineId,
          scheduleIndex,
        });

        await Notifications.scheduleNotificationAsync({
          content: {
            title: '✅ Dosis registrada',
            body: `${medicineName} fue marcado como tomado.`,
            sound: true,
          },
          trigger: null,
        });
      }
    }
  );

  return () => {
    subscription.remove();
  };
}, [patientId]);

useEffect(() => {
  // setupNotifications(); //  Se activa cuando hay usuario autenticado


  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    setTimeout(async () => {
      if (user) {
        await setupNotifications();

        try {
          const userRef = doc(db, 'usuarios', user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();

            // Si ya tiene paciente -> inventario
            if (userData.hasPatient && userData.patientId) {
              setPatientId(userData.patientId);

              await checkAndNotifyStockAlerts(userData.patientId);
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
        try {
          const savedAdultPatientId = await AsyncStorage.getItem('adultPatientId');

          if (savedAdultPatientId) {
            const patientRef = doc(db, 'pacientes', savedAdultPatientId);
            const patientSnap = await getDoc(patientRef);

            if (patientSnap.exists()) {
              setPatientId(savedAdultPatientId);
              setAdultPatientData({
                id: patientSnap.id,
                ...patientSnap.data(),
              });

              await setupNotifications();
              await schedulePatientMedicineReminders(savedAdultPatientId);

              setScreen('adultoMayorHome');
            } else {
              await AsyncStorage.removeItem('adultPatientId');
              setScreen('select');
            }
          } else {
            setScreen('select');
          }
        } catch (error) {
          console.log('Error cargando paciente guardado:', error);
          setScreen('select');
        }
      }
    }, 2000);
  });

  return unsubscribe;
}, []);

  useEffect(() => {
    const isAdultPatientFlow =
      screen === 'adultoMayorHome' ||
      screen === 'takeMedicine' ||
      screen === 'adultoMayorEmergency';

    if (!patientId || !isAdultPatientFlow) return;

    const linkQuery = query(
      collection(db, 'patientLinkRequests'),
      where('patientId', '==', patientId)
    );

    const unsubscribe = onSnapshot(linkQuery, async (snapshot) => {
      const requests = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      const hasActiveLink = requests.some(
        (item) => item.estado === 'vinculado'
      );

      const hasUnlinkedRequest = requests.some(
        (item) => item.estado === 'desvinculado'
      );

      if (!hasActiveLink && hasUnlinkedRequest) {
        await AsyncStorage.removeItem('adultPatientId');

        setPatientId(null);
        setAdultPatientData(null);

        Alert.alert(
          'Paciente desvinculado',
          'La conexión con el cuidador fue finalizada.'
        );

        setScreen('patientWaitingLink');
      }
    });

    return unsubscribe;
  }, [patientId, screen]);

useEffect(() => {
  const isAdultPatientFlow =
    screen === 'adultoMayorHome' ||
    screen === 'takeMedicine' ||
    screen === 'adultoMayorEmergency';

  if (!patientId || !isAdultPatientFlow) return;

  const inventoryRef = collection(db, 'pacientes', patientId, 'inventario');

  const buildReminderFingerprint = (snapshot) => {
    const reminderData = snapshot.docs
      .map((docItem) => {
        const data = docItem.data();

        return {
          id: docItem.id,
          name: data.name || '',
          reminderEnabled: data.reminderEnabled === true,
          dailyDose: Number(data.dailyDose || 0),
          schedules: Array.isArray(data.schedules) ? data.schedules : [],
        };
      })
      .sort((a, b) => a.id.localeCompare(b.id));

    return JSON.stringify(reminderData);
  };

  const unsubscribe = onSnapshot(
    inventoryRef,
    async (snapshot) => {
      const newFingerprint = buildReminderFingerprint(snapshot);

      if (lastReminderFingerprintRef.current === newFingerprint) {
        console.log('Inventario cambió, pero los horarios siguen iguales. No se reprograma.');
        return;
      }

      if (schedulingRemindersRef.current) {
        console.log('Ya se están reprogramando recordatorios. Se omite este ciclo.');
        return;
      }

      try {
        schedulingRemindersRef.current = true;
        lastReminderFingerprintRef.current = newFingerprint;

        console.log('Horarios modificados. Reprogramando recordatorios del paciente...');
        await schedulePatientMedicineReminders(patientId);
      } catch (error) {
        console.error('Error reprogramando recordatorios:', error);
      } finally {
        schedulingRemindersRef.current = false;
      }
    },
    (error) => {
      console.error('Error escuchando cambios del inventario:', error);
    }
  );

  return unsubscribe;
}, [patientId, screen]);


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
    // onAuthStateChanged decidirá si va al inventario o registro de paciente
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

  //---------- AUTH ----------------

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
      onLinked={() => {
        Alert.alert('Vinculación exitosa', 'El paciente ya está conectado.');
        setScreen('inventory');
      }}
    />
  );
}

  if (screen === 'patientWaitingLink') {
  return (
    <PatientWaitingLinkScreen
      onBack={() => setScreen('select')}
      onLinked={async ({ patientId, patientData }) => {
        await AsyncStorage.setItem('adultPatientId', patientId);

        setPatientId(patientId);
        setAdultPatientData(patientData);

        await setupNotifications();

        await schedulePatientMedicineReminders(patientId);

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
      onTakeMedicine={() => setScreen('takeMedicine')}
      onLowStock={() => setScreen('patientLowStock')}
      onEmergency={() => setScreen('adultoMayorEmergency')}
    />
  );
}

  if (screen === 'adultoMayorEmergency') {
    return (
      <EmergencyScreen
        patientId={patientId}
        onBack={() => setScreen('adultoMayorHome')}
        onCancel={() => setScreen('adultoMayorHome')}
      />
    );
  }

  if (screen === 'takeMedicine') {
    return (
      <TakeMedicineScreen
        patientId={patientId}
        onBack={() => setScreen('adultoMayorHome')}
      />
    );
}

// Pantalla para reportar al cuidador que un medicamento está por agotarse
  if (screen === 'patientLowStock') {
    return (
      <PatientLowStockScreen
        patientId={patientId}
        settings={settings}
        onBack={() => setScreen('adultoMayorHome')}
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
        onEmergencyHistoryPress={() => setScreen('emergencyHistory')}
        onHistoryPress={() => setScreen('history')}
        onSettingsPress={() => setScreen('settings')}
        onProfilePress={() => setScreen('profile')}
        onDashboardPress={() => setScreen('dashboard')}
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

  // Dashboard
  if (screen === 'dashboard') {
    return (
      <DashboardScreen
        patientId={patientId}
        settings={settings}
        onBack={() => setScreen('inventory')}
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
  // Pantalla principal del comparador de ofertas
  if (screen === 'offers') {
    return (
      <OffersScreen
        patientId={patientId}
        settings={settings}
        onBack={() => setScreen('inventory')}
        onGoInventory={() => setScreen('inventory')}
        onGoAlerts={() => setScreen('alerts')}
        onGoProfile={() => setScreen('profile')}
        onGoMyMedicines={() => setScreen('myMedicinesOffers')}
      />
    );
  }

  // Pantalla que muestra los medicamentos del paciente con comparador de ofertas
  if (screen === 'myMedicinesOffers') {
    return (
      <MyMedicinesOffersScreen
        patientId={patientId}
        settings={settings}
        onBack={() => setScreen('offers')}
      />
    );
  }

  // Perfil 
  if (screen === 'profile') {
    return (
      <ProfileScreen
        settings={settings}
        patientId={patientId}
        onBack={() => setScreen('inventory')}
        onLogout={handleLogout}
        onEditProfile={() => setScreen('editProfile')}
      />
    );
  }

  if (screen === 'editProfile') {
    return (
      <EditProfileScreen
        settings={settings}
        patientId={patientId}
        onBack={() => setScreen('profile')}
        onSaved={() => setScreen('profile')}
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

  // Historial Emergencias
  if (screen === 'emergencyHistory') {
    return (
      <EmergencyHistoryScreen
        patientId={patientId}
        settings={settings}
        onBack={() => setScreen('inventory')}
      />
    );
  }



  return null;
}