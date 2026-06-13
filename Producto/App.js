import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import { auth, db } from './database/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, onSnapshot ,serverTimestamp } from 'firebase/firestore';
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


//Importacion de Navegacion
import { NavigationContainer } from '@react-navigation/native';
import CaregiverNavigator from './navigation/CaregiverNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import PatientNavigator from './navigation/PatientNavigator';



function MainApp() {
  const [screen, setScreen] = useState('splash');
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
    setPatientId(null)
    setScreen('login')
  } catch (error) {
    console.error('Error cerrando sesión', error);
    Alert.alert('Error', 'No se pudo cerrar sesión');
  }
  
}

  // Splash de carga
  
  if (screen === 'splash') return <SplashScreen />;


  //---------- AUTH ----------------

  if (
    screen === 'select' ||
    screen === 'login' ||
    screen === 'register' ||
    screen === 'patientForm'
  ) {
    return (
      <NavigationContainer>
        <AuthNavigator
          settings={settings}
          initialRouteName={
            screen === 'login'
              ? 'Login'
              : screen === 'register'
              ? 'Register'
              : screen === 'patientForm'
              ? 'PatientForm'
              : 'Select'
          }
          onLogin={handleLogin}
          onRegister={handleRegister}
          onPatientSaved={(newPatientId) => {
            setPatientId(newPatientId);
            setScreen('inventory');
          }}
          onGoAdultPatient={() => setScreen('patientWaitingLink')}
        />
      </NavigationContainer>
    );
  }

  //---------- Flujo Paciente ----------------

  if (
    screen === 'patientWaitingLink' ||
    screen === 'adultoMayorHome' ||
    screen === 'takeMedicine' ||
    screen === 'patientLowStock' ||
    screen === 'adultoMayorEmergency'
  ) {
    return (
      <NavigationContainer>
        <PatientNavigator
          patientId={patientId}
          settings={settings}
          adultPatientData={adultPatientData}
          setPatientId={setPatientId}
          setAdultPatientData={setAdultPatientData}
          initialRouteName={
            screen === 'adultoMayorHome'
              ? 'AdultHome'
              : screen === 'takeMedicine'
              ? 'TakeMedicine'
              : screen === 'patientLowStock'
              ? 'PatientLowStock'
              : screen === 'adultoMayorEmergency'
              ? 'Emergency'
              : 'PatientWaitingLink'
          }
          onGoSelect={() => setScreen('select')}
        />
      </NavigationContainer>
    );
  }

  //---------- Inicio ----------------


  // Inventario
  if (screen === 'inventory') {
    return (
      <NavigationContainer>
        <CaregiverNavigator
          patientId={patientId}
          settings={settings}
          onLogout={handleLogout}
          onUpdateSettings={updateSettings}
        />
      </NavigationContainer>
    );
  }






  return null;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}

