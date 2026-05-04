import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SideMenu = ({ visible, onClose, onNavigate }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>

        {/* Fondo oscuro */}
        <TouchableOpacity style={styles.background} onPress={onClose} />

        {/* Menú */}
        <View style={styles.menu}>
          <Text style={styles.title}>Menú</Text>

          <TouchableOpacity
            style={styles.item}
            onPress={() => onNavigate('history')}
          >
            <Ionicons name="time-outline" size={22} />
            <Text style={styles.text}>Historial</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => onNavigate('profile')}
          >
            <Ionicons name="person-outline" size={22} />
            <Text style={styles.text}>Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => onNavigate('settings')}
          >
            <Ionicons name="settings-outline" size={22} />
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
  background: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  menu: {
    width: 260,
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingHorizontal: 20,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 25,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#DFE6E9',
    marginVertical: 10,
  },
});