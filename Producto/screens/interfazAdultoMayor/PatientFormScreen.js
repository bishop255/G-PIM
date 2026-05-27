import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    Platform,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import {styles} from '../../styles/interfazAdultoMayor/PatientFormScreen.styles';
import { db, auth } from '../../database/firebaseConfig';

import {
    collection,
    addDoc,
    doc,
    updateDoc,
    getDoc,
    serverTimestamp,
} from 'firebase/firestore';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const generateLinkCode = () => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `GPIM-${random}`;
};

const PatientFormScreen = ({ onSaved, onCancel }) => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [grupo, setGrupo] = useState('');
    const [parentesco, setParentesco] = useState('Cargando...');
    const [telefono, setTelefono] = useState('');
    const [alergias, setAlergias] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadUserRelationship = async () => {
            try {
                const user = auth.currentUser;

                if (!user) {
                    setParentesco('No definido');
                    return;
                }

                const userRef = doc(db, 'usuarios', user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    setParentesco(userData.relationship || 'No definido');
                } else {
                    setParentesco('No definido');
                }
            } catch (error) {
                console.log('Error obteniendo parentesco:', error);
                setParentesco('No definido');
            }
        };

        loadUserRelationship();
    }, []);

    const formatDate = (date) => {
        if (!date) return '';

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

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

    const handleDateChange = (event, selectedDate) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }

        if (selectedDate) {
            setFechaNacimiento(selectedDate);
        }
    };

    const handleSave = async () => {
        if (!nombre.trim() || !apellido.trim() || !fechaNacimiento) {
            Alert.alert(
                'Campos obligatorios',
                'Completa nombre, apellido y fecha de nacimiento.'
            );
            return;
        }

        if (!grupo) {
            Alert.alert(
                'Grupo sanguíneo requerido',
                'Selecciona el grupo sanguíneo del paciente.'
            );
            return;
        }

        const user = auth.currentUser;

        if (!user) {
            Alert.alert('Error', 'No hay usuario autenticado');
            return;
        }

        const edad = calcularEdad(fechaNacimiento);
        const fechaNacimientoTexto = formatDate(fechaNacimiento);
        const codigoVinculacion = generateLinkCode();

        try {
            setSaving(true);

            const patientRef = await addDoc(collection(db, 'pacientes'), {
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                fechaNacimiento: fechaNacimientoTexto,
                edad,
                grupo,
                parentesco,
                telefono: telefono.trim(),
                alergias: alergias.trim(),

                cuidadorId: user.uid,
                cuidadores: [user.uid],
                codigoVinculacion,

                createdAt: serverTimestamp(),
            });

            await updateDoc(doc(db, 'usuarios', user.uid), {
                hasPatient: true,
                patientId: patientRef.id,
                patientIds: [patientRef.id],
            });

            Alert.alert(
                'Paciente registrado',
                'Los datos fueron guardados correctamente.'
            );

            onSaved(patientRef.id);
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'No se pudo guardar el paciente');
        } finally {
            setSaving(false);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.container}>
                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onCancel}>
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color="#2D3436"
                        />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Datos del Paciente
                    </Text>

                    <View style={{ width: 24 }} />
                </View>

                {/* CARD */}
                <View style={styles.card}>
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name="person-circle"
                            size={90}
                            color="#42B65A"
                        />
                    </View>

                    <Text style={styles.title}>
                        Registro del paciente
                    </Text>

                    <Text style={styles.subtitle}>
                        Completa la información médica básica.
                    </Text>

                    {/* NOMBRE */}
                    <Text style={styles.label}>Nombre</Text>

                    <TextInput
                        placeholder="Ingrese el nombre"
                        placeholderTextColor="#95A5A6"
                        style={styles.input}
                        value={nombre}
                        onChangeText={setNombre}
                    />

                    {/* APELLIDO */}
                    <Text style={styles.label}>Apellido</Text>

                    <TextInput
                        placeholder="Ingrese el apellido"
                        placeholderTextColor="#95A5A6"
                        style={styles.input}
                        value={apellido}
                        onChangeText={setApellido}
                    />

                    {/* FECHA */}
                    <Text style={styles.label}>
                        Fecha de nacimiento
                    </Text>

                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text
                            style={[
                                styles.dateText,
                                !fechaNacimiento && styles.placeholderText,
                            ]}
                        >
                            {fechaNacimiento
                                ? formatDate(fechaNacimiento)
                                : 'Seleccionar fecha'}
                        </Text>

                        <Ionicons
                            name="calendar-outline"
                            size={22}
                            color="#42B65A"
                        />
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

                    {/* GRUPO SANGUÍNEO */}
                    <Text style={styles.label}>Grupo sanguíneo</Text>

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

                    {/* PARENTESCO AUTOMÁTICO */}
                    <Text style={styles.label}>
                        Relación con el paciente
                    </Text>

                    <View style={styles.relationshipBox}>
                        <Ionicons
                            name="people-outline"
                            size={22}
                            color="#42B65A"
                        />

                        <Text style={styles.relationshipText}>
                            {parentesco}
                        </Text>
                    </View>

                    {/* TELÉFONO */}
                    <Text style={styles.label}>
                        Teléfono de emergencia
                    </Text>

                    <TextInput
                        placeholder="Ingrese teléfono"
                        placeholderTextColor="#95A5A6"
                        style={styles.input}
                        keyboardType="phone-pad"
                        value={telefono}
                        onChangeText={setTelefono}
                    />

                    {/* ALERGIAS */}
                    <Text style={styles.label}>Alergias</Text>

                    <TextInput
                        placeholder="Ej: Penicilina, mariscos, ibuprofeno..."
                        placeholderTextColor="#95A5A6"
                        style={[styles.input, styles.multiline]}
                        multiline
                        value={alergias}
                        onChangeText={setAlergias}
                    />

                    {/* BOTÓN */}
                    <TouchableOpacity
                        style={[
                            styles.button,
                            saving && styles.buttonDisabled,
                        ]}
                        onPress={handleSave}
                        disabled={saving}
                    >
                        <Ionicons
                            name="checkmark-circle"
                            size={22}
                            color="#FFF"
                        />

                        <Text style={styles.buttonText}>
                            {saving ? 'Guardando...' : 'Guardar y continuar'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default PatientFormScreen;

