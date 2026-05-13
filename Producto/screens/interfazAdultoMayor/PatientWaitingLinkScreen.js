import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
 ScrollView,
  Alert,
} from 'react-native';

import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';

import { db } from '../../database/firebaseConfig';

import {
  collection,
  addDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

const generateLinkCode = () => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `GPIM-${random}`;
};

const PatientWaitingLinkScreen = ({ onBack, onLinked }) => {
  const [patientId, setPatientId] = useState(null);
  const [code, setCode] = useState('');
  const [creating, setCreating] = useState(true);

  useEffect(() => {
    const createTemporaryPatient = async () => {
      try {
        const codigoVinculacion = generateLinkCode();

        const patientRef = await addDoc(collection(db, 'pacientes'), {
          nombre: 'Paciente',
          apellido: '',
          estado: 'pendiente',
          codigoVinculacion,
          cuidadores: [],
          createdAt: serverTimestamp(),
        });

        setPatientId(patientRef.id);
        setCode(codigoVinculacion);

      } catch (error) {

        console.error('Error creando paciente temporal:', error);

        Alert.alert(
          'Error',
          'No se pudo generar el código de vinculación.'
        );

      } finally {

        setCreating(false);

      }
    };

    createTemporaryPatient();
  }, []);

  useEffect(() => {
    if (!patientId) return;

    const patientRef = doc(db, 'pacientes', patientId);

    const unsubscribe = onSnapshot(patientRef, (snapshot) => {

      if (!snapshot.exists()) return;

      const data = snapshot.data();

      const isLinked =
        data.estado === 'vinculado' ||
        (Array.isArray(data.cuidadores) &&
          data.cuidadores.length > 0);

      if (isLinked) {

        onLinked?.({
          patientId,
          patientData: {
            id: patientId,
            ...data,
          },
        });

      }
    });

    return unsubscribe;

  }, [patientId]);

  if (creating) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#42B65A" />

        <Text style={styles.loadingText}>
          Generando código...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Ionicons
              name="arrow-back"
              size={28}
              color="#2D3436"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Vincular con cuidador
          </Text>

          <View style={{ width: 28 }} />
        </View>

        {/* CARD */}
        <View style={styles.card}>

          <View style={styles.iconBox}>
            <Ionicons
              name="qr-code-outline"
              size={54}
              color="#42B65A"
            />
          </View>

          <Text style={styles.title}>
            Muestra este QR
          </Text>

          <Text style={styles.subtitle}>
            Pídele a tu cuidador que escanee este código desde su app G-PIM.
          </Text>

          {/* QR */}
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
            <Text style={styles.errorText}>
              No se pudo generar el código.
            </Text>
          )}

          {/* CÓDIGO */}
          <Text style={styles.codeLabel}>
            Código manual
          </Text>

          <View style={styles.codeBox}>
            <Text style={styles.codeText}>
              {code || 'SIN CÓDIGO'}
            </Text>
          </View>

          {/* ESTADO */}
          <View style={styles.waitingBox}>
            <ActivityIndicator
              size="small"
              color="#42B65A"
            />

            <Text style={styles.waitingText}>
              Esperando vinculación del cuidador...
            </Text>
          </View>

          <Text style={styles.helperText}>
            Cuando tu cuidador escanee el QR o ingrese este código,
            entrarás automáticamente a tu pantalla principal.
          </Text>

        </View>
      </View>
    </ScrollView>
  );
};

export default PatientWaitingLinkScreen;

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    backgroundColor: '#F7F7F7',
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },

  centerContainer: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
    color: '#636E72',
    fontWeight: '800',
    fontSize: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26,
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: '#2D3436',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    elevation: 4,
  },

  iconBox: {
    width: 92,
    height: 92,
    borderRadius: 28,
    backgroundColor: '#EAF8EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2D3436',
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 10,
    fontSize: 17,
    color: '#636E72',
    textAlign: 'center',
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: 24,
  },

  qrContainer: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#DFE6E9',
    marginBottom: 22,
  },

  errorText: {
    color: '#E74C3C',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 18,
  },

  codeLabel: {
    fontSize: 14,
    color: '#636E72',
    fontWeight: '900',
    marginBottom: 8,
  },

  codeBox: {
    backgroundColor: '#F1F2F6',
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginBottom: 18,
  },

  codeText: {
    color: '#2D3436',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1.3,
  },

  waitingBox: {
    marginTop: 4,
    backgroundColor: '#EAF8EE',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  waitingText: {
    marginLeft: 10,
    color: '#27AE60',
    fontSize: 14,
    fontWeight: '900',
  },

  helperText: {
    marginTop: 18,
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
    fontWeight: '700',
    lineHeight: 20,
  },
});