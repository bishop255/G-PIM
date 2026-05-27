import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTheme } from '../../theme/theme';
import {styles} from '../../styles/Auth/LoginScreen.styles';
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
