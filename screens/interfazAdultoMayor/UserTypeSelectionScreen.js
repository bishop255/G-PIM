import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    StatusBar,
    Alert,
    BackHandler
} from 'react-native';

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
                    source={require('../../assets/logo.png')}
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
                        source={require('../../assets/familia-adoptiva.png')}
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
                        source={require('../../assets/paciente.png')}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2',
        alignItems: 'center',
        paddingTop: 80,
    },

    logoContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        padding: 25,
        elevation: 4,
    },

    logo: {
        width: 160,
        height: 160,
    },

    title: {
        fontSize: 34,
        fontWeight: 'bold',
        marginTop: 25,
        color: '#000',
    },

    subtitle: {
        fontSize: 18,
        color: '#555',
        marginBottom: 20,
    },

    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
        paddingHorizontal: 20,
        gap: 20,
    },

    optionCard: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 45,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
        width: '42%',
        elevation: 6,
    },

    iconImage: {
        width: 90,
        height: 90,
        resizeMode: 'contain',
        marginBottom: 10,
    },

    optionText: {
        marginTop: 18,
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
    },

    closeButton: {
        position: 'absolute',
        bottom: 80,
        backgroundColor: '#FF3B30',
        paddingVertical: 22,
        borderRadius: 35,
        width: '85%',
        alignItems: 'center',
        elevation: 6,
    },

    closeText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
});