import {StyleSheet} from 'react-native';


export const styles = StyleSheet.create({
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