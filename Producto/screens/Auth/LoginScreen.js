import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getTheme } from '../../theme/theme';
import { styles } from '../../styles/Auth/LoginScreen.styles';

const LoginScreen = ({
  settings,
  onLogin,
  onGoRegister,
  onBack,
  onResetPassword,
}) => {
  const { colors, fontSizes } = getTheme(settings);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const inputBackground = colors.isDark ? '#2A2A2A' : '#EFEFEF';

  const clearError = (fieldName) => {
    if (!errors[fieldName]) return;

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const getInputStyle = (fieldName) => [
    styles.input,
    {
      color: colors.text,
      backgroundColor: inputBackground,
      fontSize: fontSizes.normal,
    },
    errors[fieldName] && styles.inputError,
  ];

  const handleLoginPress = async () => {
    if (loading) return;

    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Ingresa tu correo electrónico.';
    }

    if (!password.trim()) {
      newErrors.password = 'Ingresa tu contraseña.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Alert.alert(
        'Campos incompletos',
        'Ingresa tu correo y contraseña para continuar.'
      );
      return;
    }

    try {
      setLoading(true);

      const success = await onLogin?.({
        email: email.trim(),
        password,
      });

      if (!success) {
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('Error en LoginScreen:', error);
      setLoading(false);
    }
  };

  const handleResetPasswordPress = async () => {
    if (resetLoading) return;

    if (!email.trim()) {
      setErrors((prev) => ({
        ...prev,
        email: 'Ingresa tu correo para recuperar la contraseña.',
      }));

      Alert.alert(
        'Correo requerido',
        'Primero ingresa tu correo electrónico.'
      );
      return;
    }

    try {
      setResetLoading(true);

      await onResetPassword?.(email.trim());
    } catch (error) {
      console.error('Error recuperando contraseña:', error);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeContainer, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={[styles.container, { backgroundColor: colors.background }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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

        <Text
          style={[
            styles.subtitle,
            { color: colors.secondaryText, fontSize: fontSizes.subtitle },
          ]}
        >
          Inicia sesión como familiar o cuidador
        </Text>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.text, fontSize: fontSizes.normal }]}>
            Correo electrónico
          </Text>

          <TextInput
            style={getInputStyle('email')}
            placeholder="ejemplo@correo.com"
            placeholderTextColor={colors.secondaryText}
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              clearError('email');
            }}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <Text style={[styles.label, { color: colors.text, fontSize: fontSizes.normal }]}>
            Contraseña
          </Text>

          <View
            style={[
              styles.passwordContainer,
              {
                backgroundColor: inputBackground,
              },
              errors.password && styles.inputError,
            ]}
          >
            <TextInput
              style={[
                styles.passwordInput,
                {
                  color: colors.text,
                  fontSize: fontSizes.normal,
                },
              ]}
              placeholder="Ingresa tu contraseña"
              placeholderTextColor={colors.secondaryText}
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                clearError('password');
              }}
              secureTextEntry={!showPassword}
            />

            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color={colors.secondaryText}
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={handleResetPasswordPress}
            disabled={resetLoading}
          >
            <Text style={styles.forgotPasswordText}>
              {resetLoading ? 'Enviando correo...' : '¿Olvidaste tu contraseña?'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLoginPress}
            disabled={loading}
          >
            <Text style={[styles.loginText, { fontSize: fontSizes.button }]}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.registerLink} onPress={onGoRegister}>
            <Text style={[styles.registerText, { fontSize: fontSizes.normal }]}>
              ¿No tienes cuenta? Regístrate
            </Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;