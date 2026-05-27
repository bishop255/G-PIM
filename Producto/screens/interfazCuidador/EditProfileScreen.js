import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

import {styles} from '../../styles/interfazCuidador/EditProfileScreen.styles';
import { auth, db } from '../../database/firebaseConfig';
import { getTheme } from '../../theme/theme';

// Lista de grupos sanguíneos disponibles
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const EditProfileScreen = ({ settings, patientId, onBack, onSaved }) => {
  const { colors, fontSizes } = getTheme(settings);

  // Estados del cuidador
  const [caregiverName, setCaregiverName] = useState('');
  const [caregiverEmail, setCaregiverEmail] = useState('');
  const [caregiverPhone, setCaregiverPhone] = useState('');
  const [caregiverRelationship, setCaregiverRelationship] = useState('');

  // Estados del paciente
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [grupo, setGrupo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [alergias, setAlergias] = useState('');

  // Estados generales de carga y guardado
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Cargar datos actuales del cuidador y del paciente
  useEffect(() => {
    const loadData = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          Alert.alert('Error', 'No hay usuario autenticado.');
          setLoading(false);
          return;
        }

        // Cargar datos del cuidador
        const caregiverRef = doc(db, 'usuarios', user.uid);
        const caregiverSnap = await getDoc(caregiverRef);

        if (caregiverSnap.exists()) {
          const caregiverData = caregiverSnap.data();

          setCaregiverName(caregiverData.name || '');
          setCaregiverEmail(caregiverData.email || '');
          setCaregiverPhone(caregiverData.phone || '');
          setCaregiverRelationship(caregiverData.relationship || '');
        }

        // Cargar datos del paciente vinculado
        if (patientId) {
          const patientRef = doc(db, 'pacientes', patientId);
          const patientSnap = await getDoc(patientRef);

          if (patientSnap.exists()) {
            const patientData = patientSnap.data();

            setNombre(patientData.nombre || '');
            setApellido(patientData.apellido || '');
            setGrupo(patientData.grupo || '');
            setTelefono(patientData.telefono || '');
            setAlergias(patientData.alergias || '');

            if (patientData.fechaNacimiento) {
              setFechaNacimiento(new Date(patientData.fechaNacimiento));
            }
          }
        }
      } catch (error) {
        console.error('Error cargando datos para edición:', error);
        Alert.alert('Error', 'No se pudo cargar la información.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [patientId]);

  // Formatear fecha como YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  // Calcular edad a partir de fecha de nacimiento
  const calcularEdad = (date) => {
    const hoy = new Date();
    const nacimiento = new Date(date);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad;
  };

  // Manejar selección de fecha
  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setFechaNacimiento(selectedDate);
    }
  };

  // Guardar cambios en Firebase
  const handleSave = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Error', 'No hay usuario autenticado.');
      return;
    }

    // Validación de campos del cuidador
    if (
      !caregiverName.trim() ||
      !caregiverPhone.trim() ||
      !caregiverRelationship.trim()
    ) {
      Alert.alert(
        'Campos incompletos',
        'Completa todos los campos del cuidador.'
      );
      return;
    }

    // Validación de campos del paciente
    if (
      !nombre.trim() ||
      !apellido.trim() ||
      !fechaNacimiento ||
      !grupo
    ) {
      Alert.alert(
        'Campos incompletos',
        'Completa nombre, apellido, fecha de nacimiento y grupo sanguíneo del paciente.'
      );
      return;
    }

    try {
      setSaving(true);

      // Actualizar datos del cuidador
      const caregiverRef = doc(db, 'usuarios', user.uid);
      await updateDoc(caregiverRef, {
        name: caregiverName.trim(),
        phone: caregiverPhone.trim(),
        relationship: caregiverRelationship.trim(),
        updatedAt: serverTimestamp(),
      });

      // Actualizar datos del paciente
      if (patientId) {
        const patientRef = doc(db, 'pacientes', patientId);

        await updateDoc(patientRef, {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          fechaNacimiento: formatDate(fechaNacimiento),
          edad: calcularEdad(fechaNacimiento),
          grupo,
          telefono: telefono.trim(),
          alergias: alergias.trim(),
          parentesco: caregiverRelationship.trim(),
          updatedAt: serverTimestamp(),
        });
      }

      Alert.alert('Éxito', 'Perfil actualizado correctamente.');

      if (onSaved) {
        onSaved();
      }
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil.');
    } finally {
      setSaving(false);
    }
  };

  // Estado de carga inicial
  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          styles.centerContent,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color="#42B65A" />
        <Text
          style={[
            styles.loadingText,
            { color: colors.secondaryText, fontSize: fontSizes.normal },
          ]}
        >
          Cargando datos...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cabecera */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              { color: colors.text, fontSize: fontSizes.title },
            ]}
          >
            Editar Perfil
          </Text>

          <View style={{ width: 24 }} />
        </View>

        {/* Sección del cuidador */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text, fontSize: fontSizes.header - 2 },
            ]}
          >
            Datos del cuidador
          </Text>

          <Text style={[styles.label, { color: colors.text }]}>Nombre</Text>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Nombre del cuidador"
            placeholderTextColor={colors.secondaryText}
            value={caregiverName}
            onChangeText={setCaregiverName}
          />

          <Text style={[styles.label, { color: colors.text }]}>Correo</Text>
          <TextInput
            style={[
                styles.input,
                styles.disabledInput,
                { color: colors.secondaryText },
            ]}
            placeholder="Correo electrónico"
            placeholderTextColor={colors.secondaryText}
            value={caregiverEmail}
            editable={false}
            selectTextOnFocus={false}
          />

          <Text style={[styles.label, { color: colors.text }]}>Teléfono</Text>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Teléfono"
            placeholderTextColor={colors.secondaryText}
            value={caregiverPhone}
            onChangeText={setCaregiverPhone}
            keyboardType="phone-pad"
          />

          <Text style={[styles.label, { color: colors.text }]}>
            Vínculo con el paciente
          </Text>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Ej: Hija, hijo, esposa..."
            placeholderTextColor={colors.secondaryText}
            value={caregiverRelationship}
            onChangeText={setCaregiverRelationship}
          />
        </View>

        {/* Sección del paciente */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text, fontSize: fontSizes.header - 2 },
            ]}
          >
            Datos del paciente
          </Text>

          <Text style={[styles.label, { color: colors.text }]}>Nombre</Text>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Nombre del paciente"
            placeholderTextColor={colors.secondaryText}
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={[styles.label, { color: colors.text }]}>Apellido</Text>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Apellido del paciente"
            placeholderTextColor={colors.secondaryText}
            value={apellido}
            onChangeText={setApellido}
          />

          <Text style={[styles.label, { color: colors.text }]}>
            Fecha de nacimiento
          </Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text
              style={[
                styles.dateText,
                { color: fechaNacimiento ? '#2D3436' : '#95A5A6' },
              ]}
            >
              {fechaNacimiento ? formatDate(fechaNacimiento) : 'Seleccionar fecha'}
            </Text>

            <Ionicons name="calendar-outline" size={22} color="#42B65A" />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={fechaNacimiento || new Date(1950, 0, 1)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              onChange={handleDateChange}
            />
          )}

          <Text style={[styles.label, { color: colors.text }]}>
            Grupo sanguíneo
          </Text>
          <View style={styles.bloodContainer}>
            {bloodTypes.map((item) => {
              const selected = item === grupo;

              return (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.bloodButton,
                    selected && styles.bloodButtonSelected,
                  ]}
                  onPress={() => setGrupo(item)}
                >
                  <Text
                    style={[
                      styles.bloodText,
                      selected && styles.bloodTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.label, { color: colors.text }]}>
            Teléfono de emergencia
          </Text>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Teléfono de emergencia"
            placeholderTextColor={colors.secondaryText}
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />

          <Text style={[styles.label, { color: colors.text }]}>Alergias</Text>
          <TextInput
            style={[styles.input, styles.multiline, { color: colors.text }]}
            placeholder="Alergias del paciente"
            placeholderTextColor={colors.secondaryText}
            value={alergias}
            onChangeText={setAlergias}
            multiline
          />
        </View>

        {/* Botón guardar */}
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Ionicons name="save-outline" size={22} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
