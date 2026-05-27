import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoText: {
        fontWeight: '800',
    },
    bellBox: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -8,
        right: -8,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#E74C3C',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '800',
    },
    header: {
        fontWeight: 'bold',
        marginTop: 28,
    },
    subtitle: {
        marginTop: 8,
        marginBottom: 16,
    },
    markReadButton: {
        backgroundColor: '#42B65A',
        borderRadius: 16,
        paddingVertical: 13,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },
    markReadText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '900',
        marginLeft: 8,
    },
    criticalBanner: {
        backgroundColor: '#E74C3C',
        borderRadius: 16,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    criticalBannerText: {
        color: '#FFFFFF',
        fontWeight: '800',
        marginLeft: 10,
        flex: 1,
    },
    listContent: {
        paddingBottom: 100,
    },
    alertCard: {
        borderRadius: 20,
        padding: 16,
        marginBottom: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 60,
        height: 60,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    alertContent: {
        flex: 1,
    },
    medicineName: {
        fontWeight: '800',
        color: '#2D3436',
    },
    alertTitle: {
        fontWeight: '800',
        marginTop: 4,
    },
    alertMessage: {
        color: '#636E72',
        marginTop: 4,
    },
    stockText: {
        color: '#4F5D75',
        fontWeight: '700',
        marginTop: 6,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 90,
    },
    loadingText: {
        marginTop: 10,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 90,
    },
    emptyTitle: {
        fontWeight: '800',
        color: '#27AE60',
        marginTop: 14,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 6,
    },
    bottomNav: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        elevation: 12,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    navText: {
        fontWeight: '700',
        marginTop: 3,
    },
    });