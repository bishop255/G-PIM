import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Modal,
  TextInput,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import {styles} from '../../styles/interfazCuidador/LinkPatientScreen.styles';
import { db, auth } from '../../database/firebaseConfig';

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore';

const LinkPatientScreen = ({ patientId, onBack, onLinked }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingLink, setCheckingLink] = useState(true);
  const [manualVisible, setManualVisible] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [patientName, setPatientName] = useState('Paciente');
  const [activeLinkRequestId, setActiveLinkRequestId] = useState(null);

  useEffect(() => {
    const loadCurrentLinkStatus = async () => {
      try {
        if (!patientId) {
          setCheckingLink(false);
          return;
        }

        const patientRef = doc(db, 'pacientes', patientId);
        const patientSnap = await getDoc(patientRef);

        if (patientSnap.exists()) {
          const data = patientSnap.data();
          setPatientName(data.nombre || data.name || 'Paciente');
        }

        const requestQuery = query(
          collection(db, 'patientLinkRequests'),
          where('patientId', '==', patientId),
          where('estado', '==', 'vinculado')
        );

        const requestSnap = await getDocs(requestQuery);

        if (!requestSnap.empty) {
          setActiveLinkRequestId(requestSnap.docs[0].id);
        }
      } catch (error) {
        console.error('Error revisando vinculación:', error);
      } finally {
        setCheckingLink(false);
      }
    };

    loadCurrentLinkStatus();
  }, [patientId]);

  const handleUnlinkPatient = () => {
    Alert.alert(
      'Desvincular paciente',
      `¿Seguro que deseas desvincular la interfaz de ${patientName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, desvincular',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirmación final',
              'Esta acción desconectará la interfaz del adulto mayor. El inventario NO se eliminará.',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Desvincular',
                  style: 'destructive',
                  onPress: unlinkPatient,
                },
              ]
            );
          },
        },
      ]
    );
  };

  const unlinkPatient = async () => {
    const user = auth.currentUser;

    if (!activeLinkRequestId || !user || !patientId) return;

    try {
      setLoading(true);

      await updateDoc(doc(db, 'patientLinkRequests', activeLinkRequestId), {
        estado: 'desvinculado',
        unlinkedAt: serverTimestamp(),
        unlinkedBy: user.uid,
      });


      await updateDoc(doc(db, 'pacientes', patientId), {
        estadoVinculacion: 'desvinculado',
        unlinkedAt: serverTimestamp(),
      });

      setActiveLinkRequestId(null);

      Alert.alert(
        'Paciente desvinculado',
        'La interfaz del paciente fue desconectada correctamente.'
      );
    } catch (error) {
      console.error('Error desvinculando paciente:', error);
      Alert.alert('Error', 'No se pudo desvincular el paciente.');
    } finally {
      setLoading(false);
    }
  };

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

      await updateDoc(doc(db, 'pacientes', patientId), {
        cuidadores: arrayUnion(user.uid),
        estadoVinculacion: 'vinculado',
        linkedAt: serverTimestamp(),
      });

      setActiveLinkRequestId(requestDoc.id);

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

  if (checkingLink) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#42B65A" />
        <Text style={styles.subtitle}>Revisando vinculación...</Text>
      </View>
    );
  }

  if (activeLinkRequestId) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.connectedIcon}>
          <Ionicons name="checkmark-circle-outline" size={72} color="#42B65A" />
        </View>

        <Text style={styles.title}>Paciente vinculado</Text>

        <Text style={styles.subtitle}>
          Ya tienes conectada la interfaz de {patientName}.
        </Text>

        <View style={styles.connectedBox}>
          <Ionicons name="person-outline" size={24} color="#42B65A" />
          <Text style={styles.connectedText}>{patientName}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={onBack}>
          <Text style={styles.buttonText}>Volver al inventario</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.unlinkButton}
          onPress={handleUnlinkPatient}
          disabled={loading}
        >
          <Ionicons name="unlink-outline" size={21} color="#FFFFFF" />
          <Text style={styles.unlinkText}>
            {loading ? 'Desvinculando...' : 'Desvincular paciente'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

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

