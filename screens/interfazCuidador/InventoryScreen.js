import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useInventory } from '../../hook/useInventory';

const PACIENTE_ID_DEMO = 'demo-paciente-001';

const InventoryScreen = ({onAddPress}) => {
  const [search, setSearch] = useState('');
  const { medicines, loading } = useInventory(PACIENTE_ID_DEMO);

  const filteredMedicines = useMemo(() => {
    return medicines.filter((item) =>
      item.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [medicines, search]);

  const getStockStatus = (item) => {
    const currentStock = Number(item.currentStock || 0);
    const minStock = Number(item.minStock || 0);

    if (currentStock <= 0) {
      return { label: 'Sin stock', color: '#E74C3C', background: '#FDECEC' };
    }

    if (currentStock <= minStock) {
      return { label: 'Crítico', color: '#F39C12', background: '#FFF4E5' };
    }

    return { label: 'Suficiente', color: '#27AE60', background: '#EAF8EE' };
  };

  const renderItem = ({ item }) => {
    const status = getStockStatus(item);

    return (
      <View style={[styles.card, { backgroundColor: status.background }]}>
        <View style={styles.cardLeft}>
          <View style={styles.iconBox}>
            <Ionicons name="medkit-outline" size={24} color="#4F5D75" />
          </View>

          <View style={styles.textBox}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productStock}>
              Stock: {item.currentStock ?? 0} unidades
            </Text>
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="ellipsis-vertical" size={20} color="#636E72" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color="#2D3436" />
        </TouchableOpacity>

        <Text style={styles.logoText}>G-PIM</Text>

        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#2D3436" />
        </TouchableOpacity>
      </View>

      <Text style={styles.header}>Inventario Médico</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#B2BEC3" style={styles.searchIcon} />
        <TextInput
          placeholder="Buscar medicamento..."
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Cargando inventario...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredMedicines}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centerContent}>
              <Ionicons name="medkit-outline" size={48} color="#B2BEC3" />
              <Text style={styles.emptyText}>No hay medicamentos registrados</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
        <Ionicons name="add" size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Añadir medicamento</Text>
      </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: '800',
    color: '#2D3436',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
    marginTop: 20,
    marginBottom: 18,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 110,
  },
  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FFFFFFAA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textBox: {
    flex: 1,
  },
  productName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2D3436',
  },
  productStock: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
  },
  editButton: {
    padding: 6,
    marginLeft: 10,
  },
  addButton: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 25,
    backgroundColor: '#42B65A',
    borderRadius: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  loadingText: {
    marginTop: 10,
    color: '#636E72',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    color: '#636E72',
  },
});

export default InventoryScreen;