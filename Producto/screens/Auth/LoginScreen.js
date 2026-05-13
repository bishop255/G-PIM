import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTheme } from '../../theme/theme';
import { EmailAuthCredential } from 'firebase/auth/web-extension';

const LoginScreen = ({ settings, onLogin, onGoRegister, onBack }) => {
  const { colors, fontSizes } = getTheme(settings);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={[styles.title, { color: colors.text, fontSize: fontSizes.title }]}>
        Bienvenido
      </Text>

      <Text style={[styles.subtitle, { color: colors.secondaryText, fontSize: fontSizes.subtitle }]}>
        Inicia sesión como familiar o cuidador
      </Text>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.text, fontSize: fontSizes.normal }]}>
          Correo electrónico
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              backgroundColor: colors.isDark ? '#2A2A2A' : '#EFEFEF',
              fontSize: fontSizes.normal,
            },
          ]}
          placeholder="ejemplo@correo.com"
          placeholderTextColor={colors.secondaryText}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={[styles.label, { color: colors.text, fontSize: fontSizes.normal }]}>
          Contraseña
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              backgroundColor: colors.isDark ? '#2A2A2A' : '#EFEFEF',
              fontSize: fontSizes.normal,
            },
          ]}
          placeholder="Ingresa tu contraseña"
          placeholderTextColor={colors.secondaryText}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={[
            styles.loginButton, loading && {opacity: 0.6},
            ]} 
            onPress={async () => {
                if (loading) return;

                setLoading(true);

                const success = await onLogin?. ({
                    email,
                    password,
                })

                setLoading(false);
            }}
            disabled={loading}  
            >
          <Text style={[styles.loginText, { fontSize: fontSizes.button }]}>
            Iniciar sesión
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerLink} onPress={onGoRegister}>
          <Text style={[styles.registerText, { fontSize: fontSizes.normal }]}>
            ¿No tienes cuenta? Regístrate
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 55,
  },
  backButton: {
    width: 42,
    height: 42,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 18,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 18,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    fontWeight: '600',
  },
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    elevation: 2,
  },
  label: {
    fontWeight: '800',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  loginButton: {
    backgroundColor: '#42B65A',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  registerLink: {
    alignItems: 'center',
    marginTop: 18,
  },
  registerText: {
    color: '#42B65A',
    fontWeight: '800',
  },
});