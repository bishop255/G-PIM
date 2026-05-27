import {StyleSheet} from 'react-native';


export const styles = StyleSheet.create({
    scroll: {
        flexGrow: 1,
        backgroundColor: '#F7F7F7',
    },

    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 55,
        paddingBottom: 40,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },

    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#2D3436',
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 22,
        elevation: 3,
    },

    iconContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },

    title: {
        fontSize: 26,
        fontWeight: '900',
        color: '#2D3436',
        textAlign: 'center',
    },

    subtitle: {
        fontSize: 14,
        color: '#636E72',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 25,
    },

    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2D3436',
        marginBottom: 8,
        marginTop: 10,
    },

    input: {
        backgroundColor: '#F1F2F6',
        borderRadius: 16,
        paddingHorizontal: 15,
        paddingVertical: 14,
        fontSize: 15,
        color: '#2D3436',
    },

    dateButton: {
        backgroundColor: '#F1F2F6',
        borderRadius: 16,
        paddingHorizontal: 15,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    dateText: {
        fontSize: 15,
        color: '#2D3436',
        fontWeight: '700',
    },

    placeholderText: {
        color: '#95A5A6',
        fontWeight: '500',
    },

    bloodContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
    },

    bloodButton: {
        backgroundColor: '#F1F2F6',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 14,
        marginRight: 8,
        marginBottom: 8,
    },

    bloodButtonSelected: {
        backgroundColor: '#42B65A',
    },

    bloodText: {
        color: '#2D3436',
        fontWeight: '800',
        fontSize: 14,
    },

    bloodTextSelected: {
        color: '#FFFFFF',
    },

    relationshipBox: {
        backgroundColor: '#EAF8EE',
        borderRadius: 16,
        paddingHorizontal: 15,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },

    relationshipText: {
        marginLeft: 10,
        color: '#27AE60',
        fontSize: 15,
        fontWeight: '800',
    },

    multiline: {
        minHeight: 90,
        textAlignVertical: 'top',
    },

    button: {
        marginTop: 28,
        backgroundColor: '#42B65A',
        borderRadius: 18,
        paddingVertical: 16,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        elevation: 3,
    },

    buttonDisabled: {
        opacity: 0.6,
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
        marginLeft: 8,
    },
});