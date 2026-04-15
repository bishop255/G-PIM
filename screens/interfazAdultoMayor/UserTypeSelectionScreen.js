import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UserTypeSelectionScreen = ({ onSelect }) => {
    const handleSelect = (type) => {
        console.log('Tipo seleccionado:', type);
        onSelect(type);
    };

    return (
        <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F2F2F2" />

        <View style={styles.logoContainer}>
            <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
            />
        </View>

        <Text style={styles.title}>G-PIM</Text>
        <Text style={styles.subtitle}>Seleccione la interfaz</Text>

        <View style={styles.optionsContainer}>
            <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleSelect('admin')}
            >
            <Ionicons name="people-outline" size={40} color="#0984E3" />
            <Text style={styles.optionText}>Familiar</Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleSelect('patient')}
            >
            <Ionicons name="accessibility-outline" size={40} color="#6C5CE7" />
            <Text style={styles.optionText}>Adulto mayor</Text>
            </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.closeButton}>
            <Text style={styles.closeText}>Cerrar</Text>
        </TouchableOpacity>
        </View>
    );
};

export default UserTypeSelectionScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2',
        alignItems: 'center',
        paddingTop: 60,
    },

    logoContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        elevation: 3,
    },

    logo: {
        width: 120,
        height: 120,
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#000',
    },

    subtitle: {
        fontSize: 16,
        color: '#555',
        marginBottom: 30,
    },

    optionsContainer: {
        flexDirection: 'row',
        gap: 20,
    },

    optionCard: {
        backgroundColor: '#EAEAEA',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        width: 140,
    },

    optionText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '600',
    },

    closeButton: {
        position: 'absolute',
        bottom: 40,
        backgroundColor: '#FF3B30',
        paddingVertical: 15,
        paddingHorizontal: 80,
        borderRadius: 25,
    },

    closeText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});