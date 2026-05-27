import React, { useEffect, useRef } from 'react';
import { View, Image, StatusBar, Animated, Text } from 'react-native';
import { styles } from '../styles/SplashScreen.styles';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    // Nota: Por ahora no navegará a ningún lado hasta que quites las barras de comentario
    const timer = setTimeout(() => {
      // navigation.replace('Home'); 
    }, 3500);

    return () => clearTimeout(timer);
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image
          source={require('../assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.tagline}>G-PIM: Gestión de Inventario Médico</Text>
      </View>
    </View>
  );
};


export default SplashScreen;