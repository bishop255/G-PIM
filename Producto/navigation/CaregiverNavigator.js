import React, { useState } from 'react';
import { Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import InventoryScreen from '../screens/interfazCuidador/InventoryScreen';
import AddMedicineScreen from '../screens/interfazCuidador/AddMedicineScreen';
import EditMedicineScreen from '../screens/interfazCuidador/EditMedicineScreen';
import AlertsScreen from '../screens/interfazCuidador/AlertsScreen';
import OffersScreen from '../screens/interfazCuidador/OffersScreen';
import MyMedicinesOffersScreen from '../screens/interfazCuidador/MyMedicinesOffersScreen';
import MedicineDetailScreen from '../screens/interfazCuidador/MedicineDetailScreen';
import HistoryScreen from '../screens/interfazCuidador/HistoryScreen';
import SettingsScreen from '../screens/interfazCuidador/SettingsScreen';
import ProfileScreen from '../screens/interfazCuidador/ProfileScreen';
import EditProfileScreen from '../screens/interfazCuidador/EditProfileScreen';
import DashboardScreen from '../screens/interfazCuidador/DashboardScreen';
import EmergencyHistoryScreen from '../screens/interfazCuidador/EmergencyHistoryScreen';
import LinkPatientScreen from '../screens/interfazCuidador/LinkPatientScreen';

const Stack = createNativeStackNavigator();

const CaregiverNavigator = ({
  patientId,
  settings,
  onLogout,
  onUpdateSettings,
}) => {
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  return (
    <Stack.Navigator
      initialRouteName="Inventory"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Inventory">
        {({ navigation }) => (
          <InventoryScreen
            patientId={patientId}
            settings={settings}
            onAddPress={() => navigation.navigate('AddMedicine')}
            onEditPress={(medicine) => {
              setSelectedMedicine(medicine);
              navigation.navigate('EditMedicine');
            }}
            onAlertsPress={() => navigation.navigate('Alerts')}
            onOffersPress={() => navigation.navigate('Offers')}
            onMedicinePress={(medicine) => {
              setSelectedMedicine(medicine);
              navigation.navigate('MedicineDetail');
            }}
            onEmergencyHistoryPress={() => navigation.navigate('EmergencyHistory')}
            onHistoryPress={() => navigation.navigate('History')}
            onSettingsPress={() => navigation.navigate('Settings')}
            onProfilePress={() => navigation.navigate('Profile')}
            onDashboardPress={() => navigation.navigate('Dashboard')}
            onLogout={onLogout}
            onLinkPatientPress={() => navigation.navigate('LinkPatient')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="MedicineDetail">
        {({ navigation }) => (
          <MedicineDetailScreen
            patientId={patientId}
            settings={settings}
            medicine={selectedMedicine}
            onBack={() => navigation.goBack()}
            onEdit={() => navigation.navigate('EditMedicine')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="AddMedicine">
        {({ navigation }) => (
          <AddMedicineScreen
            patientId={patientId}
            settings={settings}
            onCancel={() => navigation.goBack()}
            onSaved={() => navigation.navigate('Inventory')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="EditMedicine">
        {({ navigation }) => (
          <EditMedicineScreen
            patientId={patientId}
            settings={settings}
            medicine={selectedMedicine}
            onCancel={() => navigation.goBack()}
            onSaved={() => {
              setSelectedMedicine(null);
              navigation.navigate('Inventory');
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Dashboard">
        {({ navigation }) => (
          <DashboardScreen
            patientId={patientId}
            settings={settings}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Alerts">
        {({ navigation }) => (
          <AlertsScreen
            patientId={patientId}
            settings={settings}
            onBack={() => navigation.goBack()}
            onGoInventory={() => navigation.navigate('Inventory')}
            onGoOffers={() => navigation.navigate('Offers')}
            onGoProfile={() => navigation.navigate('Profile')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Offers">
        {({ navigation }) => (
          <OffersScreen
            patientId={patientId}
            settings={settings}
            onBack={() => navigation.goBack()}
            onGoInventory={() => navigation.navigate('Inventory')}
            onGoAlerts={() => navigation.navigate('Alerts')}
            onGoProfile={() => navigation.navigate('Profile')}
            onGoMyMedicines={() => navigation.navigate('MyMedicinesOffers')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="MyMedicinesOffers">
        {({ navigation }) => (
          <MyMedicinesOffersScreen
            patientId={patientId}
            settings={settings}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Profile">
        {({ navigation }) => (
          <ProfileScreen
            settings={settings}
            patientId={patientId}
            onBack={() => navigation.goBack()}
            onLogout={onLogout}
            onEditProfile={() => navigation.navigate('EditProfile')}
            onGoInventory={() => navigation.navigate('Inventory')}
            onGoAlerts={() => navigation.navigate('Alerts')}
            onGoOffers={() => navigation.navigate('Offers')}
            onGoProfile={() => navigation.navigate('Profile')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="EditProfile">
        {({ navigation }) => (
          <EditProfileScreen
            settings={settings}
            patientId={patientId}
            onBack={() => navigation.goBack()}
            onSaved={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="History">
        {({ navigation }) => (
          <HistoryScreen
            patientId={patientId}
            settings={settings}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Settings">
        {({ navigation }) => (
          <SettingsScreen
            settings={settings}
            onBack={() => navigation.goBack()}
            onUpdateSettings={onUpdateSettings}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="EmergencyHistory">
        {({ navigation }) => (
          <EmergencyHistoryScreen
            patientId={patientId}
            settings={settings}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="LinkPatient">
        {({ navigation }) => (
          <LinkPatientScreen
            settings={settings}
            patientId={patientId}
            onBack={() => navigation.goBack()}
            onLinked={() => {
              Alert.alert('Vinculación exitosa', 'El paciente ya está conectado.');
              navigation.navigate('Inventory');
            }}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default CaregiverNavigator;