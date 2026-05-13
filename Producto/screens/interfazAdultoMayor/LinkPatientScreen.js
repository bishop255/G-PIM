import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';

import { auth, db } from '../../database/firebaseConfig';

import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  arrayUnion,
} from 'firebase/firestore';

import { getTheme } from '../../theme/theme';

const LinkPatientScreen = ({ settings, patientId, onBack, onLinked }) => {
  const { colors, fontSizes } = getTheme(settings);

  const [patientData, setPatientData] = useState(null);
  const [linkCode, setLinkCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [linking, setLinking] = useState(false);

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
        console.error('Error cargando paciente:', error);
        Alert.alert('Error', 'No se pudo cargar el paciente.');
      } finally {
        setLoading(false);
      }
    };

    loadPatient();
  }, [patientId]);

  const handleLinkPatient = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Error', 'No hay usuario autenticado.');
      return;
    }

    if (!linkCode.trim()) {
      Alert.alert('Código requerido', 'Ingresa un código de vinculación.');
      return;
    }

    try {
      setLinking(true);

      const normalizedCode = linkCode.trim().toUpperCase();

      const patientsRef = collection(db, 'pacientes');
      const q = query(
        patientsRef,
        where('codigoVinculacion', '==', normalizedCode)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert('No encontrado', 'No existe un paciente con ese código.');
        return;
      }

      const patientDoc = querySnapshot.docs[0];
      const linkedPatientId = patientDoc.id;

      await updateDoc(doc(db, 'pacientes', linkedPatientId), {
        cuidadores: arrayUnion(user.uid),
      });

      await updateDoc(doc(db, 'usuarios', user.uid), {
        hasPatient: true,
        patientId: linkedPatientId,
        patientIds: arrayUnion(linkedPatientId),
      });

      Alert.alert('Paciente vinculado', 'Ahora tienes acceso a este paciente.');

      setLinkCode('');

      if (onLinked) {
        onLinked(linkedPatientId);
      }
    } catch (error) {
      console.error('Error vinculando paciente:', error);
      Alert.alert('Error', 'No se pudo vincular el paciente.');
    } finally {
      setLinking(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#42B65A" />
        <Text style={[styles.loadingText, { color: colors.secondaryText }]}>
          Cargando vinculación...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        { backgroundColor: colors.background },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              { color: colors.text, fontSize: fontSizes.header },
            ]}
          >
            Vincular Paciente
          </Text>

          <View style={{ width: 24 }} />
        </View>

        {/* QR DEL PACIENTE ACTUAL */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="qr-code-outline" size={42} color="#42B65A" />
          </View>

          <Text
            style={[
              styles.title,
              { color: colors.text, fontSize: fontSizes.header },
            ]}
          >
            Código de vinculación
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: colors.secondaryText, fontSize: fontSizes.normal },
            ]}
          >
            Comparte este código o QR con otro cuidador para que pueda acceder al paciente.
          </Text>

          {patientData?.codigoVinculacion ? (
            <>
              <View style={styles.qrBox}>
                <QRCode
                  value={patientData.codigoVinculacion}
                  size={190}
                  backgroundColor="#FFFFFF"
                  color="#2D3436"
                />
              </View>

              <View style={styles.codeBox}>
                <Text style={styles.codeText}>
                  {patientData.codigoVinculacion}
                </Text>
              </View>

              <Text
                style={[
                  styles.patientName,
                  { color: colors.text, fontSize: fontSizes.normal },
                ]}
              >
                Paciente: {patientData.nombre} {patientData.apellido}
              </Text>
            </>
          ) : (
            <Text style={[styles.noCodeText, { color: colors.secondaryText }]}>
              Este paciente aún no tiene código de vinculación.
            </Text>
          )}
        </View>

        {/* INGRESAR CÓDIGO */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="link-outline" size={42} color="#2D9CDB" />
          </View>

          <Text
            style={[
              styles.title,
              { color: colors.text, fontSize: fontSizes.header },
            ]}
          >
            Vincular con código
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: colors.secondaryText, fontSize: fontSizes.normal },
            ]}
          >
            Ingresa el código que te compartió otro cuidador o familiar.
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.isDark ? '#2A2A2A' : '#F1F2F6',
                color: colors.text,
                borderColor: colors.border,
                fontSize: fontSizes.normal,
              },
            ]}
            placeholder="Ej: GPIM-ABC123"
            placeholderTextColor={colors.secondaryText}
            autoCapitalize="characters"
            value={linkCode}
            onChangeText={setLinkCode}
          />

          <TouchableOpacity
            style={[styles.linkButton, linking && styles.buttonDisabled]}
            onPress={handleLinkPatient}
            disabled={linking}
          >
            <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />

            <Text style={[styles.linkButtonText, { fontSize: fontSizes.button }]}>
              {linking ? 'Vinculando...' : 'Vincular paciente'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default LinkPatientScreen;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontWeight: '700',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  headerTitle: {
    fontWeight: '900',
  },

  card: {
    borderRadius: 28,
    padding: 22,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 2,
  },

  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: '#EAF8EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  title: {
    fontWeight: '900',
    textAlign: 'center',
  },

  subtitle: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
    fontWeight: '600',
    lineHeight: 20,
  },

  qrBox: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 24,
    marginBottom: 18,
  },

  codeBox: {
    backgroundColor: '#F1F2F6',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 12,
  },

  codeText: {
    color: '#2D3436',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },

  patientName: {
    marginTop: 4,
    fontWeight: '800',
    textAlign: 'center',
  },

  noCodeText: {
    fontWeight: '700',
    textAlign: 'center',
  },

  input: {
    width: '100%',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderWidth: 1,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 1,
  },

  linkButton: {
    width: '100%',
    marginTop: 18,
    backgroundColor: '#42B65A',
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },

  linkButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    marginLeft: 8,
  },

  buttonDisabled: {
    opacity: 0.6,
  },
});