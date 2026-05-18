import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getTheme } from '../../theme/theme';

const API_URL = 'https://script.google.com/macros/s/AKfycbxVlvaQ1NE76H2ryldf3rTl67__-e7cuF5UGAWmoLo0NfOQOpxPhusjlzliF-wRPJfjBA/exec';

const OffersScreen = ({ settings, onBack, onGoInventory, onGoAlerts, onGoProfile }) => {
  const { colors, fontSizes } = getTheme(settings);

  const [search, setSearch] = useState('');
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!search.trim()) {
      Alert.alert('Campo vacío', 'Ingresa el nombre de un medicamento.');
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      const response = await fetch(
        `${API_URL}?nombre_medicamento=${encodeURIComponent(search.trim())}&top=3`
      );

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('La respuesta de la API no es válida');
      }

      setOffers(data);
    } catch (error) {
      console.log('Error consultando API:', error);
      Alert.alert('Error', 'No se pudieron cargar las ofertas.');
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }) => {
    const isBest = index === 0;

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
          isBest && styles.bestPriceRow,
        ]}
      >
        <View style={styles.headerRow}>
          <MaterialCommunityIcons name="pill" size={26} color={colors.primary} />
          <Text
            style={[
              styles.medicineName,
              { color: colors.text, fontSize: fontSizes.normal + 4 },
            ]}
          >
            {item.nombre_medicamento}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text
            style={[
              styles.pharmacy,
              { color: colors.text, fontSize: fontSizes.normal },
            ]}
          >
            {item.nombre_farmacia}
          </Text>

          <View style={styles.priceContainer}>
            <Text
              style={[
                styles.price,
                {
                  color: isBest ? colors.primary : colors.text,
                  fontSize: fontSizes.normal,
                },
              ]}
            >
              ${item.precio}
            </Text>

            {isBest && (
              <Ionicons name="star" size={16} color="#F1C40F" />
            )}
          </View>
        </View>

        <Text
          style={[
            styles.addressText,
            { color: colors.secondaryText, fontSize: fontSizes.small },
          ]}
        >
          {item.direccion_farmacia || 'Dirección no disponible'}
        </Text>
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
          Ofertas
        </Text>

        <Ionicons name="cart" size={24} color="#F39C12" />
      </View>

      <Text
        style={[
          styles.header,
          { color: colors.text, fontSize: fontSizes.title },
        ]}
      >
        Comparador de precios
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: colors.secondaryText, fontSize: fontSizes.subtitle },
        ]}
      >
        Busca un medicamento y revisa las 3 farmacias más económicas.
      </Text>

      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={colors.secondaryText}
          style={styles.searchIcon}
        />

        <TextInput
          style={[
            styles.searchInput,
            { color: colors.text, fontSize: fontSizes.normal },
          ]}
          placeholder="Ej: Paracetamol"
          placeholderTextColor={colors.secondaryText}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <TouchableOpacity
        style={[styles.searchButton, { backgroundColor: colors.primary }]}
        onPress={handleSearch}
      >
        <Text
          style={[
            styles.searchButtonText,
            { fontSize: fontSizes.button },
          ]}
        >
          Buscar ofertas
        </Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text
            style={[
              styles.loadingText,
              { color: colors.secondaryText, fontSize: fontSizes.normal },
            ]}
          >
            Buscando ofertas...
          </Text>
        </View>
      ) : (
        <FlatList
          data={offers}
          keyExtractor={(item, index) => String(item.id_oferta || index)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            searched ? (
              <View style={styles.centerContent}>
                <Ionicons name="medkit-outline" size={48} color={colors.secondaryText} />
                <Text
                  style={[
                    styles.emptyText,
                    { color: colors.secondaryText, fontSize: fontSizes.normal },
                  ]}
                >
                  No se encontraron ofertas para ese medicamento.
                </Text>
              </View>
            ) : null
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

        <TouchableOpacity style={styles.navItem} onPress={onGoAlerts}>
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

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="cart" size={24} color="#F39C12" />
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

export default OffersScreen;

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
  header: {
    fontWeight: 'bold',
    marginTop: 20,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 16,
  },
  searchContainer: {
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
  },
  searchButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  listContent: {
    paddingBottom: 100,
  },
  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  medicineName: {
    fontWeight: '800',
    marginLeft: 10,
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  bestPriceRow: {
    backgroundColor: '#EAF8EE',
  },
  pharmacy: {
    fontWeight: '700',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontWeight: '700',
    marginRight: 5,
  },
  addressText: {
    marginTop: 6,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  loadingText: {
    marginTop: 10,
  },
  emptyText: {
    marginTop: 12,
    textAlign: 'center',
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
  },
  navText: {
    fontWeight: '700',
    marginTop: 3,
  },
});