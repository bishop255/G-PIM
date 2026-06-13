import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  doc,
  onSnapshot,
} from 'firebase/firestore';

import { db } from '../database/firebaseConfig';

import PatientWaitingLinkScreen from '../screens/interfazAdultoMayor/PatientWaitingLinkScreen';
import HomeScreen from '../screens/interfazAdultoMayor/HomeScreen';
import TakeMedicineScreen from '../screens/interfazAdultoMayor/TakeMedicineScreen';
import EmergencyScreen from '../screens/interfazAdultoMayor/EmergencyScreen';
import PatientLowStockScreen from '../screens/interfazAdultoMayor/PatientLowStockScreen';

import { setupNotifications } from '../services/notificationService';
import { schedulePatientMedicineReminders } from '../services/patientReminderService';

const Stack = createNativeStackNavigator();

const PatientNavigator = ({
  patientId,
  settings,
  adultPatientData,
  setPatientId,
  setAdultPatientData,
  initialRouteName = 'PatientWaitingLink',
  onGoSelect,
}) => {
  useEffect(() => {
    if (!patientId) return;

    const patientRef = doc(db, 'pacientes', patientId);

    const unsubscribe = onSnapshot(patientRef, async (snapshot) => {
      if (!snapshot.exists()) {
        await AsyncStorage.removeItem('adultPatientId');

        setPatientId(null);
        setAdultPatientData(null);
        onGoSelect();
        return;
      }

      const patientData = snapshot.data();

      const cuidadores = Array.isArray(patientData.cuidadores)
        ? patientData.cuidadores
        : [];

      const isUnlinked =
        patientData.estadoVinculacion === 'desvinculado' ||
        cuidadores.length === 0;

      if (isUnlinked) {
        await AsyncStorage.removeItem('adultPatientId');

        setPatientId(null);
        setAdultPatientData(null);

        Alert.alert(
          'Paciente desvinculado',
          'La conexión con el cuidador fue finalizada.'
        );

        onGoSelect();
      }
    });

    return unsubscribe;
  }, [patientId]);

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="PatientWaitingLink">
        {({ navigation }) => (
          <PatientWaitingLinkScreen
            onBack={onGoSelect}
            onLinked={async ({ patientId, patientData }) => {
              await AsyncStorage.setItem('adultPatientId', patientId);

              setPatientId(patientId);
              setAdultPatientData(patientData);

              await setupNotifications();
              await schedulePatientMedicineReminders(patientId);

              Alert.alert(
                'Paciente conectado',
                'La interfaz del adulto mayor fue vinculada correctamente.'
              );

              navigation.replace('AdultHome');
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="AdultHome">
        {({ navigation }) => (
          <HomeScreen
            patientData={adultPatientData}
            onBack={onGoSelect}
            onTakeMedicine={() => navigation.navigate('TakeMedicine')}
            onLowStock={() => navigation.navigate('PatientLowStock')}
            onEmergency={() => navigation.navigate('Emergency')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="TakeMedicine">
        {({ navigation }) => (
          <TakeMedicineScreen
            patientId={patientId}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="PatientLowStock">
        {({ navigation }) => (
          <PatientLowStockScreen
            patientId={patientId}
            settings={settings}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Emergency">
        {({ navigation }) => (
          <EmergencyScreen
            patientId={patientId}
            onBack={() => navigation.goBack()}
            onCancel={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default PatientNavigator;