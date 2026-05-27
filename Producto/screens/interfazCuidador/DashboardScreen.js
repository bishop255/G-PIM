import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { collection, onSnapshot } from 'firebase/firestore';

import {styles} from '../../styles/interfazCuidador/DashboardScreen.styles';
import { db } from '../../database/firebaseConfig';
import { getTheme } from '../../theme/theme';
import { useInventory } from '../../hook/useInventory';
import { getTodayKey } from '../../services/medicineTakenService';

const DashboardScreen = ({ patientId, settings, onBack }) => {
  const { medicines, loading } = useInventory(patientId);
  const { colors, fontSizes } = getTheme(settings);

  const [todayDoses, setTodayDoses] = useState([]);
  const [loadingDoses, setLoadingDoses] = useState(true);

  useEffect(() => {
    if (!patientId) {
      setTodayDoses([]);
      setLoadingDoses(false);
      return;
    }

    const dosesRef = collection(db, 'pacientes', patientId, 'dosisTomadas');

    const unsubscribe = onSnapshot(
      dosesRef,
      (snapshot) => {
        const today = getTodayKey();

        const list = snapshot.docs
          .map((docItem) => ({
            id: docItem.id,
            ...docItem.data(),
          }))
          .filter((item) => item.date === today);

        setTodayDoses(list);
        setLoadingDoses(false);
      },
      (error) => {
        console.error('Error cargando dosis del dashboard:', error);
        setLoadingDoses(false);
      }
    );

    return unsubscribe;
  }, [patientId]);

  const stats = useMemo(() => {
    const taken = todayDoses.filter((item) => item.status === 'taken').length;
    const missed = todayDoses.filter((item) => item.status === 'missed').length;
    const totalRegistered = taken + missed;

    const adherence =
      totalRegistered > 0 ? Math.round((taken / totalRegistered) * 100) : 0;

    const lowStock = medicines.filter((item) => {
      const currentStock = Number(item.currentStock || 0);
      const minStock = Number(item.minStock || 0);

      return currentStock > 0 && currentStock <= minStock;
    }).length;

    const noStock = medicines.filter(
      (item) => Number(item.currentStock || 0) <= 0
    ).length;

    return {
      taken,
      missed,
      totalRegistered,
      adherence,
      lowStock,
      noStock,
      totalMedicines: medicines.length,
    };
  }, [todayDoses, medicines]);

  const recentDoses = useMemo(() => {
    return [...todayDoses].sort((a, b) => {
      const aTime = a.scheduledTime || '00:00';
      const bTime = b.scheduledTime || '00:00';
      return aTime.localeCompare(bTime);
    });
  }, [todayDoses]);

  if (loading || loadingDoses) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#42B65A" />
        <Text
          style={[
            styles.loadingText,
            { color: colors.secondaryText, fontSize: fontSizes.normal },
          ]}
        >
          Preparando dashboard...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={26} color={colors.text} />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            { color: colors.text, fontSize: fontSizes.header },
          ]}
        >
          Dashboard
        </Text>

        <View style={{ width: 26 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons name="analytics-outline" size={42} color="#42B65A" />
          </View>

          <Text style={styles.heroTitle}>Resumen de hoy</Text>

          <Text style={styles.heroSubtitle}>
            Seguimiento rápido de adherencia, dosis y stock.
          </Text>

          <Text style={styles.percentText}>{stats.adherence}%</Text>
          <Text style={styles.percentLabel}>Adherencia registrada</Text>
        </View>

        <View style={styles.grid}>
          <StatCard
            icon="checkmark-circle-outline"
            title="Tomadas"
            value={stats.taken}
            color="#27AE60"
          />

          <StatCard
            icon="close-circle-outline"
            title="Omitidas"
            value={stats.missed}
            color="#E74C3C"
          />

          <StatCard
            icon="warning-outline"
            title="Stock bajo"
            value={stats.lowStock + stats.noStock}
            color="#F39C12"
          />

          <StatCard
            icon="medical-bag"
            title="Medicamentos"
            value={stats.totalMedicines}
            color="#2D9CDB"
            material
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Actividad de dosis</Text>
          <Text style={styles.sectionSubtitle}>Tomadas y omitidas de hoy</Text>
        </View>

        {recentDoses.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={48} color="#636E72" />
            <Text style={styles.emptyTitle}>Sin registros hoy</Text>
            <Text style={styles.emptyText}>
              Cuando el paciente tome u omita una dosis, aparecerá aquí.
            </Text>
          </View>
        ) : (
          recentDoses.map((item) => {
            const isTaken = item.status === 'taken';

            return (
              <View
                key={item.id}
                style={[
                  styles.doseRow,
                  { backgroundColor: isTaken ? '#EAF8EE' : '#FDECEC' },
                ]}
              >
                <View style={styles.doseIcon}>
                  <Ionicons
                    name={isTaken ? 'checkmark-circle' : 'close-circle'}
                    size={28}
                    color={isTaken ? '#27AE60' : '#E74C3C'}
                  />
                </View>

                <View style={styles.doseInfo}>
                  <Text style={styles.doseName}>
                    {item.medicineName || 'Medicamento'}
                  </Text>
                  <Text style={styles.doseMeta}>
                    {isTaken ? 'Tomada' : 'Omitida'} · {item.scheduledTime || '--:--'}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const StatCard = ({ icon, title, value, color, material = false }) => {
  const IconComponent = material ? MaterialCommunityIcons : Ionicons;

  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        <IconComponent name={icon} size={28} color={color} />
      </View>

      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
};

export default DashboardScreen;

