import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useInventory } from '../../hook/useInventory';

const PACIENTE_ID_DEMO = 'demo-paciente-001';

const AlertsScreen = ({ onBack, onGoInventory }) => {
  const { medicines, loading } = useInventory(PACIENTE_ID_DEMO);

  const getRemainingDays = (item) => {
    const currentStock = Number(item.currentStock || 0);
    const dailyDose = Number(item.dailyDose || 0);

    if (currentStock <= 0) return 0;
    if (dailyDose <= 0) return null;

    return Math.floor(currentStock / dailyDose);
  };

  const getAlertInfo = (item) => {
    const currentStock = Number(item.currentStock || 0);
    const minStock = Number(item.minStock || 0);
    const remainingDays = getRemainingDays(item);

    if (currentStock <= 0) {
      return {
        title: 'Sin stock',
        message: 'Este medicamento ya no tiene unidades disponibles.',
        color: '#E74C3C',
        background: '#FDECEC',
        icon: 'alert-circle',
        priority: 1,
      };
    }

    if (remainingDays !== null && remainingDays <= 2) {
      return {
        title: 'Se agota muy pronto',
        message: `Quedan ${remainingDays} días de stock.`,
        color: '#E74C3C',
        background: '#FDECEC',
        icon: 'alert-circle',
        priority: 2,
      };
    }

    if (currentStock <= minStock) {
      return {
        title: 'Stock crítico',
        message: 'El stock actual está igual o bajo el mínimo definido.',
        color: '#F39C12',
        background: '#FFF4E5',
        icon: 'warning',
        priority: 3,
      };
    }

    if (remainingDays !== null && remainingDays <= 5) {
      return {
        title: 'Reposición preventiva',
        message: `Quedan ${remainingDays} días de stock. Conviene reponer pronto.`,
        color: '#D68910',
        background: '#FFF8E1',
        icon: 'time-outline',
        priority: 4,
      };
    }

    return null;
  };

  const alertMedicines = useMemo(() => {
    return medicines
      .map((item) => ({
        ...item,
        alertInfo: getAlertInfo(item),
        remainingDays: getRemainingDays(item),
      }))
      .filter((item) => item.alertInfo !== null)
      .sort((a, b) => a.alertInfo.priority - b.alertInfo.priority);
  }, [medicines]);

  const criticalCount = alertMedicines.filter(
    (item) =>
      item.alertInfo.title === 'Sin stock' ||
      item.alertInfo.title === 'Se agota muy pronto'
  ).length;

  const renderItem = ({ item }) => {
    const info = item.alertInfo;

    return (
      <View style={[styles.alertCard, { backgroundColor: info.background }]}>
        <View style={[styles.iconBox, { borderColor: info.color }]}>
          <Ionicons name={info.icon} size={30} color={info.color} />
        </View>

        <View style={styles.alertContent}>
          <Text style={styles.medicineName}>{item.name}</Text>

          <Text style={[styles.alertTitle, { color: info.color }]}>
            {info.title}
          </Text>

          <Text style={styles.alertMessage}>{info.message}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.stockText}>
              Stock: {item.currentStock ?? 0}
            </Text>

            <Text style={styles.stockText}>
              Mínimo: {item.minStock ?? 0}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>

        <Text style={styles.logoText}>Alertas</Text>

        <View style={styles.bellBox}>
          <MaterialCommunityIcons
            name="bell-alert-outline"
            size={26}
            color="#E74C3C"
          />

          {alertMedicines.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{alertMedicines.length}</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.header}>Alertas de stock</Text>

      <Text style={styles.subtitle}>
        Medicamentos que requieren atención o reposición.
      </Text>

      {criticalCount > 0 && (
        <View style={styles.criticalBanner}>
          <Ionicons name="warning" size={22} color="#FFFFFF" />
          <Text style={styles.criticalBannerText}>
            Tienes {criticalCount} alerta(s) crítica(s) que requieren atención.
          </Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Revisando alertas...</Text>
        </View>
      ) : (
        <FlatList
          data={alertMedicines}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="checkmark-circle-outline"
                size={64}
                color="#27AE60"
              />
              <Text style={styles.emptyTitle}>Todo en orden</Text>
              <Text style={styles.emptyText}>
                No hay medicamentos con alertas por ahora.
              </Text>
            </View>
          }
        />
      )}

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={onGoInventory}>
          <Ionicons name="home-outline" size={24} color="#2D3436" />
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="alert-circle" size={24} color="#E74C3C" />
          <Text style={[styles.navText, { color: '#E74C3C' }]}>Alertas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="cart-outline" size={24} color="#F39C12" />
          <Text style={[styles.navText, { color: '#F39C12' }]}>Ofertas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#2D3436" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 20,
    paddingTop: 55,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2D3436',
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
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2D3436',
    marginTop: 28,
  },
  subtitle: {
    fontSize: 15,
    color: '#636E72',
    marginTop: 8,
    marginBottom: 16,
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
    fontSize: 14,
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
    fontSize: 18,
    fontWeight: '800',
    color: '#2D3436',
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  stockText: {
    fontSize: 13,
    color: '#4F5D75',
    fontWeight: '700',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 90,
  },
  loadingText: {
    marginTop: 10,
    color: '#636E72',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 90,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#27AE60',
    marginTop: 14,
  },
  emptyText: {
    fontSize: 15,
    color: '#636E72',
    textAlign: 'center',
    marginTop: 6,
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 75,
    backgroundColor: '#FFFFFF',
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
    fontSize: 11,
    fontWeight: '700',
    color: '#2D3436',
    marginTop: 3,
  },
});

export default AlertsScreen;