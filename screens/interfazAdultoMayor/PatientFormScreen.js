import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert
} from 'react-native';

import { db } from '../../database/firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const PatientFormScreen = ({ onSaved, onCancel }) => {

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [grupo, setGrupo] = useState('');
    const [parentesco, setParentesco] = useState('');
    const [telefono, setTelefono] = useState('');
    const [alergias, setAlergias] = useState('');

    const calcularEdad = (fecha) => {
        const hoy = new Date();
        const nacimiento = new Date(fecha);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const m = hoy.getMonth() - nacimiento.getMonth();

        if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }

        return edad;
    };

    const handleSave = async () => {

        if (!nombre || !apellido || !fechaNacimiento) {
            Alert.alert("Error", "Completa los campos obligatorios");
            return;
        }

        const edad = calcularEdad(fechaNacimiento);

        try {
            await addDoc(collection(db, "pacientes"), {
                nombre,
                apellido,
                fechaNacimiento,
                edad,
                grupo,
                parentesco,
                telefono,
                alergias,
                createdAt: new Date()
            });

            Alert.alert("Éxito", "Paciente guardado");
            onSaved();

        } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudo guardar");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Datos del Paciente</Text>

            <TextInput placeholder="Nombre" style={styles.input} onChangeText={setNombre}/>
            <TextInput placeholder="Apellido" style={styles.input} onChangeText={setApellido}/>
            
            <TextInput 
                placeholder="Fecha de nacimiento (YYYY-MM-DD)" 
                style={styles.input} 
                onChangeText={setFechaNacimiento}
            />

            <TextInput placeholder="Grupo sanguíneo" style={styles.input} onChangeText={setGrupo}/>
            <TextInput placeholder="Parentesco" style={styles.input} onChangeText={setParentesco}/>
            <TextInput placeholder="Teléfono de emergencia" style={styles.input} onChangeText={setTelefono}/>
            <TextInput placeholder="Alergias" style={styles.input} onChangeText={setAlergias}/>

            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Guardar y continuar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onCancel}>
                <Text style={{marginTop:15}}>Cancelar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default PatientFormScreen;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
    },

    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
    },

    input: {
        width: '100%',
        backgroundColor: '#EEE',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },

    button: {
        backgroundColor: '#0984E3',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },

    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});