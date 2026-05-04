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
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../database/firebaseConfig';

const PACIENTE_ID_DEMO = 'demo-paciente-001';

const HistoryScreen = ({ onBack }) => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const movementsRef = collection(
      db,
      'pacientes',
      PACIENTE_ID_DEMO,
      'movimientos'
    );

    const q = query(movementsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMovements(list);
        setLoading(false);
      },
      (error) => {
        console.error('Error obteniendo historial:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const getMovementInfo = (type) => {
    if (type === 'consume') {
      return {
        label: 'Consumo',
        icon: 'remove-circle-outline',
        color: '#E74C3C',
        background: '#FDECEC',
      };
    }

    if (type === 'replenish') {
      return {
        label: 'Reposición',
        icon: 'add-circle-outline',
        color: '#27AE60',
        background: '#EAF8EE',
      };
    }

    return {
      label: 'Movimiento',
      icon: 'swap-horizontal-outline',
      color: '#636E72',
      background: '#F1F2F6',
    };
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return 'Fecha no disponible';

    return timestamp.toDate().toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderItem = ({ item }) => {
    const info = getMovementInfo(item.type);

    return (
      <View style={[styles.card, { backgroundColor: info.background }]}>
        <View style={[styles.iconBox, { borderColor: info.color }]}>
          <Ionicons name={info.icon} size={28} color={info.color} />
        </View>

        <View style={styles.content}>
          <Text style={styles.medicineName}>{item.medicineName}</Text>

          <Text style={[styles.typeText, { color: info.color }]}>
            {info.label}
          </Text>

          <Text style={styles.description}>{item.description}</Text>

          <Text style={styles.stockText}>
            Stock: {item.previousStock} → {item.newStock}
          </Text>

          <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
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

        <Text style={styles.title}>Historial</Text>

        <Ionicons name="time-outline" size={24} color="#2D3436" />
      </View>

      <Text style={styles.header}>Movimientos</Text>
      <Text style={styles.subtitle}>
        Registro de consumo y reposición de medicamentos.
      </Text>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Cargando historial...</Text>
        </View>
      ) : (
        <FlatList
          data={movements}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centerContent}>
              <Ionicons name="document-text-outline" size={58} color="#B2BEC3" />
              <Text style={styles.emptyText}>
                Aún no hay movimientos registrados.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default HistoryScreen;

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
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2D3436',
  },
  header: {
    fontSize: 30,
    fontWeight: '900',
    color: '#2D3436',
    marginTop: 28,
  },
  subtitle: {
    fontSize: 15,
    color: '#636E72',
    marginTop: 8,
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 40,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  content: {
    flex: 1,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2D3436',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '900',
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 4,
  },
  stockText: {
    fontSize: 13,
    color: '#4F5D75',
    fontWeight: '800',
    marginTop: 6,
  },
  dateText: {
    fontSize: 12,
    color: '#636E72',
    marginTop: 4,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 90,
  },
  loadingText: {
    marginTop: 10,
    color: '#636E72',
    fontWeight: '600',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    color: '#636E72',
    textAlign: 'center',
  },
});