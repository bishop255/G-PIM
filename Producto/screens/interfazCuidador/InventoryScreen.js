import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
  TextInput,
  Image,
} from 'react-native';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { styles } from '../../styles/interfazCuidador/InventoryScreen.styles';
import { getTheme } from '../../theme/theme';
import { useInventory } from '../../hook/useInventory';
import SideMenu from '../../components/SideMenu';

const InventoryScreen = ({
  settings,
  onAddPress,
  onEditPress,
  onAlertsPress,
  onOffersPress,
  onMedicinePress,
  onHistoryPress,
  onSettingsPress,
  onProfilePress,
  onLogout,
  patientId,
  onLinkPatientPress,
  onDashboardPress,
  onEmergencyHistoryPress,
}) => {
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const { medicines, loading, deleteMedicine } = useInventory(patientId);
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
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => confirmDelete(item.id),
      },
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
    const doseAmount = Number(item.doseAmount || 1);
    const dailyConsumption = dailyDose * doseAmount;

    if (currentStock <= 0) return 0;
    if (dailyConsumption <= 0) return null;

    return Math.floor(currentStock / dailyConsumption);
  };

  const getStockStatus = (item) => {
    const currentStock = Number(item.currentStock || 0);
    const minStock = Number(item.minStock || 0);

    if (currentStock <= 0) {
      return {
        label: 'Sin stock',
        color: '#E74C3C',
        background: '#FDECEC',
        iconColor: '#E74C3C',
      };
    }

    if (currentStock <= minStock) {
      return {
        label: 'Crítico',
        color: '#F39C12',
        background: '#FFF4E5',
        iconColor: '#F39C12',
      };
    }

    if (currentStock <= minStock * 1.5) {
      return {
        label: 'Bajo stock',
        color: '#D68910',
        background: '#FFF8E1',
        iconColor: '#D68910',
      };
    }

    return {
      label: 'Suficiente',
      color: '#27AE60',
      background: '#EAF8EE',
      iconColor: '#27AE60',
    };
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Tableta / Cápsula':
      case 'Tableta':
        return 'pill';
      case 'Jarabe / Gotas':
      case 'Jarabe':
        return 'bottle-tonic-plus';
      case 'Inyección':
        return 'needle';
      case 'Insumo médico':
      case 'Otro':
        return 'medical-bag';
      default:
        return 'pill';
    }
  };

  const formatStockUnit = (item) => {
    return item.stockUnit || 'unidad';
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
                Stock: {item.currentStock ?? 0} {formatStockUnit(item)}
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
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <View style={styles.content}>
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

          <TouchableOpacity onPress={onDashboardPress}>
            <Ionicons name="analytics-outline" size={26} color={colors.text} />
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
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: 190 + insets.bottom },
            ]}
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

        <TouchableOpacity
          style={[
            styles.addButton,
            {
              bottom: 90 + insets.bottom,
            },
          ]}
          onPress={onAddPress}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
          <Text style={[styles.addButtonText, { fontSize: fontSizes.button }]}>
            Añadir medicamento
          </Text>
        </TouchableOpacity>

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
            if (screen === 'emergencyHistory') onEmergencyHistoryPress();
            if (screen === 'profile') onProfilePress();
            if (screen === 'settings') onSettingsPress();
            if (screen === 'linkPatient') onLinkPatientPress();

            if (screen === 'logout') {
              Alert.alert('Cerrar sesión', '¿Seguro que deseas cerrar sesión?', [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Cerrar sesión',
                  style: 'destructive',
                  onPress: onLogout,
                },
              ]);
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default InventoryScreen;