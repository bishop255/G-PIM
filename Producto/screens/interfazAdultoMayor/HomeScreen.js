import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import { styles } from '../../styles/interfazAdultoMayor/HomeScreen.styles';


const HomeScreen = ({ patientData, onTakeMedicine, onLowStock, onEmergency }) => {
  const patientName = patientData?.nombre || 'Paciente';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F2" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View style={styles.rightSpacer} />

          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>G-PIM</Text>
          </View>

          <View style={styles.rightSpacer} />
        </View>

        <View style={styles.headerContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>HOLA, {patientName.toUpperCase()}</Text>
            <Text style={styles.titleIcon}>👋</Text>
          </View>

          <Text style={styles.subtitle}>¿Qué deseas hacer ahora?</Text>
        </View>

        <View style={styles.buttonsWrapper}>
          <TouchableOpacity
            style={[styles.actionButton, styles.greenButton]}
            onPress={onTakeMedicine}
            activeOpacity={0.85}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonEmoji}>💊</Text>
              <Text style={styles.actionText}>Tomé mi{'\n'}medicamento</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.yellowButton]}
            onPress={onLowStock}
            activeOpacity={0.85}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonEmoji}>⚠️</Text>
              <Text style={styles.actionText}>Se acaba mi{'\n'}medicamento</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.redButton]}
            onPress={onEmergency}
            activeOpacity={0.85}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonEmoji}>📢</Text>
              <Text style={styles.actionText}>Necesito Ayuda</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

