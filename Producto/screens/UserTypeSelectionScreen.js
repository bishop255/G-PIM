import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StatusBar,
    Alert,
    BackHandler
} from 'react-native';

import { styles } from '../styles/UserTypeSelectionScreen.styles';

const UserTypeSelectionScreen = ({ onSelect }) => {

    const handleCloseApp = () => {
        Alert.alert(
            "Cerrar aplicación",
            "¿Estás seguro que deseas cerrar la app?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sí, cerrar", onPress: () => BackHandler.exitApp() },
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F2F2F2" />

            {/* LOGO */}
            <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <Text style={styles.title}>G-PIM</Text>
            <Text style={styles.subtitle}>Seleccione la interfaz</Text>

            <View style={styles.optionsContainer}>

                {/* FAMILIAR */}
                <TouchableOpacity
                    style={styles.optionCard}
                    onPress={() => onSelect('admin')}
                >
                    <Image
                        source={require('../assets/familia-adoptiva.png')}
                        style={styles.iconImage}
                    />
                    <Text style={styles.optionText}>Familiar</Text>
                </TouchableOpacity>

                {/* PACIENTE */}
                <TouchableOpacity
                    style={styles.optionCard}
                    onPress={() => onSelect('patient')}
                >
                    <Image
                        source={require('../assets/paciente.png')}
                        style={styles.iconImage}
                    />
                    <Text style={styles.optionText}>Paciente</Text>
                </TouchableOpacity>

            </View>

            <TouchableOpacity 
                style={styles.closeButton} 
                onPress={handleCloseApp}
            >
                <Text style={styles.closeText}>Cerrar</Text>
            </TouchableOpacity>
        </View>
    );
};

export default UserTypeSelectionScreen;

