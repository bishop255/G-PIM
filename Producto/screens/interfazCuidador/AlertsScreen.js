import React, { useMemo, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { getTheme } from '../../theme/theme';
import { useInventory } from '../../hook/useInventory';
import { auth, db } from '../../database/firebaseConfig';
import { styles } from '../../styles/interfazCuidador/AlertsScreen.styles';

const AlertsScreen = ({
  settings,
  onBack,
  onGoInventory,
  onGoOffers,
  onGoProfile,
  patientId,
}) => {
  const insets = useSafeAreaInsets();

  const { medicines, loading } = useInventory(patientId);
  const { colors, fontSizes } = getTheme(settings);

  const [caregiverAlerts, setCaregiverAlerts] = useState([]);
  const [markingRead, setMarkingRead] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const alertsRef = collection(db, 'usuarios', user.uid, 'alertas');

    const alertsQuery = query(
      alertsRef,
      orderBy('createdAt', 'desc'),
      limit(30)
    );

    const unsubscribe = onSnapshot(
      alertsQuery,
      (snapshot) => {
        const list = snapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }));

        setCaregiverAlerts(list.filter((item) => item.read !== true));
      },
      (error) => {
        console.error('Error obteniendo alertas del cuidador:', error);
      }
    );

    return unsubscribe;
  }, []);

  const getRemainingDays = (item) => {
    const currentStock = Number(item.currentStock || 0);
    const dailyDose = Number(item.dailyDose || 0);
    const doseAmount = Number(item.doseAmount || 1);

    const dailyConsumption = dailyDose * doseAmount;

    if (currentStock <= 0) return 0;
    if (dailyConsumption <= 0) return null;

    return Math.floor(currentStock / dailyConsumption);
  };

  const getStockUnit = (item) => item.stockUnit || 'unidad';

  const formatDateTime = (timestamp) => {
    if (!timestamp?.toDate) return 'recién';

    return timestamp.toDate().toLocaleString('es-CL', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAlertInfo = (item) => {
    const currentStock = Number(item.currentStock || 0);
    const minStock = Number(item.minStock || 0);
    const remainingDays = getRemainingDays(item);

    if (currentStock <= 0) {
      return {
        title: 'Sin stock',
        message: `Este medicamento ya no tiene ${getStockUnit(item)} disponibles.`,
        color: '#E74C3C',
        background: '#FDECEC',
        icon: 'alert-circle',
        priority: 1,
      };
    }

    if (remainingDays !== null && remainingDays <= 2) {
      return {
        title: 'Se agota muy pronto',
        message: `Quedan ${remainingDays} día(s) de stock.`,
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
        message: `Quedan ${remainingDays} día(s) de stock. Conviene reponer pronto.`,
        color: '#D68910',
        background: '#FFF8E1',
        icon: 'time-outline',
        priority: 4,
      };
    }

    return null;
  };

  const stockAlerts = useMemo(() => {
    return medicines
      .map((item) => ({
        ...item,
        alertInfo: getAlertInfo(item),
        remainingDays: getRemainingDays(item),
      }))
      .filter((item) => item.alertInfo !== null)
      .map((item) => ({
        id: `stock-${item.id}`,
        type: 'stock',
        medicineName: item.name,
        title: item.alertInfo.title,
        message: item.alertInfo.message,
        detail: `Stock: ${item.currentStock ?? 0} ${getStockUnit(
          item
        )} · Mínimo: ${item.minStock ?? 0} ${getStockUnit(item)}`,
        color: item.alertInfo.color,
        background: item.alertInfo.background,
        icon: item.alertInfo.icon,
        priority: item.alertInfo.priority,
      }))
      .sort((a, b) => a.priority - b.priority);
  }, [medicines]);

  const eventAlerts = useMemo(() => {
    return caregiverAlerts.map((item) => {
      if (item.type === 'emergency') {
        return {
          id: `event-${item.id}`,
          rawId: item.id,
          type: 'event',
          eventType: 'emergency',
          title: 'Emergencia',
          medicineName: 'Solicitud de ayuda',
          message:
            item.message ||
            `${item.patientName || 'El paciente'} solicitó ayuda de emergencia.`,
          detail: `${item.patientName || 'Paciente'} · ${formatDateTime(
            item.createdAt
          )}`,
          color: '#E74C3C',
          background: '#FDECEC',
          icon: 'warning',
          priority: 0,
        };
      }

      if (item.type === 'patient_low_stock') {
        return {
          id: `event-${item.id}`,
          rawId: item.id,
          type: 'event',
          eventType: 'patient_low_stock',
          title: 'Stock crítico reportado',
          medicineName: item.medicineName || 'Medicamento',
          message:
            item.message ||
            `El paciente indicó que ${item.medicineName || 'un medicamento'} está por agotarse.`,
          detail: `Reporte del paciente · ${formatDateTime(item.createdAt)}`,
          color: '#F39C12',
          background: '#FFF4E5',
          icon: 'medkit',
          priority: 2,
        };
      }

      if (item.type === 'medicine_missed') {
        return {
          id: `event-${item.id}`,
          rawId: item.id,
          type: 'event',
          eventType: 'medicine_missed',
          title: 'Dosis omitida',
          medicineName: item.medicineName || 'Medicamento',
          message:
            item.message ||
            `${item.patientName || 'El paciente'} no registró ${
              item.medicineName || 'el medicamento'
            }.`,
          detail: `Horario: ${item.scheduledTime || '--:--'} · ${formatDateTime(
            item.createdAt
          )}`,
          color: '#E74C3C',
          background: '#FDECEC',
          icon: 'close-circle',
          priority: 1,
        };
      }

      return {
        id: `event-${item.id}`,
        rawId: item.id,
        type: 'event',
        eventType: 'medicine_taken',
        title: 'Medicamento tomado',
        medicineName: item.medicineName || 'Medicamento',
        message:
          item.message ||
          `${item.patientName || 'El paciente'} tomó ${
            item.medicineName || 'el medicamento'
          }.`,
        detail: `Horario: ${item.scheduledTime || '--:--'} · ${formatDateTime(
          item.createdAt
        )}`,
        color: '#27AE60',
        background: '#EAF8EE',
        icon: 'checkmark-circle',
        priority: 5,
      };
    });
  }, [caregiverAlerts]);

  const allAlerts = useMemo(() => {
    return [...stockAlerts, ...eventAlerts].sort(
      (a, b) => a.priority - b.priority
    );
  }, [stockAlerts, eventAlerts]);

  const criticalCount = stockAlerts.filter(
    (item) => item.title === 'Sin stock' || item.title === 'Se agota muy pronto'
  ).length;

  const handleMarkEventsAsRead = async () => {
    const user = auth.currentUser;

    if (!user || caregiverAlerts.length === 0) return;

    Alert.alert(
      'Marcar eventos como leídos',
      'Se ocultarán las alertas de tomas, dosis omitidas y emergencias ya revisadas. Las alertas de stock seguirán visibles hasta que repongas stock.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Marcar como leídas',
          onPress: async () => {
            try {
              setMarkingRead(true);

              for (const item of caregiverAlerts) {
                await updateDoc(
                  doc(db, 'usuarios', user.uid, 'alertas', item.id),
                  { read: true }
                );
              }
            } catch (error) {
              console.error('Error marcando alertas como leídas:', error);
              Alert.alert('Error', 'No se pudieron marcar las alertas.');
            } finally {
              setMarkingRead(false);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    return (
      <View style={[styles.alertCard, { backgroundColor: item.background }]}>
        <View style={[styles.iconBox, { borderColor: item.color }]}>
          <Ionicons name={item.icon} size={30} color={item.color} />
        </View>

        <View style={styles.alertContent}>
          <Text
            style={[styles.medicineName, { fontSize: fontSizes.normal + 4 }]}
          >
            {item.medicineName}
          </Text>

          <Text
            style={[
              styles.alertTitle,
              { color: item.color, fontSize: fontSizes.normal },
            ]}
          >
            {item.title}
          </Text>

          <Text style={[styles.alertMessage, { fontSize: fontSizes.normal }]}>
            {item.message}
          </Text>

          <Text style={[styles.stockText, { fontSize: fontSizes.small }]}>
            {item.detail}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <View style={styles.content}>
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

            {allAlerts.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{allAlerts.length}</Text>
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
          Centro de alertas
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: colors.secondaryText, fontSize: fontSizes.subtitle },
          ]}
        >
          Stock activo y eventos médicos no leídos.
        </Text>

        {eventAlerts.length > 0 && (
          <TouchableOpacity
            style={styles.markReadButton}
            onPress={handleMarkEventsAsRead}
            disabled={markingRead}
          >
            <Ionicons name="checkmark-done-outline" size={21} color="#FFFFFF" />
            <Text style={styles.markReadText}>
              {markingRead ? 'Marcando...' : 'Marcar eventos como leídos'}
            </Text>
          </TouchableOpacity>
        )}

        {criticalCount > 0 && (
          <View style={styles.criticalBanner}>
            <Ionicons name="warning" size={22} color="#FFFFFF" />
            <Text
              style={[
                styles.criticalBannerText,
                { fontSize: fontSizes.normal },
              ]}
            >
              Tienes {criticalCount} alerta(s) crítica(s) de stock.
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
            data={allAlerts}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: 100 + insets.bottom },
            ]}
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
                  No hay alertas pendientes por ahora.
                </Text>
              </View>
            }
          />
        )}

        <View
          style={[
            styles.bottomNav,
            {
              backgroundColor: colors.card,
              height: 75 + insets.bottom,
              paddingBottom: insets.bottom,
            },
          ]}
        >
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
    </SafeAreaView>
  );
};

export default AlertsScreen;
