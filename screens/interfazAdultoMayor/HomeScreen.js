import React from 'react';
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
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const scale = Math.min(width / 390, 1.15);

const HomeScreen = ({ onBack, onTakeMedicine, onLowStock, onEmergency }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F2" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={30 * scale} color="#000000" />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>G-PIM</Text>
          </View>

          <View style={styles.rightSpacer} />
        </View>

        <View style={styles.headerContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>HOLA, USUARIO</Text>
            <Text style={styles.titleIcon}>🧑‍⚕️</Text>
          </View>

          <Text style={styles.subtitle}>¿Que deseas hacer ahora?</Text>
        </View>

        <View style={styles.buttonsWrapper}>
          <TouchableOpacity
            style={[styles.actionButton, styles.greenButton]}
            onPress={onTakeMedicine}
            activeOpacity={0.85}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonEmoji}>💊</Text>
              <Text style={styles.actionText}>Tome mi{'\n'}medicamento</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.yellowButton]}
            onPress={onLowStock}
            activeOpacity={0.85}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonEmoji}>💊</Text>
              <Text style={styles.actionText}>Se acaba mi{'\n'}medicamento</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.redButton]}
            onPress={onEmergency}
            activeOpacity={0.85}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonEmoji}>📢</Text>
              <Text style={styles.actionText}>Necesito Ayuda</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: height * 0.055,
    paddingHorizontal: width * 0.06,
    paddingBottom: height * 0.04,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  backButton: {
    width: 42,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 44 * scale,
    height: 44 * scale,
    marginRight: 8,
  },

  logoText: {
    fontSize: 21 * scale,
    fontWeight: '800',
    color: '#000000',
  },

  rightSpacer: {
    width: 42,
  },

  headerContainer: {
    marginTop: height * 0.12,
    marginBottom: height * 0.035,
    alignItems: 'center',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  title: {
    fontSize: 32 * scale,
    fontWeight: '900',
    color: '#000000',
    marginRight: 8,
    textAlign: 'center',
  },

  titleIcon: {
    fontSize: 30 * scale,
  },

  subtitle: {
    marginTop: 12,
    fontSize: 22 * scale,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
  },

  buttonsWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 0,
  },

  actionButton: {
    width: '100%',
    minHeight: height * 0.13,
    borderRadius: 30,
    justifyContent: 'center',
    paddingHorizontal: width * 0.07,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
  },

  greenButton: {
    backgroundColor: '#4CAF50',
  },

  yellowButton: {
    backgroundColor: '#F2C230',
  },

  redButton: {
    backgroundColor: '#F00000',
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  buttonEmoji: {
    fontSize: 44 * scale,
    marginRight: 18,
  },

  actionText: {
    flexShrink: 1,
    fontSize: 21 * scale,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 29 * scale,
  },
});