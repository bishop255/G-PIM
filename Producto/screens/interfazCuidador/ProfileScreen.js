import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { styles } from '../../styles/interfazCuidador/ProfileScreen.styles';
import { getTheme } from '../../theme/theme';
import { auth, db } from '../../database/firebaseConfig';

const ProfileScreen = ({
  onBack,
  settings,
  onLogout,
  patientId,
  onEditProfile,
  onGoInventory,
  onGoAlerts,
  onGoOffers,
  onGoProfile,
}) => {
  const insets = useSafeAreaInsets();
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
  const caregiverEmail =
    caregiverData?.email || auth.currentUser?.email || 'Correo no disponible';
  const caregiverPhone = caregiverData?.phone || 'No registrado';
  const caregiverRelationship = caregiverData?.relationship || 'No definido';

  const patientName =
    patientData?.nombre || patientData?.name || 'No hay paciente vinculado';

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          styles.centerContent,
          { backgroundColor: colors.background },
        ]}
        edges={['top', 'left', 'right']}
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
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <View style={styles.content}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 110 + insets.bottom }}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={28} color={colors.text} />
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

          <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
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

            <View style={styles.roleBadge}>
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color="#FFFFFF"
              />

              <Text style={styles.roleText}>Familiar / Cuidador</Text>
            </View>
          </View>

          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
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

          <View style={[styles.patientCard, { backgroundColor: colors.card }]}>
            <View style={styles.patientHeader}>
              <View style={styles.patientIconBox}>
                <Ionicons name="person-circle-outline" size={34} color="#42B65A" />
              </View>

              <View style={styles.patientInfo}>
                <Text style={[styles.patientLabel, { color: colors.secondaryText }]}>
                  Paciente vinculado
                </Text>

                <Text style={[styles.patientName, { color: colors.text }]}>
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

          <TouchableOpacity style={styles.editButton} onPress={onEditProfile}>
            <Ionicons name="create-outline" size={22} color="#FFFFFF" />
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() =>
              Alert.alert('Cerrar sesión', '¿Seguro que deseas cerrar sesión?', [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Cerrar sesión',
                  style: 'destructive',
                  onPress: onLogout,
                },
              ])
            }
          >
            <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </ScrollView>

        <View
          style={[
            styles.bottomNav,
            {
              backgroundColor: colors.card,
              height: 75 + insets.bottom,
              paddingBottom: insets.bottom,
            },
          ]}
        >
          <TouchableOpacity style={styles.navItem} onPress={onGoInventory}>
            <Ionicons name="home-outline" size={24} color={colors.text} />
            <Text
              style={[
                styles.navText,
                { color: colors.text, fontSize: fontSizes.small },
              ]}
            >
              Inicio
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={onGoAlerts}>
            <Ionicons name="alert-circle-outline" size={24} color="#E74C3C" />
            <Text
              style={[
                styles.navText,
                { color: '#E74C3C', fontSize: fontSizes.small },
              ]}
            >
              Alertas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={onGoOffers}>
            <Ionicons name="cart-outline" size={24} color="#F39C12" />
            <Text
              style={[
                styles.navText,
                { color: '#F39C12', fontSize: fontSizes.small },
              ]}
            >
              Ofertas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={onGoProfile}>
            <Ionicons name="person" size={24} color="#42B65A" />
            <Text
              style={[
                styles.navText,
                { color: '#42B65A', fontSize: fontSizes.small },
              ]}
            >
              Perfil
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const InfoRow = ({ icon, label, value, colors }) => {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={22} color="#42B65A" />

      <View style={styles.infoTextContainer}>
        <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>
          {label}
        </Text>

        <Text style={[styles.infoValue, { color: colors.text }]}>
          {value}
        </Text>
      </View>
    </View>
  );
};

export default ProfileScreen;

