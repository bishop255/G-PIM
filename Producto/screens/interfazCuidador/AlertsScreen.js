import React, { useMemo, useEffect } from 'react';
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
import { getTheme } from '../../theme/theme';
import {
  scheduleStockNotification,
  cancelAllStockNotifications,
} from '../services/notificationService';
import { useInventory } from '../../hook/useInventory';


const AlertsScreen = ({ settings, onBack, onGoInventory, onGoOffers, onGoProfile, patientId }) => {
  const { medicines, loading } = useInventory(patientId);
  const { colors, fontSizes } = getTheme(settings);

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

  useEffect(() => {
    const scheduleAlerts = async () => {
      if (!alertMedicines.length) {
        await cancelAllStockNotifications();
        return;
      }

      await cancelAllStockNotifications();

      const criticalAlerts = alertMedicines.filter(
        (item) =>
          item.alertInfo.title === 'Sin stock' ||
          item.alertInfo.title === 'Se agota muy pronto' ||
          item.alertInfo.title === 'Stock crítico'
      );

      for (const item of criticalAlerts.slice(0, 3)) {
        await scheduleStockNotification({
          title: 'Alerta G-PIM',
          body: `${item.medicineName || item.name}: ${item.alertInfo.message}`,
          seconds: 5,
        });
      }
    };

    scheduleAlerts();
  }, [alertMedicines]);

  const renderItem = ({ item }) => {
    const info = item.alertInfo;

    return (
      <View style={[styles.alertCard, { backgroundColor: info.background }]}>
        <View style={[styles.iconBox, { borderColor: info.color }]}>
          <Ionicons name={info.icon} size={30} color={info.color} />
        </View>

        <View style={styles.alertContent}>
          <Text
            style={[
              styles.medicineName,
              { fontSize: fontSizes.normal + 4 },
            ]}
          >
            {item.name}
          </Text>

          <Text
            style={[
              styles.alertTitle,
              { color: info.color, fontSize: fontSizes.normal },
            ]}
          >
            {info.title}
          </Text>

          <Text
            style={[
              styles.alertMessage,
              { fontSize: fontSizes.normal },
            ]}
          >
            {info.message}
          </Text>

          <View style={styles.metaRow}>
            <Text style={[styles.stockText, { fontSize: fontSizes.small }]}>
              Stock: {item.currentStock ?? 0}
            </Text>

            <Text style={[styles.stockText, { fontSize: fontSizes.small }]}>
              Mínimo: {item.minStock ?? 0}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text
          style={[
            styles.logoText,
            { color: colors.text, fontSize: fontSizes.header },
          ]}
        >
          Alertas
        </Text>

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

      <Text
        style={[
          styles.header,
          { color: colors.text, fontSize: fontSizes.title },
        ]}
      >
        Alertas de stock
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: colors.secondaryText, fontSize: fontSizes.subtitle },
        ]}
      >
        Medicamentos que requieren atención o reposición.
      </Text>

      {criticalCount > 0 && (
        <View style={styles.criticalBanner}>
          <Ionicons name="warning" size={22} color="#FFFFFF" />
          <Text
            style={[
              styles.criticalBannerText,
              { fontSize: fontSizes.normal },
            ]}
          >
            Tienes {criticalCount} alerta(s) crítica(s) que requieren atención.
          </Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text
            style={[
              styles.loadingText,
              { color: colors.secondaryText, fontSize: fontSizes.normal },
            ]}
          >
            Revisando alertas...
          </Text>
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
              <Text
                style={[
                  styles.emptyTitle,
                  { fontSize: fontSizes.header + 2 },
                ]}
              >
                Todo en orden
              </Text>
              <Text
                style={[
                  styles.emptyText,
                  { color: colors.secondaryText, fontSize: fontSizes.normal },
                ]}
              >
                No hay medicamentos con alertas por ahora.
              </Text>
            </View>
          }
        />
      )}

      <View style={[styles.bottomNav, { backgroundColor: colors.card }]}>
        <TouchableOpacity style={styles.navItem} onPress={onGoInventory}>
          <Ionicons name="home-outline" size={24} color={colors.text} />
          <Text
            style={[
              styles.navText,
              { color: colors.text, fontSize: fontSizes.small },
            ]}
          >
            Inicio
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="alert-circle" size={24} color="#E74C3C" />
          <Text
            style={[
              styles.navText,
              { color: '#E74C3C', fontSize: fontSizes.small },
            ]}
          >
            Alertas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={onGoOffers}>
          <Ionicons name="cart-outline" size={24} color="#F39C12" />
          <Text
            style={[
              styles.navText,
              { color: '#F39C12', fontSize: fontSizes.small },
            ]}
          >
            Ofertas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={onGoProfile}>
          <Ionicons name="person-outline" size={24} color={colors.text} />
          <Text
            style={[
              styles.navText,
              { color: colors.text, fontSize: fontSizes.small },
            ]}
          >
            Perfil
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AlertsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 55,
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
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  stockText: {
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
    height: 75,
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