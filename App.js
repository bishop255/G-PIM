import React from 'react';
import { StyleSheet, View } from 'react-native';
// Asegúrate de que la ruta sea correcta. 
// Si SplashScreen.js está en la misma carpeta que App.js, usa './SplashScreen'
import SplashScreen from './screens/SplashScreen'; 

export default function App() {
  return (
    <View style={styles.container}>
      {/* Solo renderizamos el Splash para verlo */}
      <SplashScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});