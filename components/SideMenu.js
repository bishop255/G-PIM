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

const SideMenu = ({ visible, onClose, onNavigate }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.menu}>
          <View style={styles.header}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>G-PIM</Text>
          </View>

          <Text style={styles.title}>Menú</Text>

          <TouchableOpacity
            style={styles.item}
            onPress={() => onNavigate('history')}
          >
            <Ionicons name="time-outline" size={22} color="#2D3436" />
            <Text style={styles.text}>Historial</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => onNavigate('profile')}
          >
            <Ionicons name="person-outline" size={22} color="#2D3436" />
            <Text style={styles.text}>Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => onNavigate('settings')}
          >
            <Ionicons name="settings-outline" size={22} color="#2D3436" />
            <Text style={styles.text}>Ajustes</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.item}
            onPress={() => onNavigate('logout')}
          >
            <Ionicons name="log-out-outline" size={22} color="#E74C3C" />
            <Text style={[styles.text, { color: '#E74C3C' }]}>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  menu: {
    width: 270,
    backgroundColor: '#FFFFFF',
    paddingTop: 58,
    paddingHorizontal: 20,
    elevation: 10,
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
    fontSize: 21,
    fontWeight: '900',
    color: '#2D3436',
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: '#636E72',
    marginBottom: 22,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  text: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '800',
    color: '#2D3436',
  },
  divider: {
    height: 1,
    backgroundColor: '#DFE6E9',
    marginVertical: 10,
  },
});