import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';

import { db } from '../../database/firebaseConfig';
import { getTheme } from '../../theme/theme';

const EmergencyHistoryScreen = ({ patientId, settings, onBack }) => {
  const { colors, fontSizes } = getTheme(settings);

  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) {
      setEmergencies([]);
      setLoading(false);
      return;
    }

    const emergenciesRef = collection(
      db,
      'pacientes',
      patientId,
      'emergencias'
    );

    const emergenciesQuery = query(
      emergenciesRef,
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      emergenciesQuery,
      (snapshot) => {
        const list = snapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }));

        setEmergencies(list);
        setLoading(false);
      },
      (error) => {
        console.error('Error cargando historial de emergencias:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [patientId]);

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return 'Fecha no disponible';

    return timestamp.toDate().toLocaleString('es-CL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconBox}>
        <Ionicons name="warning-outline" size={30} color="#E74C3C" />
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>Emergencia enviada</Text>

        <Text style={styles.cardMessage}>
          {item.message || 'El paciente solicitó ayuda de emergencia.'}
        </Text>

        <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
      </View>
    </View>
  );

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
          Emergencias
        </Text>

        <View style={{ width: 26 }} />
      </View>

      <Text
        style={[
          styles.title,
          { color: colors.text, fontSize: fontSizes.title },
        ]}
      >
        Historial de emergencias
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: colors.secondaryText, fontSize: fontSizes.normal },
        ]}
      >
        Registro de alertas de ayuda enviadas por el paciente.
      </Text>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#42B65A" />
          <Text style={[styles.loadingText, { color: colors.secondaryText }]}>
            Cargando historial...
          </Text>
        </View>
      ) : (
        <FlatList
          data={emergencies}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="shield-checkmark-outline" size={64} color="#27AE60" />
              <Text style={styles.emptyTitle}>Sin emergencias</Text>
              <Text style={styles.emptyText}>
                No se han registrado alertas de emergencia.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default EmergencyHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 55,
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: '900',
  },
  title: {
    fontWeight: '900',
    marginTop: 28,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 20,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FDECEC',
    borderRadius: 22,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 2,
    borderColor: '#E74C3C',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: '#E74C3C',
    fontSize: 17,
    fontWeight: '900',
  },
  cardMessage: {
    color: '#2D3436',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
  },
  cardDate: {
    color: '#636E72',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
  },
  centerContent: {
    marginTop: 90,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontWeight: '700',
  },
  emptyContainer: {
    marginTop: 90,
    alignItems: 'center',
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: '900',
    color: '#27AE60',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 15,
    color: '#636E72',
    fontWeight: '700',
    textAlign: 'center',
  },
});