import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTheme } from '../theme/theme';

const SideMenu = ({ visible, onClose, onNavigate, settings }) => {
  const { colors, fontSizes, isDark } = getTheme(settings);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: isDark
              ? 'rgba(0,0,0,0.75)'
              : 'rgba(0,0,0,0.4)',
          },
        ]}
      >
        <View
          style={[
            styles.menu,
            {
              backgroundColor: colors.card,
              borderRightColor: colors.border,
            },
          ]}
        >
          <View style={styles.header}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.logoText,
                { color: colors.text, fontSize: fontSizes.header },
              ]}
            >
              G-PIM
            </Text>
          </View>

          <Text
            style={[
              styles.title,
              {
                color: colors.secondaryText,
                fontSize: fontSizes.normal,
              },
            ]}
          >
            Menú
          </Text>

          <TouchableOpacity
            style={styles.item}
            onPress={() => onNavigate('history')}
          >
            <Ionicons name="time-outline" size={22} color={colors.text} />
            <Text
              style={[
                styles.text,
                { color: colors.text, fontSize: fontSizes.normal },
              ]}
            >
              Historial
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => onNavigate('profile')}
          >
            <Ionicons name="person-outline" size={22} color={colors.text} />
            <Text
              style={[
                styles.text,
                { color: colors.text, fontSize: fontSizes.normal },
              ]}
            >
              Perfil
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => onNavigate('settings')}
          >
            <Ionicons name="settings-outline" size={22} color={colors.text} />
            <Text
              style={[
                styles.text,
                { color: colors.text, fontSize: fontSizes.normal },
              ]}
            >
              Ajustes
            </Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity
            style={styles.item}
            onPress={() => onNavigate('logout')}
          >
            <Ionicons name="log-out-outline" size={22} color={colors.danger} />
            <Text
              style={[
                styles.text,
                { color: colors.danger, fontSize: fontSizes.normal },
              ]}
            >
              Cerrar sesión
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.background} onPress={onClose} />
      </View>
    </Modal>
  );
};

export default SideMenu;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  menu: {
    width: 270,
    paddingTop: 58,
    paddingHorizontal: 20,
    elevation: 10,
    borderRightWidth: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  logo: {
    width: 62,
    height: 62,
    marginRight: 10,
    borderRadius: 8,
  },
  logoText: {
    fontWeight: '900',
  },
  title: {
    fontWeight: '900',
    marginBottom: 22,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  text: {
    marginLeft: 12,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
});