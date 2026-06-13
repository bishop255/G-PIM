import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTheme } from '../../theme/theme';

    // Pantalla de términos y condiciones previa al registro
    const TermsAndConditionsScreen = ({ settings, onAccept, onBack }) => {
    const { colors, fontSizes } = getTheme(settings);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Cabecera */}
        <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>

            <Text
            style={[
                styles.headerTitle,
                { color: colors.text, fontSize: fontSizes.title },
            ]}
            >
            Términos y Condiciones
            </Text>

            <View style={{ width: 24 }} />
        </View>

        {/* Contenido desplazable */}
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
            <View
            style={[
                styles.card,
                {
                backgroundColor: colors.card,
                borderColor: colors.border,
                },
            ]}
            >
            <Text
                style={[
                styles.mainTitle,
                { color: colors.text, fontSize: fontSizes.header },
                ]}
            >
                TÉRMINOS Y CONDICIONES DE USO
            </Text>

            <Text
                style={[
                styles.introText,
                { color: colors.text, fontSize: fontSizes.normal },
                ]}
            >
                Bienvenido a G-PIM. Antes de crear una cuenta, te pedimos leer
                atentamente los siguientes términos y condiciones, ya que regulan el
                uso de la aplicación y sus funcionalidades.
            </Text>

            <Text
                style={[
                styles.sectionTitle,
                { color: colors.text, fontSize: fontSizes.normal + 1 },
                ]}
            >
                1. Finalidad de la aplicación
            </Text>
            <Text
                style={[
                styles.paragraph,
                { color: colors.text, fontSize: fontSizes.normal },
                ]}
            >
                G-PIM es una aplicación diseñada para apoyar la gestión, control y
                seguimiento de medicamentos e insumos médicos, facilitando la
                organización del tratamiento de los pacientes y el monitoreo por
                parte de sus cuidadores o familiares.
            </Text>

            <Text
                style={[
                styles.sectionTitle,
                { color: colors.text, fontSize: fontSizes.normal + 1 },
                ]}
            >
                2. Uso responsable
            </Text>
            <Text
                style={[
                styles.paragraph,
                { color: colors.text, fontSize: fontSizes.normal },
                ]}
            >
                El usuario se compromete a utilizar la aplicación de manera
                responsable, ética y únicamente para los fines previstos por la
                plataforma. Queda prohibido el uso indebido de la aplicación, así
                como el ingreso de información falsa, incompleta o engañosa.
            </Text>

            <Text
                style={[
                styles.sectionTitle,
                { color: colors.text, fontSize: fontSizes.normal + 1 },
                ]}
            >
                3. Información registrada
            </Text>
            <Text
                style={[
                styles.paragraph,
                { color: colors.text, fontSize: fontSizes.normal },
                ]}
            >
                El usuario es responsable de la veracidad y actualización de los
                datos ingresados en la aplicación, tanto los propios como los
                asociados al paciente vinculado. Esto incluye información personal,
                medicamentos, dosis, alertas, inventario y demás datos necesarios
                para el correcto funcionamiento del sistema.
            </Text>

            <Text
                style={[
                styles.sectionTitle,
                { color: colors.text, fontSize: fontSizes.normal + 1 },
                ]}
            >
                4. Alcance de la aplicación
            </Text>
            <Text
                style={[
                styles.paragraph,
                { color: colors.text, fontSize: fontSizes.normal },
                ]}
            >
                G-PIM constituye una herramienta de apoyo para el seguimiento de
                tratamientos médicos, control de stock y gestión de recordatorios.
                Sin embargo, no reemplaza la evaluación, supervisión ni las
                indicaciones de un profesional de la salud. Toda decisión médica
                debe ser consultada con el especialista correspondiente.
            </Text>

            <Text
                style={[
                styles.sectionTitle,
                { color: colors.text, fontSize: fontSizes.normal + 1 },
                ]}
            >
                5. Notificaciones y alertas
            </Text>
            <Text
                style={[
                styles.paragraph,
                { color: colors.text, fontSize: fontSizes.normal },
                ]}
            >
                La aplicación puede generar recordatorios, alertas y notificaciones
                relacionadas con el tratamiento, el inventario o situaciones de
                emergencia. El usuario entiende que estas funciones dependen del
                correcto uso de la plataforma, de la información ingresada y de la
                disponibilidad técnica del dispositivo y sus servicios asociados.
            </Text>

            <Text
                style={[
                styles.sectionTitle,
                { color: colors.text, fontSize: fontSizes.normal + 1 },
                ]}
            >
                6. Privacidad y almacenamiento de datos
            </Text>
            <Text
                style={[
                styles.paragraph,
                { color: colors.text, fontSize: fontSizes.normal },
                ]}
            >
                Para brindar sus funcionalidades, G-PIM puede almacenar información
                relacionada con usuarios, pacientes, medicamentos, alertas e
                historial de movimientos. Estos datos son utilizados exclusivamente
                para el funcionamiento de la plataforma y para mejorar la
                experiencia de uso dentro del sistema.
            </Text>

            <Text
                style={[
                styles.sectionTitle,
                { color: colors.text, fontSize: fontSizes.normal + 1 },
                ]}
            >
                7. Responsabilidad del usuario
            </Text>
            <Text
                style={[
                styles.paragraph,
                { color: colors.text, fontSize: fontSizes.normal },
                ]}
            >
                El usuario acepta que es responsable de mantener la confidencialidad
                de su cuenta, proteger sus credenciales de acceso y supervisar el
                uso que se haga desde su dispositivo. Cualquier acción realizada
                desde la cuenta será considerada bajo su responsabilidad.
            </Text>

            <Text
                style={[
                styles.sectionTitle,
                { color: colors.text, fontSize: fontSizes.normal + 1 },
                ]}
            >
                8. Limitación de responsabilidad
            </Text>
            <Text
                style={[
                styles.paragraph,
                { color: colors.text, fontSize: fontSizes.normal },
                ]}
            >
                Los desarrolladores de G-PIM no se hacen responsables por errores
                derivados de información incorrecta ingresada por el usuario, fallas
                de conectividad, problemas externos de servicios de terceros o un
                uso inadecuado de la aplicación.
            </Text>

            <Text
                style={[
                styles.sectionTitle,
                { color: colors.text, fontSize: fontSizes.normal + 1 },
                ]}
            >
                9. Aceptación de los términos
            </Text>
            <Text
                style={[
                styles.paragraph,
                { color: colors.text, fontSize: fontSizes.normal },
                ]}
            >
                Al seleccionar la opción “Aceptar y continuar”, el usuario declara
                haber leído, comprendido y aceptado íntegramente estos Términos y
                Condiciones, comprometiéndose a respetarlos durante el uso de la
                aplicación.
            </Text>

            <Text
                style={[
                styles.finalWarning,
                { color: colors.text, fontSize: fontSizes.normal },
                ]}
            >
                Si no estás de acuerdo con alguno de estos términos, no debes
                continuar con el proceso de registro.
            </Text>
            </View>

            {/* Botón aceptar */}
            <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
            <Text style={styles.acceptButtonText}>Aceptar y continuar</Text>
            </TouchableOpacity>

            {/* Botón cancelar */}
            <TouchableOpacity style={styles.cancelButton} onPress={onBack}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
        </ScrollView>
        </View>
    );
    };

    export default TermsAndConditionsScreen;

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 22,
        paddingTop: 55,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 22,
    },
    backButton: {
        width: 42,
        height: 42,
        justifyContent: 'center',
    },
    headerTitle: {
        fontWeight: '900',
        textAlign: 'center',
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    card: {
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        marginBottom: 24,
    },
    mainTitle: {
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 18,
    },
    introText: {
        marginBottom: 18,
        lineHeight: 22,
        textAlign: 'justify',
    },
    sectionTitle: {
        fontWeight: '800',
        marginTop: 10,
        marginBottom: 8,
    },
    paragraph: {
        marginBottom: 14,
        lineHeight: 22,
        textAlign: 'justify',
    },
    finalWarning: {
        marginTop: 10,
        lineHeight: 22,
        textAlign: 'justify',
        fontWeight: '700',
    },
    acceptButton: {
        backgroundColor: '#42B65A',
        borderRadius: 16,
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 14,
    },
    acceptButtonText: {
        color: '#FFFFFF',
        fontWeight: '900',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: '#E74C3C',
        borderRadius: 16,
        paddingVertical: 15,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#FFFFFF',
        fontWeight: '900',
        fontSize: 16,
    },
    });