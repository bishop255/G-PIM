import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = ({ onBack, settings, onUpdateSettings }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <View style={[styles.container,
        { backgroundColor: settings.darkMode ? '#1E1E1E' : '#F7F7F7' }
    ]}>
      
      {/* HEADER */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={settings.darkMode ? '#FFF' : '#2D3436'}  />
        </TouchableOpacity>

        <Text style={[styles.title,
            {color: settings.darkMode ? '#FFF' : '#2D3436'}
        ]}>
            Ajustes</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* OPCIONES */}
      <View style={styles.card}>

        {/* DARK MODE */}
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="moon-outline" size={22} />
            <Text style={styles.text}>Modo oscuro</Text>
          </View>

          <Switch value={settings.darkMode} onValueChange={(value) => onUpdateSettings({ darkMode: value})} />
        </View>

        {/* TAMAÑO TEXTO */}
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="text-outline" size={22} />
            <Text style={styles.text}>Texto grande</Text>
          </View>

          <Switch value={settings.largeText} onValueChange={(value) => onUpdateSettings({ largeText: value})} />
        </View>

        {/* NOTIFICACIONES */}
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="notifications-outline" size={22} />
            <Text style={styles.text}>Notificaciones</Text>
          </View>

          <Switch value={notifications} onValueChange={setNotifications} />
        </View>

      </View>

    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 55,
    backgroundColor: '#F7F7F7',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  card: {
    marginTop: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '700',
  },
});