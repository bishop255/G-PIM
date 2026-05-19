import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '../../database/firebaseConfig';
import { sendExpoPushNotification } from '../../services/notificationService';

const { width, height } = Dimensions.get('window');
const scale = Math.min(width / 390, 1.15);

const EmergencyScreen = ({ patientId, onBack, onCancel }) => {
  const [alertSent, setAlertSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [caregiverPhone, setCaregiverPhone] = useState(null);
  const [caregiverName, setCaregiverName] = useState('Familiar');

  useEffect(() => {
    const loadCaregiver = async () => {
      if (!patientId) return;

      try {
        const patientRef = doc(db, 'pacientes', patientId);
        const patientSnap = await getDoc(patientRef);

        if (!patientSnap.exists()) return;

        const patientData = patientSnap.data();
        const caregiverIds = Array.isArray(patientData.cuidadores)
          ? patientData.cuidadores
          : [];

        if (caregiverIds.length === 0) return;

        const caregiverRef = doc(db, 'usuarios', caregiverIds[0]);
        const caregiverSnap = await getDoc(caregiverRef);

        if (!caregiverSnap.exists()) return;

        const caregiverData = caregiverSnap.data();

        setCaregiverPhone(caregiverData.phone || null);
        setCaregiverName(caregiverData.name || 'Familiar');
      } catch (error) {
        console.error('Error cargando cuidador:', error);
      }
    };

    loadCaregiver();
  }, [patientId]);

  const handleCallFamily = async () => {
    if (!caregiverPhone) {
      Alert.alert(
        'Teléfono no disponible',
        'No se encontró un teléfono registrado para el cuidador.'
      );
      return;
    }

    const phoneUrl = `tel:${caregiverPhone}`;

    const canOpen = await Linking.canOpenURL(phoneUrl);

    if (!canOpen) {
      Alert.alert('Error', 'No se pudo abrir la aplicación de llamadas.');
      return;
    }

    await Linking.openURL(phoneUrl);
  };

  const handleCallEmergency = async () => {
    const phoneUrl = 'tel:131';

    const canOpen = await Linking.canOpenURL(phoneUrl);

    if (!canOpen) {
      Alert.alert('Error', 'No se pudo abrir la aplicación de llamadas.');
      return;
    }

    await Linking.openURL(phoneUrl);
  };

  const handleSendAlert = async () => {
    if (!patientId || loading) return;

    try {
      setLoading(true);

      const patientRef = doc(db, 'pacientes', patientId);
      const patientSnap = await getDoc(patientRef);

      if (!patientSnap.exists()) {
        Alert.alert('Error', 'No se encontró la información del paciente.');
        return;
      }

      const patientData = patientSnap.data();

      const patientName =
        patientData.nombre || patientData.name || 'El paciente';

      const caregiverIds = Array.isArray(patientData.cuidadores)
        ? patientData.cuidadores
        : [];

      await addDoc(collection(db, 'pacientes', patientId, 'emergencias'), {
        patientId,
        patientName,
        type: 'emergency',
        status: 'sent',
        message: `${patientName} solicitó ayuda de emergencia.`,
        createdAt: serverTimestamp(),
      });

      for (const caregiverId of caregiverIds) {
        const caregiverRef = doc(db, 'usuarios', caregiverId);
        const caregiverSnap = await getDoc(caregiverRef);

        if (!caregiverSnap.exists()) continue;

        const caregiverData = caregiverSnap.data();

        await addDoc(collection(db, 'usuarios', caregiverId, 'alertas'), {
          type: 'emergency',
          patientId,
          patientName,
          message: `${patientName} solicitó ayuda de emergencia.`,
          read: false,
          createdAt: serverTimestamp(),
        });

        if (caregiverData.expoPushToken) {
          await sendExpoPushNotification({
            expoPushToken: caregiverData.expoPushToken,
            title: '🚨 Emergencia G-PIM',
            body: `${patientName} solicitó ayuda.`,
            data: {
              type: 'emergency',
              patientId,
            },
          });
        }
      }

      setAlertSent(true);

      Alert.alert(
        'Alerta enviada',
        'Tu familiar ha sido notificado correctamente.'
      );
    } catch (error) {
      console.error('Error enviando emergencia:', error);
      Alert.alert('Error', 'No se pudo enviar la alerta de emergencia.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F2" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoWrapper}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>G-PIM</Text>
        </View>

        <View style={styles.emergencyIconBox}>
          <Ionicons name="warning-outline" size={70} color="#E74C3C" />
        </View>

        <Text style={styles.title}>NECESITO AYUDA</Text>

        <Text style={styles.subtitle}>
          Tu familiar será notificado de inmediato.
        </Text>

        <View style={styles.caregiverBox}>
          <Ionicons name="person-circle-outline" size={28} color="#42B65A" />
          <Text style={styles.caregiverText}>Contacto: {caregiverName}</Text>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, styles.greenButton]}
          onPress={handleCallFamily}
          activeOpacity={0.85}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonEmoji}>📞</Text>
            <Text style={styles.actionTextDark}>Llamar a{'\n'}familiar</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.redButton]}
          onPress={handleCallEmergency}
          activeOpacity={0.85}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonEmoji}>🚑</Text>

            <Text style={styles.actionTextDark}>
              Llamar{'\n'}SAMU 131
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.yellowButton]}
          onPress={handleSendAlert}
          activeOpacity={0.85}
          disabled={loading}
        >
          <View style={styles.buttonContent}>
            {loading ? (
              <ActivityIndicator size="large" color="#000000" />
            ) : (
              <Text style={styles.buttonEmoji}>🚨</Text>
            )}

            <Text style={styles.actionTextDark}>
              {loading ? 'Enviando alerta...' : 'Enviar alerta'}
            </Text>
          </View>
        </TouchableOpacity>

        {alertSent && (
          <View style={styles.successBox}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successText}>
              Tu familiar ha sido notificado
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel || onBack}
          activeOpacity={0.85}
        >
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmergencyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: width * 0.08,
    paddingTop: height * 0.04,
    paddingBottom: height * 0.05,
    justifyContent: 'center',
  },

  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  logo: {
    width: 52 * scale,
    height: 52 * scale,
    marginRight: 10,
  },

  logoText: {
    fontSize: 26 * scale,
    fontWeight: '900',
    color: '#2D3436',
  },

  emergencyIconBox: {
    width: 120,
    height: 120,
    borderRadius: 36,
    backgroundColor: '#FDECEC',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 22,
  },

  title: {
    textAlign: 'center',
    fontSize: 34 * scale,
    fontWeight: '900',
    color: '#E74C3C',
    marginBottom: 12,
  },

  subtitle: {
    textAlign: 'center',
    fontSize: 19 * scale,
    color: '#333333',
    marginBottom: 18,
    fontWeight: '800',
    lineHeight: 26 * scale,
  },

  caregiverBox: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
    elevation: 2,
  },

  caregiverText: {
    marginLeft: 8,
    color: '#2D3436',
    fontSize: 16,
    fontWeight: '900',
  },

  actionButton: {
    width: '100%',
    minHeight: 115,
    borderRadius: 26,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
  },

  greenButton: {
    backgroundColor: '#B8DDB9',
  },

  yellowButton: {
    backgroundColor: '#F1DE9D',
  },

  redButton: {
    backgroundColor: '#FFD6D6',
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  buttonEmoji: {
    fontSize: 46 * scale,
    marginRight: 18,
  },

  actionTextDark: {
    flexShrink: 1,
    fontSize: 24 * scale,
    fontWeight: '900',
    color: '#000000',
    lineHeight: 32 * scale,
    marginLeft: 12,
  },

  successBox: {
    marginTop: 10,
    backgroundColor: '#B8DDB9',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 34,
  },

  successIcon: {
    fontSize: 24,
    marginRight: 10,
  },

  successText: {
    fontSize: 18 * scale,
    fontWeight: '800',
    color: '#1F4D2E',
    textAlign: 'center',
  },

  cancelButton: {
    backgroundColor: '#FF1E1E',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    color: '#FFFFFF',
    fontSize: 24 * scale,
    fontWeight: '900',
  },
});