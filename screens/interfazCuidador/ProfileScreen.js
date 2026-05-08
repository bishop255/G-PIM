import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { getTheme } from '../../theme/theme';

// El prop "onBack" permite regresar al inventario
const ProfileScreen = ({ onBack, settings, onLogout }) => {
  const { colors, fontSizes } = getTheme(settings);

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
            Nombre del Cuidador
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
            cuidador@ejemplo.com
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

        {/* INFORMACIÓN */}
        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.card },
          ]}
        >
          <View style={styles.infoRow}>
            <Ionicons
              name="call-outline"
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
                Teléfono
              </Text>

              <Text
                style={[
                  styles.infoValue,
                  { color: colors.text },
                ]}
              >
                +56 9 1234 5678
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons
              name="location-outline"
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
                Dirección
              </Text>

              <Text
                style={[
                  styles.infoValue,
                  { color: colors.text },
                ]}
              >
                Santiago, Chile
              </Text>
            </View>
          </View>
        </View>

        {/* BOTÓN EDITAR */}
        <TouchableOpacity style={styles.editButton}>
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
          onPress={onLogout}
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

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },

  userEmail: {
    marginTop: 6,
    fontWeight: '600',
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