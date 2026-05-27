import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {styles} from '../../styles/Auth/RegisterScreen.styles';
import { getTheme } from '../../theme/theme';

const RegisterScreen = ({ settings, onRegister, onGoLogin, onBack }) => {
  const { colors, fontSizes } = getTheme(settings);

  const relationships = [
    'Hijo/a',
    'Nieto/a',
    'Esposo/a',
    'Hermano/a',
    'Cuidador',
    'Tutor',
    'Otro',
  ];

  // Estados de los campos del formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [relationship, setRelationship] = useState('Hijo/a');
  const [loading, setLoading] = useState(false);

  // Estados para mostrar u ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Función para validar y registrar usuario
  const handleRegisterPress = async () => {
    if (loading) return;

    // Validar que ambas contraseñas coincidan
    if (password !== confirmPassword) {
      Alert.alert(
        'Contraseñas diferentes',
        'Las contraseñas deben ser exactamente iguales.'
      );
      return;
    }

    setLoading(true);

    await onRegister?.({
      name,
      email,
      phone,
      password,
      relationship,
    });

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Botón para volver */}
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Título y subtítulo */}
        <Text style={[styles.title, { color: colors.text, fontSize: fontSizes.title }]}>
          Crear cuenta
        </Text>

        <Text style={[styles.subtitle, { color: colors.secondaryText, fontSize: fontSizes.subtitle }]}>
          Registra tus datos como familiar o cuidador
        </Text>

        {/* Tarjeta del formulario */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Nombre */}
          <Text style={[styles.label, { color: colors.text, fontSize: fontSizes.normal }]}>
            Nombre completo
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
            placeholder="Ej: Juan Perez"
            placeholderTextColor={colors.secondaryText}
            value={name}
            onChangeText={setName}
          />

          {/* Correo */}
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

          {/* Teléfono */}
          <Text style={[styles.label, { color: colors.text, fontSize: fontSizes.normal }]}>
            Teléfono
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
            placeholder="+56 9 1234 5678"
            placeholderTextColor={colors.secondaryText}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          {/* Relación con el paciente */}
          <Text
            style={[
              styles.label,
              {
                color: colors.text,
                fontSize: fontSizes.normal,
              },
            ]}
          >
            Relación con el paciente
          </Text>

          <View style={styles.relationshipContainer}>
            {relationships.map((item) => {
              const selected = item === relationship;

              return (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.relationshipButton,
                    selected && styles.relationshipButtonSelected,
                  ]}
                  onPress={() => setRelationship(item)}
                >
                  <Text
                    style={[
                      styles.relationshipText,
                      selected && styles.relationshipTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Contraseña */}
          <Text style={[styles.label, { color: colors.text, fontSize: fontSizes.normal }]}>
            Contraseña
          </Text>

          <View
            style={[
              styles.passwordContainer,
              {
                backgroundColor: colors.isDark ? '#2A2A2A' : '#EFEFEF',
              },
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
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={colors.secondaryText}
              value={password}
              onChangeText={setPassword}
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

          {/* Confirmar contraseña */}
          <Text style={[styles.label, { color: colors.text, fontSize: fontSizes.normal }]}>
            Confirmar contraseña
          </Text>

          <View
            style={[
              styles.passwordContainer,
              {
                backgroundColor: colors.isDark ? '#2A2A2A' : '#EFEFEF',
              },
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
              placeholder="Escribe nuevamente la contraseña"
              placeholderTextColor={colors.secondaryText}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />

            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color={colors.secondaryText}
              />
            </TouchableOpacity>
          </View>

          {/* Botón crear cuenta */}
          <TouchableOpacity
            style={[styles.registerButton, loading && { opacity: 0.6 }]}
            onPress={handleRegisterPress}
            disabled={loading}
          >
            <Text style={[styles.registerButtonText, { fontSize: fontSizes.button }]}>
              Crear cuenta
            </Text>
          </TouchableOpacity>

          {/* Ir a iniciar sesión */}
          <TouchableOpacity style={styles.loginLink} onPress={onGoLogin}>
            <Text style={[styles.loginText, { fontSize: fontSizes.normal }]}>
              ¿Ya tienes cuenta? Inicia sesión
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
