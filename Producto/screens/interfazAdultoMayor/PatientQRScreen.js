import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';

import { db } from '../../database/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const PatientQRScreen = ({ patientId, onBack }) => {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPatient = async () => {
      try {
        if (!patientId) {
          setLoading(false);
          return;
        }

        const patientRef = doc(db, 'pacientes', patientId);
        const patientSnap = await getDoc(patientRef);

        if (patientSnap.exists()) {
          setPatientData({
            id: patientSnap.id,
            ...patientSnap.data(),
          });
        }
      } catch (error) {
        console.log('Error cargando paciente:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPatient();
  }, [patientId]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#42B65A" />
        <Text style={styles.loadingText}>Cargando código...</Text>
      </View>
    );
  }

  if (!patientData?.codigoVinculacion) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={58} color="#E74C3C" />
        <Text style={styles.errorTitle}>Código no disponible</Text>
        <Text style={styles.errorText}>
          Este paciente aún no tiene código de vinculación.
        </Text>

        <TouchableOpacity style={styles.backButtonError} onPress={onBack}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const qrValue = patientData.codigoVinculacion;

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={26} color="#2D3436" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Mi Código QR</Text>

          <View style={{ width: 26 }} />
        </View>

        {/* CARD */}
        <View style={styles.card}>
          <View style={styles.iconBox}>
            <Ionicons name="qr-code-outline" size={50} color="#42B65A" />
          </View>

          <Text style={styles.title}>Código de vinculación</Text>

          <Text style={styles.subtitle}>
            Muestra este QR al cuidador para vincular tu cuenta de paciente.
          </Text>

          <View style={styles.qrContainer}>
            <QRCode
              value={qrValue}
              size={220}
              backgroundColor="#FFFFFF"
              color="#2D3436"
            />
          </View>

          <Text style={styles.codeLabel}>Código manual</Text>

          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{patientData.codigoVinculacion}</Text>
          </View>

          <Text style={styles.patientName}>
            {patientData.nombre} {patientData.apellido}
          </Text>

          <Text style={styles.helperText}>
            El cuidador puede escanear el QR o ingresar el código manualmente.
          </Text>
        </View>

        <TouchableOpacity style={styles.doneButton} onPress={onBack}>
          <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
          <Text style={styles.doneButtonText}>Entendido</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default PatientQRScreen;

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
    paddingHorizontal: 30,
  },

  loadingText: {
    marginTop: 12,
    color: '#636E72',
    fontWeight: '700',
  },

  errorTitle: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: '900',
    color: '#2D3436',
  },

  errorText: {
    marginTop: 8,
    fontSize: 15,
    color: '#636E72',
    textAlign: 'center',
    fontWeight: '600',
  },

  backButtonError: {
    marginTop: 24,
    backgroundColor: '#42B65A',
    paddingHorizontal: 26,
    paddingVertical: 13,
    borderRadius: 16,
  },

  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2D3436',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 24,
    alignItems: 'center',
    elevation: 3,
  },

  iconBox: {
    width: 84,
    height: 84,
    borderRadius: 26,
    backgroundColor: '#EAF8EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  title: {
    fontSize: 25,
    fontWeight: '900',
    color: '#2D3436',
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: '#636E72',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 21,
    marginBottom: 22,
  },

  qrContainer: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#DFE6E9',
    marginBottom: 22,
  },

  codeLabel: {
    fontSize: 13,
    color: '#636E72',
    fontWeight: '800',
    marginBottom: 8,
  },

  codeBox: {
    backgroundColor: '#F1F2F6',
    borderRadius: 16,
    paddingHorizontal: 22,
    paddingVertical: 13,
    marginBottom: 14,
  },

  codeText: {
    color: '#2D3436',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  patientName: {
    fontSize: 17,
    fontWeight: '900',
    color: '#2D3436',
    marginTop: 4,
  },

  helperText: {
    fontSize: 13,
    color: '#636E72',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 12,
    lineHeight: 18,
  },

  doneButton: {
    marginTop: 24,
    backgroundColor: '#42B65A',
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },

  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginLeft: 8,
  },
});