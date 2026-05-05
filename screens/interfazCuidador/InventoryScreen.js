import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';
import { getTheme } from '../../theme/theme';
import { useInventory } from '../../hook/useInventory';
import SideMenu from '../../components/SideMenu';

const PACIENTE_ID_DEMO = 'demo-paciente-001';

const InventoryScreen = ({ 
  settings, 
  onAddPress, 
  onEditPress, 
  onAlertsPress, 
  onOffersPress, 
  onMedicinePress, 
  onHistoryPress, 
  onSettingsPress, 
  onProfilePress 
}) => {
  const [search, setSearch] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const { medicines, loading, deleteMedicine } = useInventory(PACIENTE_ID_DEMO);
  const { colors, fontSizes } = getTheme(settings);

  const confirmDelete = (id) => {
    Alert.alert('Eliminar medicamento', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await deleteMedicine(id);
        },
      },
    ]);
  };

  const handleOptions = (item) => {
    Alert.alert(item.name, '¿Qué deseas hacer?', [
      { text: 'Editar', onPress: () => onEditPress(item) },
      { text: 'Eliminar', style: 'destructive', onPress: () => confirmDelete(item.id) },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const getPriorityValue = (item) => {
    const currentStock = Number(item.currentStock || 0);
    const minStock = Number(item.minStock || 0);
    if (currentStock <= 0) return 1;
    if (currentStock <= minStock) return 2;
    if (currentStock <= minStock * 1.5) return 3;
    return 4;
  };

  const filteredMedicines = useMemo(() => {
    return medicines
      .filter((item) => item.name?.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => getPriorityValue(a) - getPriorityValue(b));
  }, [medicines, search]);

  const getRemainingDays = (item) => {
    const currentStock = Number(item.currentStock || 0);
    const dailyDose = Number(item.dailyDose || 0);
    if (currentStock <= 0) return 0;
    if (dailyDose <= 0) return null;
    return Math.floor(currentStock / dailyDose);
  };

  const getStockStatus = (item) => {
    const currentStock = Number(item.currentStock || 0);
    const minStock = Number(item.minStock || 0);

    if (currentStock <= 0) {
      return { label: 'Sin stock', color: '#E74C3C', background: '#FDECEC', iconColor: '#E74C3C' };
    }
    if (currentStock <= minStock) {
      return { label: 'Crítico', color: '#F39C12', background: '#FFF4E5', iconColor: '#F39C12' };
    }
    if (currentStock <= minStock * 1.5) {
      return { label: 'Bajo stock', color: '#D68910', background: '#FFF8E1', iconColor: '#D68910' };
    }
    return { label: 'Suficiente', color: '#27AE60', background: '#EAF8EE', iconColor: '#27AE60' };
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Tableta': return 'pill';
      case 'Jarabe': return 'bottle-tonic';
      case 'Inyección': return 'needle';
      case 'Otro': return 'medical-bag';
      default: return 'pill';
    }
  };

  const renderItem = ({ item }) => {
    const status = getStockStatus(item);
    const remainingDays = getRemainingDays(item);

    return (
      <TouchableOpacity onPress={() => onMedicinePress(item)} activeOpacity={0.8}>
        <View style={[styles.card, { backgroundColor: status.background }]}>
          <View style={styles.cardLeft}>
            <View style={[styles.iconBox, { borderColor: status.iconColor }]}>
              <MaterialCommunityIcons
                name={getCategoryIcon(item.category)}
                size={34}
                color={status.iconColor}
              />
            </View>

            <View style={styles.textBox}>
              <Text
                style={[
                  styles.productName,
                  {
                    color: '#2D3436',
                    fontSize: fontSizes.normal + 3,
                  },
                ]}
              >
                {item.name}
              </Text>

              <Text
                style={[
                  styles.productStock,
                  {
                    color: '#636E72',
                    fontSize: fontSizes.normal,
                  },
                ]}
              >
                Stock: {item.currentStock ?? 0} unidades
              </Text>

              <Text
                style={[
                  styles.remainingDays,
                  {
                    color: '#4F5D75',
                    fontSize: fontSizes.normal,
                  },
                ]}
              >
                {remainingDays === null
                  ? 'Dosis diaria no definida'
                  : remainingDays === 1
                  ? 'Queda 1 día de stock'
                  : `Quedan ${remainingDays} días de stock`}
              </Text>

              <Text
                style={[
                  styles.statusText,
                  {
                    color: status.color,
                    fontSize: fontSizes.small,
                  },
                ]}
              >
                {status.label}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleOptions(item)}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#636E72" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          <Text
            style={[
              styles.logoText,
              { color: colors.text, fontSize: fontSizes.header },
            ]}
          >
            G-PIM
          </Text>
        </View>

        <TouchableOpacity>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      <Text
        style={[
          styles.header,
          { color: colors.text, fontSize: fontSizes.title },
        ]}
      >
        Inventario Médico
      </Text>

      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Ionicons
          name="search"
          size={20}
          color={colors.secondaryText}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Buscar medicamento..."
          placeholderTextColor={colors.secondaryText}
          style={[
            styles.searchInput,
            { color: colors.text, fontSize: fontSizes.normal },
          ]}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* LISTA O CARGANDO */}
      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
          <Text
            style={[
              styles.loadingText,
              { color: colors.secondaryText, fontSize: fontSizes.normal },
            ]}
          >
            Cargando inventario...
          </Text>
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
              <Ionicons
                name="medkit-outline"
                size={48}
                color={colors.secondaryText}
              />
              <Text
                style={[
                  styles.emptyText,
                  { color: colors.secondaryText, fontSize: fontSizes.normal },
                ]}
              >
                No hay medicamentos registrados
              </Text>
            </View>
          }
        />
      )}

      {/* BOTÓN FLOTANTE AÑADIR */}
      <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
        <Ionicons name="add" size={24} color="#FFFFFF" />
        <Text style={[styles.addButtonText, { fontSize: fontSizes.button }]}>
          Añadir medicamento
        </Text>
      </TouchableOpacity>

      <View style={[styles.bottomNav, { backgroundColor: colors.card }]}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#42B65A" />
          <Text
            style={[
              styles.navText,
              { color: '#42B65A', fontSize: fontSizes.small },
            ]}
          >
            Inicio
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={onAlertsPress}>
          <Ionicons name="alert-circle-outline" size={24} color="#E74C3C" />
          <Text
            style={[
              styles.navText,
              { color: '#E74C3C', fontSize: fontSizes.small },
            ]}
          >
            Alertas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={onOffersPress}>
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

        <TouchableOpacity style={styles.navItem} onPress={onProfilePress}>
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

        <SideMenu
          visible={menuVisible}
          settings={settings}
          onClose={() => setMenuVisible(false)}
          onNavigate={(screen) => {
            setMenuVisible(false);

            if (screen === 'history') onHistoryPress();
            if (screen === 'profile') onProfilePress();;
            if (screen === 'settings') onSettingsPress();
            if (screen === 'logout') alert('Próximamente');
          }}
        />
    </View>
  );
};

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
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: 6,
  },
  logoText: {
    fontWeight: '800',
  },
  header: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 18,
  },
  searchContainer: {
    flexDirection: 'row',
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
  },
  listContent: {
    paddingBottom: 185,
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
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 2,
  },
  textBox: {
    flex: 1,
  },
  productName: {
    fontWeight: '700',
  },
  productStock: {
    marginTop: 4,
  },
  remainingDays: {
    marginTop: 4,
    fontWeight: '600',
  },
  statusText: {
    fontWeight: '700',
    marginTop: 6,
  },
  editButton: {
    padding: 6,
    marginLeft: 10,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16 },
  listContent: { paddingBottom: 185 },
  card: { borderRadius: 18, padding: 16, marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: { width: 64, height: 64, borderRadius: 18, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginRight: 14, borderWidth: 2 },
  textBox: { flex: 1 },
  productName: { fontSize: 17, fontWeight: '700', color: '#2D3436' },
  productStock: { fontSize: 14, color: '#636E72', marginTop: 4 },
  remainingDays: { fontSize: 14, color: '#4F5D75', marginTop: 4, fontWeight: '600' },
  statusText: { fontSize: 13, fontWeight: '700', marginTop: 6 },
  editButton: { padding: 6, marginLeft: 10 },
  addButton: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 90,
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
    fontWeight: '700',
    marginLeft: 8,
  },
  addButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginLeft: 8 },
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontWeight: '700',
    marginTop: 3,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  loadingText: {
    marginTop: 10,
  },
  emptyText: {
    marginTop: 12,
    textAlign: 'center',
  },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navText: { fontSize: 11, fontWeight: '700', color: '#2D3436', marginTop: 3 },
  centerContent: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  loadingText: { marginTop: 10, color: '#636E72' },
  emptyText: { marginTop: 12, fontSize: 15, color: '#636E72' },
});

export default InventoryScreen;