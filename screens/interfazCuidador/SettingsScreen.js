import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTheme } from '../../theme/theme';

const SettingsScreen = ({ onBack, settings, onUpdateSettings }) => {
  const [notifications, setNotifications] = useState(true);
  const { colors, fontSizes } = getTheme(settings);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text
          style={[
            styles.title,
            { color: colors.text, fontSize: fontSizes.header },
          ]}
        >
          Ajustes
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="moon-outline" size={22} color={colors.text} />
            <Text
              style={[
                styles.text,
                { color: colors.text, fontSize: fontSizes.normal },
              ]}
            >
              Modo oscuro
            </Text>
          </View>

          <Switch
            value={settings.darkMode}
            onValueChange={(value) => onUpdateSettings({ darkMode: value })}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="text-outline" size={22} color={colors.text} />
            <Text
              style={[
                styles.text,
                { color: colors.text, fontSize: fontSizes.normal },
              ]}
            >
              Texto grande
            </Text>
          </View>

          <Switch
            value={settings.largeText}
            onValueChange={(value) => onUpdateSettings({ largeText: value })}
          />
        </View>

        <View style={styles.rowLast}>
          <View style={styles.rowLeft}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={colors.text}
            />
            <Text
              style={[
                styles.text,
                { color: colors.text, fontSize: fontSizes.normal },
              ]}
            >
              Notificaciones
            </Text>
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
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
  },
  card: {
    marginTop: 25,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  rowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 10,
    fontWeight: '700',
  },
});