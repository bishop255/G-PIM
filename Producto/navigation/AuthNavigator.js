import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import UserTypeSelectionScreen from '../screens/UserTypeSelectionScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import PatientFormScreen from '../screens/interfazAdultoMayor/PatientFormScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = ({
  settings,
  initialRouteName = 'Select',
  onLogin,
  onRegister,
  onPatientSaved,
  onGoAdultPatient,
}) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Select">
        {({ navigation }) => (
          <UserTypeSelectionScreen
            onSelect={(type) => {
              if (type === 'admin') {
                navigation.navigate('Login');
              } else {
                onGoAdultPatient();
              }
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Login">
        {({ navigation }) => (
          <LoginScreen
            settings={settings}
            onBack={() => navigation.replace('Select')}
            onGoRegister={() => navigation.navigate('Register')}
            onLogin={onLogin}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Register">
        {({ navigation }) => (
          <RegisterScreen
            settings={settings}
            onBack={() => navigation.replace('Login')}
            onGoLogin={() => navigation.replace('Login')}
            onRegister={onRegister}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="PatientForm">
        {() => (
          <PatientFormScreen
            onSaved={onPatientSaved}
            onCancel={() => onGoAdultPatient()}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthNavigator;