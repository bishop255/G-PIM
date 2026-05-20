import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';

import { getTheme } from '../../theme/theme';
import { auth, db } from '../../database/firebaseConfig';

// El prop "onBack" permite regresar al inventario
const ProfileScreen = ({ onBack, settings, onLogout, patientId, onEditProfile }) => {
  const { colors, fontSizes } = getTheme(settings);

  const [caregiverData, setCaregiverData] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          setLoading(false);
          return;
        }

        const caregiverRef = doc(db, 'usuarios', user.uid);
        const caregiverSnap = await getDoc(caregiverRef);

        if (caregiverSnap.exists()) {
          setCaregiverData({
            uid: user.uid,
            ...caregiverSnap.data(),
          });
        }

        if (patientId) {
          const patientRef = doc(db, 'pacientes', patientId);
          const patientSnap = await getDoc(patientRef);

          if (patientSnap.exists()) {
            setPatientData({
              id: patientSnap.id,
              ...patientSnap.data(),
            });
          }
        }
      } catch (error) {
        console.error('Error cargando perfil:', error);
        Alert.alert('Error', 'No se pudo cargar la información del perfil.');
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [patientId]);

  const caregiverName = caregiverData?.name || 'Cuidador';
  const caregiverEmail = caregiverData?.email || auth.currentUser?.email || 'Correo no disponible';
  const caregiverPhone = caregiverData?.phone || 'No registrado';
  const caregiverRelationship = caregiverData?.relationship || 'No definido';

  const patientName =
    patientData?.nombre ||
    patientData?.name ||
    'No hay paciente vinculado';

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          styles.centerContent,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color="#42B65A" />
        <Text
          style={[
            styles.loadingText,
            { color: colors.secondaryText, fontSize: fontSizes.normal },
          ]}
        >
          Cargando perfil...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* CABECERA */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons
              name="arrow-back"
              size={28}
              color={colors.text}
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              {
                color: colors.text,
                fontSize: fontSizes.title,
              },
            ]}
          >
            Mi Perfil
          </Text>

          <View style={{ width: 28 }} />
        </View>

        {/* TARJETA PERFIL */}
        <View
          style={[
            styles.profileCard,
            { backgroundColor: colors.card },
          ]}
        >
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.avatarImage}
              resizeMode="contain"
            />
          </View>

          <Text
            style={[
              styles.userName,
              {
                color: colors.text,
                fontSize: fontSizes.header,
              },
            ]}
          >
            {caregiverName}
          </Text>

          <Text
            style={[
              styles.userEmail,
              {
                color: colors.secondaryText,
                fontSize: fontSizes.normal,
              },
            ]}
          >
            {caregiverEmail}
          </Text>

          {/* ROL */}
          <View style={styles.roleBadge}>
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color="#FFFFFF"
            />

            <Text style={styles.roleText}>
              Familiar / Cuidador
            </Text>
          </View>
        </View>

        {/* INFORMACIÓN CUIDADOR */}
        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.card },
          ]}
        >
          <InfoRow
            icon="call-outline"
            label="Teléfono"
            value={caregiverPhone}
            colors={colors}
          />

          <View style={styles.divider} />

          <InfoRow
            icon="people-outline"
            label="Vínculo con el paciente"
            value={caregiverRelationship}
            colors={colors}
          />
          </View>

        {/* PACIENTE VINCULADO */}
        <View
          style={[
            styles.patientCard,
            { backgroundColor: colors.card },
          ]}
        >
          <View style={styles.patientHeader}>
            <View style={styles.patientIconBox}>
              <Ionicons name="person-circle-outline" size={34} color="#42B65A" />
            </View>

            <View style={styles.patientInfo}>
              <Text
                style={[
                  styles.patientLabel,
                  { color: colors.secondaryText },
                ]}
              >
                Paciente vinculado
              </Text>

              <Text
                style={[
                  styles.patientName,
                  { color: colors.text },
                ]}
              >
                {patientName}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.connectionBadge,
              {
                backgroundColor: patientData ? '#EAF8EE' : '#F1F2F6',
              },
            ]}
          >
            <Ionicons
              name={patientData ? 'checkmark-circle-outline' : 'alert-circle-outline'}
              size={18}
              color={patientData ? '#27AE60' : '#636E72'}
            />
            <Text
              style={[
                styles.connectionText,
                { color: patientData ? '#27AE60' : '#636E72' },
              ]}
            >
              {patientData ? 'Conectado correctamente' : 'Sin conexión activa'}
            </Text>
          </View>
        </View>

        {/* BOTÓN EDITAR */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={onEditProfile}
        >
          <Ionicons
            name="create-outline"
            size={22}
            color="#FFFFFF"
          />

          <Text style={styles.editButtonText}>
            Editar Perfil
          </Text>
        </TouchableOpacity>

        {/* BOTÓN CERRAR SESIÓN */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() =>
            Alert.alert(
              'Cerrar sesión',
              '¿Seguro que deseas cerrar sesión?',
              [
                {
                  text: 'Cancelar',
                  style: 'cancel',
                },
                {
                  text: 'Cerrar sesión',
                  style: 'destructive',
                  onPress: onLogout,
                },
              ]
            )
          }
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color="#FFFFFF"
          />

          <Text style={styles.logoutText}>
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow = ({ icon, label, value, colors }) => {
  return (
    <View style={styles.infoRow}>
      <Ionicons
        name={icon}
        size={22}
        color="#42B65A"
      />

      <View style={styles.infoTextContainer}>
        <Text
          style={[
            styles.infoLabel,
            { color: colors.secondaryText },
          ]}
        >
          {label}
        </Text>

        <Text
          style={[
            styles.infoValue,
            { color: colors.text },
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  centerContent: {
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },

  backButton: {
    padding: 5,
  },

  headerTitle: {
    fontWeight: '800',
  },

  profileCard: {
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  avatarContainer: {
    width: 125,
    height: 125,
    borderRadius: 32,
    backgroundColor: '#F4FFF7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  avatarImage: {
    width: 90,
    height: 90,
  },

  userName: {
    fontWeight: '900',
    textAlign: 'center',
  },

  userEmail: {
    marginTop: 6,
    fontWeight: '600',
    textAlign: 'center',
  },

  roleBadge: {
    marginTop: 18,
    backgroundColor: '#42B65A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },

  roleText: {
    color: '#FFFFFF',
    fontWeight: '800',
    marginLeft: 6,
    fontSize: 13,
  },

  infoCard: {
    marginTop: 18,
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    elevation: 2,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoTextContainer: {
    marginLeft: 14,
    flex: 1,
  },

  infoLabel: {
    fontSize: 13,
    fontWeight: '700',
  },

  infoValue: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '800',
  },

  divider: {
    height: 1,
    backgroundColor: '#DFE6E9',
    marginVertical: 18,
  },

  patientCard: {
    marginTop: 18,
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    elevation: 2,
  },

  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  patientIconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#EAF8EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  patientInfo: {
    flex: 1,
  },

  patientLabel: {
    fontSize: 13,
    fontWeight: '700',
  },

  patientName: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '900',
  },

  connectionBadge: {
    marginTop: 16,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },

  connectionText: {
    fontSize: 13,
    fontWeight: '900',
    marginLeft: 6,
  },

  editButton: {
    marginTop: 24,
    marginHorizontal: 20,
    backgroundColor: '#42B65A',
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },

  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 8,
  },

  logoutButton: {
    marginTop: 14,
    marginBottom: 40,
    marginHorizontal: 20,
    backgroundColor: '#E74C3C',
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 8,
  },
});