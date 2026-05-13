import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const scale = Math.min(width / 390, 1.15);

const EmergencyScreen = ({ onBack, onCallFamily, onSendAlert, onCancel }) => {
  const [alertSent, setAlertSent] = useState(false);

  const handleSendAlert = () => {
    setAlertSent(true);
    if (onSendAlert) {
      onSendAlert();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F2" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoWrapper}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>G-PIM</Text>
        </View>

        <Text style={styles.title}>NECESITO AYUDA</Text>
        <Text style={styles.subtitle}>Tu familiar sera notificado</Text>

        <TouchableOpacity
          style={[styles.actionButton, styles.greenButton]}
          onPress={onCallFamily}
          activeOpacity={0.85}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonEmoji}>📱</Text>
            <Text style={styles.actionTextDark}>Llamar a{'\n'}familiar</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.yellowButton]}
          onPress={handleSendAlert}
          activeOpacity={0.85}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonEmoji}>🔔</Text>
            <Text style={styles.actionTextDark}>Enviar alerta</Text>
          </View>
        </TouchableOpacity>

        {alertSent && (
          <View style={styles.successBox}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successText}>Tu familiar ha sido notificado</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel || onBack}
          activeOpacity={0.85}
        >
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmergencyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: width * 0.08,
    paddingTop: height * 0.06,
    paddingBottom: height * 0.05,
    justifyContent: 'center',
  },

  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },

  logo: {
    width: 56 * scale,
    height: 56 * scale,
    marginRight: 10,
  },

  logoText: {
    fontSize: 26 * scale,
    fontWeight: '800',
    color: '#000000',
  },

  title: {
    textAlign: 'center',
    fontSize: 34 * scale,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 12,
  },

  subtitle: {
    textAlign: 'center',
    fontSize: 20 * scale,
    color: '#333333',
    marginBottom: 38,
    fontWeight: '700',
  },

  actionButton: {
    width: '100%',
    minHeight: 115,
    borderRadius: 26,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
  },

  greenButton: {
    backgroundColor: '#B8DDB9',
  },

  yellowButton: {
    backgroundColor: '#F1DE9D',
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  buttonEmoji: {
    fontSize: 46 * scale,
    marginRight: 18,
  },

  actionTextDark: {
    flexShrink: 1,
    fontSize: 24 * scale,
    fontWeight: '900',
    color: '#000000',
    lineHeight: 32 * scale,
  },

  successBox: {
    marginTop: 10,
    backgroundColor: '#B8DDB9',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 34,
  },

  successIcon: {
    fontSize: 24,
    marginRight: 10,
  },

  successText: {
    fontSize: 18 * scale,
    fontWeight: '700',
    color: '#1F4D2E',
    textAlign: 'center',
  },

  cancelButton: {
    backgroundColor: '#FF1E1E',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    color: '#FFFFFF',
    fontSize: 24 * scale,
    fontWeight: '800',
  },
});