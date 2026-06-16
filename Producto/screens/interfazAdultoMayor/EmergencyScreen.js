import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Alert,
  Linking,
  ActivityIndicator,
  Modal,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { styles } from '../../styles/interfazAdultoMayor/EmergencyScreen.styles';
import { db } from '../../database/firebaseConfig';
import { sendExpoPushNotification } from '../../services/notificationService';



const EmergencyScreen = ({ patientId, onBack, onCancel }) => {
  const [alertSent, setAlertSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [caregiverPhone, setCaregiverPhone] = useState(null);
  const [caregiverName, setCaregiverName] = useState('Familiar');
  const [patientData, setPatientData] = useState(null);
  const [medicalInfoVisible, setMedicalInfoVisible] = useState(false);

  useEffect(() => {
    const loadCaregiver = async () => {
      if (!patientId) return;

      try {
        const patientRef = doc(db, 'pacientes', patientId);
        const patientSnap = await getDoc(patientRef);

        if (!patientSnap.exists()) return;

        const patientData = patientSnap.data();
        setPatientData({
          id: patientSnap.id,
          ...patientData,
        });
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

  const getPatientFullName = () => {
    if (!patientData) return 'No disponible';

    const nombre = patientData.nombre || patientData.name || '';
    const apellido = patientData.apellido || '';

    return `${nombre} ${apellido}`.trim() || 'No disponible';
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
            <View style={[styles.actionIconBox, styles.greenIconBox]}>
              <Ionicons name="call-outline" size={38} color="#27AE60" />
            </View>

            <Text style={styles.actionTextDark}>Llamar a{'\n'}familiar</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.redButton]}
          onPress={handleCallEmergency}
          activeOpacity={0.85}
        >
          <View style={styles.buttonContent}>
            <View style={[styles.actionIconBox, styles.redIconBox]}>
              <Ionicons name="medkit-outline" size={38} color="#E74C3C" />
            </View>

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
            <View style={[styles.actionIconBox, styles.yellowIconBox]}>
              {loading ? (
                <ActivityIndicator size="small" color="#F39C12" />
              ) : (
                <Ionicons name="notifications-outline" size={38} color="#F39C12" />
              )}
            </View>

            <Text style={styles.actionTextDark}>
              {loading ? 'Enviando alerta...' : 'Enviar alerta'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.infoButton]}
          onPress={() => setMedicalInfoVisible(true)}
          activeOpacity={0.85}
        >
          <View style={styles.buttonContent}>
            <View style={[styles.actionIconBox, styles.blueIconBox]}>
              <Ionicons name="id-card-outline" size={38} color="#2D9CDB" />
            </View>

            <Text style={styles.actionTextDark}>
              Ver información{'\n'}médica
            </Text>
          </View>
        </TouchableOpacity>

        {alertSent && (
          <View style={styles.successBox}>
           <Ionicons name="checkmark-circle-outline" size={26} color="#27AE60" />
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

        <Modal
          visible={medicalInfoVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setMedicalInfoVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.medicalCard}>
              <View style={styles.medicalHeader}>
                <Ionicons name="medical-outline" size={34} color="#42B65A" />
                <Text style={styles.medicalTitle}>Carné médico</Text>
              </View>

              <InfoRow label="Nombre" value={getPatientFullName()} />
              <InfoRow label="Edad" value={`${patientData?.edad || 'No disponible'}`} />
              <InfoRow label="Grupo sanguíneo" value={patientData?.grupo || 'No disponible'} />
              <InfoRow label="Alergias" value={patientData?.alergias || 'Sin alergias registradas'} />
              <InfoRow label="Teléfono emergencia" value={patientData?.telefono || 'No disponible'} />
              <InfoRow label="Contacto" value={caregiverName || 'Familiar'} />

              <TouchableOpacity
                style={styles.closeMedicalButton}
                onPress={() => setMedicalInfoVisible(false)}
              >
                <Text style={styles.closeMedicalText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow = ({ label, value }) => {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
};

export default EmergencyScreen;

