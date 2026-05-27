import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';

import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { getTheme } from '../../theme/theme';
import { styles } from '../../styles/interfazAdultoMayor/PatientWaitingLinkScreen.styles';
import { db } from '../../database/firebaseConfig';

import {
  collection,
  addDoc,
  doc,
  onSnapshot,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';

const generateLinkCode = () => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `GPIM-${random}`;
};

const PatientWaitingLinkScreen = ({ onBack, onLinked }) => {
  const [requestId, setRequestId] = useState(null);
  const [code, setCode] = useState('');
  const [creating, setCreating] = useState(true);

  useEffect(() => {
    const createLinkRequest = async () => {
      try {
        const codigoVinculacion = generateLinkCode();

        const requestRef = await addDoc(collection(db, 'patientLinkRequests'), {
          codigoVinculacion,
          estado: 'pendiente',
          patientId: null,
          caregiverId: null,
          createdAt: serverTimestamp(),
        });

        setRequestId(requestRef.id);
        setCode(codigoVinculacion);
      } catch (error) {
        console.error('Error creando solicitud:', error);
        Alert.alert('Error', 'No se pudo generar el código de vinculación.');
      } finally {
        setCreating(false);
      }
    };

    createLinkRequest();
  }, []);

  useEffect(() => {
    if (!requestId) return;

    const requestRef = doc(db, 'patientLinkRequests', requestId);

    const unsubscribe = onSnapshot(requestRef, async (snapshot) => {
      if (!snapshot.exists()) return;

      const data = snapshot.data();

      if (data.estado === 'vinculado' && data.patientId) {
        const patientRef = doc(db, 'pacientes', data.patientId);
        const patientSnap = await getDoc(patientRef);

        onLinked?.({
          patientId: data.patientId,
          patientData: patientSnap.exists()
            ? { id: patientSnap.id, ...patientSnap.data() }
            : null,
        });
      }
    });

    return unsubscribe;
  }, [requestId]);

  if (creating) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#42B65A" />
        <Text style={styles.loadingText}>Generando código...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={28} color="#2D3436" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Conectar con cuidador</Text>

          <View style={{ width: 28 }} />
        </View>

        <View style={styles.card}>
          <View style={styles.iconBox}>
            <Ionicons name="qr-code-outline" size={54} color="#42B65A" />
          </View>

          <Text style={styles.title}>Muestra este QR</Text>

          <Text style={styles.subtitle}>
            El cuidador debe escanear este código desde su app G-PIM.
          </Text>

          {code ? (
            <View style={styles.qrContainer}>
              <QRCode
                value={code}
                size={230}
                backgroundColor="#FFFFFF"
                color="#2D3436"
              />
            </View>
          ) : (
            <Text style={styles.errorText}>No se pudo generar el código.</Text>
          )}

          <Text style={styles.codeLabel}>Código manual</Text>

          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{code || 'SIN CÓDIGO'}</Text>
          </View>

          <View style={styles.waitingBox}>
            <ActivityIndicator size="small" color="#42B65A" />
            <Text style={styles.waitingText}>
              Esperando al cuidador...
            </Text>
          </View>

          <Text style={styles.helperText}>
            Cuando el cuidador escanee este QR, entrarás automáticamente a tu pantalla principal.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default PatientWaitingLinkScreen;

