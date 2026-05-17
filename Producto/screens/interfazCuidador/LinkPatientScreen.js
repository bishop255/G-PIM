import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { db, auth } from '../../database/firebaseConfig';

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

const LinkPatientScreen = ({ patientId, onBack, onLinked }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [manualVisible, setManualVisible] = useState(false);
  const [manualCode, setManualCode] = useState('');

  const completeLinkRequestByCode = async (rawCode) => {
    if (loading) return;

    const user = auth.currentUser;
    const code = String(rawCode || '').trim().toUpperCase();

    if (!user) {
      Alert.alert('Error', 'Usuario no autenticado');
      setScanned(false);
      return;
    }

    if (!patientId) {
      Alert.alert(
        'Paciente no disponible',
        'Primero debes tener un paciente registrado para conectarlo con la interfaz del adulto mayor.'
      );
      setScanned(false);
      return;
    }

    if (!code) {
      Alert.alert('Código requerido', 'Ingresa un código válido.');
      return;
    }

    try {
      setLoading(true);

      const requestQuery = query(
        collection(db, 'patientLinkRequests'),
        where('codigoVinculacion', '==', code),
        where('estado', '==', 'pendiente')
      );

      const querySnapshot = await getDocs(requestQuery);

      if (querySnapshot.empty) {
        Alert.alert(
          'Código inválido',
          'No se encontró una solicitud pendiente con ese código.'
        );
        setScanned(false);
        return;
      }

      const requestDoc = querySnapshot.docs[0];

      await updateDoc(doc(db, 'patientLinkRequests', requestDoc.id), {
        estado: 'vinculado',
        patientId,
        caregiverId: user.uid,
        linkedAt: serverTimestamp(),
      });

      Alert.alert(
        'Vinculación exitosa',
        'La interfaz del paciente ya está conectada a este paciente.'
      );

      setManualVisible(false);
      setManualCode('');

      onLinked?.(patientId);
    } catch (error) {
      console.error('Error vinculando solicitud:', error);

      Alert.alert('Error', 'No se pudo completar la vinculación.');
      setScanned(false);
    } finally {
      setLoading(false);
    }
  };

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned || loading) return;

    setScanned(true);
    await completeLinkRequestByCode(data);
  };

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#42B65A" />
        <Text style={styles.subtitle}>Revisando permisos...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="camera-outline" size={70} color="#42B65A" />

        <Text style={styles.title}>Permiso de cámara</Text>

        <Text style={styles.subtitle}>
          Necesitamos acceso a la cámara para escanear el QR del paciente.
        </Text>

        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Permitir cámara</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.manualPermissionButton}
          onPress={() => setManualVisible(true)}
        >
          <Ionicons name="keypad-outline" size={20} color="#42B65A" />
          <Text style={styles.manualPermissionText}>Escribir código manual</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onBack}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>

        <ManualCodeModal
          visible={manualVisible}
          code={manualCode}
          setCode={setManualCode}
          loading={loading}
          onClose={() => setManualVisible(false)}
          onConfirm={() => completeLinkRequestByCode(manualCode)}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      <View style={styles.overlay}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={30} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Conectar paciente</Text>

          <View style={{ width: 30 }} />
        </View>

        <View style={styles.scanArea}>
          <View style={styles.scanBox} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.scanText}>
            Escanea el QR de la interfaz paciente
          </Text>

          {loading && (
            <ActivityIndicator
              size="large"
              color="#42B65A"
              style={{ marginTop: 20 }}
            />
          )}

          {scanned && !loading && (
            <TouchableOpacity
              style={styles.rescanButton}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.rescanText}>Escanear nuevamente</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.manualButton}
            onPress={() => {
              setScanned(true);
              setManualVisible(true);
            }}
          >
            <Ionicons name="keypad-outline" size={21} color="#FFFFFF" />
            <Text style={styles.manualButtonText}>Escribir código manual</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ManualCodeModal
        visible={manualVisible}
        code={manualCode}
        setCode={setManualCode}
        loading={loading}
        onClose={() => {
          setManualVisible(false);
          setScanned(false);
        }}
        onConfirm={() => completeLinkRequestByCode(manualCode)}
      />
    </View>
  );
};

const ManualCodeModal = ({
  visible,
  code,
  setCode,
  loading,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalIcon}>
            <Ionicons name="keypad-outline" size={38} color="#42B65A" />
          </View>

          <Text style={styles.modalTitle}>Código manual</Text>

          <Text style={styles.modalSubtitle}>
            Ingresa el código que aparece en la pantalla del paciente.
          </Text>

          <TextInput
            style={styles.modalInput}
            placeholder="Ej: GPIM-ABC123"
            placeholderTextColor="#95A5A6"
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalConfirmButton,
                loading && styles.buttonDisabled,
              ]}
              onPress={onConfirm}
              disabled={loading}
            >
              <Text style={styles.modalConfirmText}>
                {loading ? 'Conectando...' : 'Conectar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LinkPatientScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'space-between',
  },

  topBar: {
    marginTop: 55,
    paddingHorizontal: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },

  scanArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  scanBox: {
    width: 260,
    height: 260,
    borderWidth: 4,
    borderColor: '#42B65A',
    borderRadius: 28,
    backgroundColor: 'transparent',
  },

  footer: {
    paddingBottom: 70,
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  scanText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },

  rescanButton: {
    marginTop: 20,
    backgroundColor: '#42B65A',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 18,
  },

  rescanText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
  },

  manualButton: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  manualButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    marginLeft: 8,
  },

  centerContainer: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  title: {
    marginTop: 18,
    fontSize: 28,
    fontWeight: '900',
    color: '#2D3436',
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '700',
  },

  button: {
    marginTop: 28,
    backgroundColor: '#42B65A',
    borderRadius: 18,
    paddingHorizontal: 28,
    paddingVertical: 16,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  manualPermissionButton: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  manualPermissionText: {
    color: '#42B65A',
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '900',
  },

  cancelText: {
    marginTop: 20,
    color: '#636E72',
    fontSize: 15,
    fontWeight: '800',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    alignItems: 'center',
  },

  modalIcon: {
    width: 74,
    height: 74,
    borderRadius: 24,
    backgroundColor: '#EAF8EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  modalTitle: {
    fontSize: 23,
    fontWeight: '900',
    color: '#2D3436',
  },

  modalSubtitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
  },

  modalInput: {
    width: '100%',
    backgroundColor: '#F1F2F6',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 17,
    fontWeight: '900',
    color: '#2D3436',
    textAlign: 'center',
    letterSpacing: 1,
  },

  modalButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  modalCancelButton: {
    flex: 1,
    backgroundColor: '#F1F2F6',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 8,
  },

  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#42B65A',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 8,
  },

  modalCancelText: {
    color: '#636E72',
    fontSize: 15,
    fontWeight: '900',
  },

  modalConfirmText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  buttonDisabled: {
    opacity: 0.6,
  },
});