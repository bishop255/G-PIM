import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  BackHandler,
  ScrollView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/UserTypeSelectionScreen.styles';

const UserTypeSelectionScreen = ({ onSelect }) => {
  const handleCloseApp = () => {
    Alert.alert(
      'Cerrar aplicación',
      '¿Estás seguro que deseas cerrar la app?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, cerrar',
          style: 'destructive',
          onPress: () => BackHandler.exitApp(),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView
      style={styles.safeContainer}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#F7F9FA" />

        <View style={styles.logoCard}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>G-PIM</Text>
        <Text style={styles.subtitle}>Gestor Predictivo de Insumos Médicos</Text>

        <View style={styles.infoBox}>
          <Ionicons name="people-outline" size={24} color="#42B65A" />
          <Text style={styles.infoText}>
            Selecciona cómo utilizarás la aplicación
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => onSelect('admin')}
            activeOpacity={0.85}
          >
            <View style={styles.iconCircle}>
              <Image
                source={require('../assets/familia-adoptiva.png')}
                style={styles.iconImage}
              />
            </View>

            <Text style={styles.optionTitle}>Familiar</Text>
            <Text style={styles.optionDescription}>
              Gestiona inventario, alertas, medicamentos y seguimiento.
            </Text>

            <View style={styles.selectRow}>
              <Text style={styles.selectText}>Entrar</Text>
              <Ionicons name="chevron-forward" size={20} color="#42B65A" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => onSelect('patient')}
            activeOpacity={0.85}
          >
            <View style={styles.iconCircle}>
              <Image
                source={require('../assets/paciente.png')}
                style={styles.iconImage}
              />
            </View>

            <Text style={styles.optionTitle}>Paciente</Text>
            <Text style={styles.optionDescription}>
              Accede a recordatorios, emergencia y avisos al cuidador.
            </Text>

            <View style={styles.selectRow}>
              <Text style={styles.selectText}>Entrar</Text>
              <Ionicons name="chevron-forward" size={20} color="#42B65A" />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleCloseApp}
          activeOpacity={0.85}
        >
          <Ionicons name="close-circle-outline" size={22} color="#FFFFFF" />
          <Text style={styles.closeText}>Cerrar aplicación</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserTypeSelectionScreen;