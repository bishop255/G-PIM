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
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/Auth/RegisterScreen.styles';
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

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [relationship, setRelationship] = useState('Hijo/a');
  const [loading, setLoading] = useState(false);

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const inputBackground = colors.isDark ? '#2A2A2A' : '#EFEFEF';

  const getInputStyle = (fieldName) => [
    styles.input,
    {
      color: colors.text,
      backgroundColor: inputBackground,
      fontSize: fontSizes.normal,
    },
    errors[fieldName] && styles.inputError,
  ];

  const getPasswordContainerStyle = (fieldName) => [
    styles.passwordContainer,
    {
      backgroundColor: inputBackground,
    },
    errors[fieldName] && styles.inputError,
  ];

  const clearError = (fieldName) => {
    if (!errors[fieldName]) return;

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const handleRegisterPress = async () => {
    if (loading) return;

    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Ingresa tu nombre completo.';
    if (!email.trim()) newErrors.email = 'Ingresa tu correo electrónico.';
    if (!phone.trim()) newErrors.phone = 'Ingresa tu teléfono.';
    if (!password.trim()) newErrors.password = 'Ingresa una contraseña.';
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirma tu contraseña.';
    }

    if (password.trim() && password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (password.trim() && confirmPassword.trim() && password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    if (!acceptedTerms) {
      newErrors.terms = 'Debes aceptar los términos y condiciones.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Alert.alert(
        'Campos incompletos',
        'Revisa los campos marcados antes de crear la cuenta.'
      );
      return;
    }

    setLoading(true);

    const success = await onRegister?.({
      name,
      email,
      phone,
      password,
      relationship,
    });

    if (!success) {
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
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
          Crear cuenta
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: colors.secondaryText, fontSize: fontSizes.subtitle },
          ]}
        >
          Registra tus datos como familiar o cuidador
        </Text>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.text, fontSize: fontSizes.normal }]}>
            Nombre completo
          </Text>

          <TextInput
            style={getInputStyle('name')}
            placeholder="Ej: Juan Perez"
            placeholderTextColor={colors.secondaryText}
            value={name}
            onChangeText={(value) => {
              setName(value);
              clearError('name');
            }}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

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
            Teléfono
          </Text>

          <TextInput
            style={getInputStyle('phone')}
            placeholder="+56 9 1234 5678"
            placeholderTextColor={colors.secondaryText}
            value={phone}
            onChangeText={(value) => {
              setPhone(value);
              clearError('phone');
            }}
            keyboardType="phone-pad"
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

          <Text style={[styles.label, { color: colors.text, fontSize: fontSizes.normal }]}>
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

          <Text style={[styles.label, { color: colors.text, fontSize: fontSizes.normal }]}>
            Contraseña
          </Text>

          <View style={getPasswordContainerStyle('password')}>
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

          <Text style={[styles.label, { color: colors.text, fontSize: fontSizes.normal }]}>
            Confirmar contraseña
          </Text>

          <View style={getPasswordContainerStyle('confirmPassword')}>
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
              onChangeText={(value) => {
                setConfirmPassword(value);
                clearError('confirmPassword');
              }}
              secureTextEntry={!showConfirmPassword}
            />

            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color={colors.secondaryText}
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}

          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={[styles.checkbox, acceptedTerms && styles.checkboxSelected]}
              onPress={() => setTermsVisible(true)}
              activeOpacity={0.85}
            >
              {acceptedTerms && (
                <Ionicons name="checkmark" size={18} color="#FFFFFF" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.termsTextContainer}
              onPress={() => setTermsVisible(true)}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.termsText,
                  { color: colors.secondaryText, fontSize: fontSizes.small },
                ]}
              >
                Acepto los{' '}
                <Text style={styles.termsLink}>términos y condiciones</Text>{' '}
                de uso de G-PIM.
              </Text>
            </TouchableOpacity>
          </View>
          {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
            onPress={handleRegisterPress}
            disabled={loading}
          >
            <Text style={[styles.registerButtonText, { fontSize: fontSizes.button }]}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginLink} onPress={onGoLogin}>
            <Text style={[styles.loginText, { fontSize: fontSizes.normal }]}>
              ¿Ya tienes cuenta? Inicia sesión
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={termsVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setTermsVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.termsModalCard, { backgroundColor: colors.card }]}>
              <View style={styles.termsModalHeader}>
                <Ionicons name="document-text-outline" size={30} color="#42B65A" />
                <Text
                  style={[
                    styles.termsModalTitle,
                    { color: colors.text, fontSize: fontSizes.header },
                  ]}
                >
                  Términos y Condiciones
                </Text>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.termsModalContent}
              >
                <Text style={[styles.termsModalSection, { color: colors.text }]}>
                  1. Finalidad de la aplicación
                </Text>
                <Text style={[styles.termsModalParagraph, { color: colors.secondaryText }]}>
                  G-PIM es una aplicación diseñada para apoyar la gestión, control y seguimiento de medicamentos e insumos médicos, facilitando la organización del tratamiento de los pacientes y el monitoreo por parte de sus cuidadores o familiares.
                </Text>

                <Text style={[styles.termsModalSection, { color: colors.text }]}>
                  2. Uso responsable
                </Text>
                <Text style={[styles.termsModalParagraph, { color: colors.secondaryText }]}>
                  El usuario se compromete a utilizar la aplicación de manera responsable, ética y únicamente para los fines previstos. Queda prohibido ingresar información falsa, incompleta o engañosa.
                </Text>

                <Text style={[styles.termsModalSection, { color: colors.text }]}>
                  3. Información registrada
                </Text>
                <Text style={[styles.termsModalParagraph, { color: colors.secondaryText }]}>
                  El usuario es responsable de la veracidad y actualización de los datos ingresados, incluyendo información personal, medicamentos, dosis, alertas, inventario y datos del paciente.
                </Text>

                <Text style={[styles.termsModalSection, { color: colors.text }]}>
                  4. Alcance de la aplicación
                </Text>
                <Text style={[styles.termsModalParagraph, { color: colors.secondaryText }]}>
                  G-PIM es una herramienta de apoyo y no reemplaza la evaluación, supervisión ni indicaciones de un profesional de la salud.
                </Text>

                <Text style={[styles.termsModalSection, { color: colors.text }]}>
                  5. Notificaciones y alertas
                </Text>
                <Text style={[styles.termsModalParagraph, { color: colors.secondaryText }]}>
                  Las notificaciones dependen de la información ingresada, permisos del dispositivo, conectividad y servicios externos. El usuario debe supervisar su correcto funcionamiento.
                </Text>

                <Text style={[styles.termsModalSection, { color: colors.text }]}>
                  6. Privacidad y almacenamiento de datos
                </Text>
                <Text style={[styles.termsModalParagraph, { color: colors.secondaryText }]}>
                  G-PIM puede almacenar información relacionada con usuarios, pacientes, medicamentos, alertas e historial, utilizada exclusivamente para el funcionamiento de la plataforma.
                </Text>

                <Text style={[styles.termsModalSection, { color: colors.text }]}>
                  7. Responsabilidad del usuario
                </Text>
                <Text style={[styles.termsModalParagraph, { color: colors.secondaryText }]}>
                  El usuario debe proteger sus credenciales y supervisar el uso de la cuenta. Las acciones realizadas desde su cuenta serán consideradas bajo su responsabilidad.
                </Text>

                <Text style={[styles.termsModalSection, { color: colors.text }]}>
                  8. Limitación de responsabilidad
                </Text>
                <Text style={[styles.termsModalParagraph, { color: colors.secondaryText }]}>
                  Los desarrolladores de G-PIM no se hacen responsables por errores derivados de información incorrecta, fallas de conectividad, servicios de terceros o uso inadecuado de la aplicación.
                </Text>
              </ScrollView>

              <TouchableOpacity
                style={styles.acceptTermsButton}
                onPress={() => {
                  setAcceptedTerms(true);
                  clearError('terms');
                  setTermsVisible(false);
                }}
              >
                <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
                <Text style={styles.acceptTermsButtonText}>Aceptar términos</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeTermsButton}
                onPress={() => setTermsVisible(false)}
              >
                <Text style={styles.closeTermsText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;