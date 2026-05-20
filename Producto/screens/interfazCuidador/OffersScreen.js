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
  Linking,
} from 'react-native';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { getTheme } from '../../theme/theme';
import { useInventory } from '../../hook/useInventory';

const API_URL = 'http://192.168.1.100:3001/api/prices';

const OffersScreen = ({
  patientId,
  settings,
  onBack,
  onGoInventory,
  onGoAlerts,
  onGoProfile,
  onGoMyMedicines,
}) => {
  const insets = useSafeAreaInsets();

  const { colors, fontSizes } = getTheme(settings);
  useInventory(patientId);

  const [search, setSearch] = useState('');
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchOffers = async (medicineName) => {
    const query = medicineName.trim();

    if (query.length < 2) {
      Alert.alert('Búsqueda inválida', 'Ingresa al menos 2 caracteres.');
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      const response = await fetch(
        `${API_URL}?query=${encodeURIComponent(query)}`
      );

      const data = await response.json();

      if (!data?.ok || !Array.isArray(data.results)) {
        throw new Error('Respuesta inválida de la API');
      }

      const availableOffers = data.results
        .filter((item) => item.available !== false)
        .sort((a, b) => Number(a.price || 0) - Number(b.price || 0));

      setOffers(availableOffers);
    } catch (error) {
      console.log('Error consultando API:', error);
      Alert.alert(
        'Error',
        'No se pudieron cargar los precios. Verifica que la API esté activa.'
      );
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      Alert.alert('Campo vacío', 'Ingresa el nombre de un medicamento.');
      return;
    }

    await fetchOffers(search.trim());
  };

  const formatPrice = (price) => {
    const value = Number(price || 0);
    return value.toLocaleString('es-CL');
  };

  const openPharmacyUrl = async (url) => {
    if (!url) {
      Alert.alert('Enlace no disponible', 'No se encontró el enlace de compra.');
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(url);

      if (!canOpen) {
        Alert.alert('Error', 'No se pudo abrir el sitio web.');
        return;
      }

      await Linking.openURL(url);
    } catch (error) {
      console.log('Error abriendo enlace:', error);
      Alert.alert('Error', 'No se pudo abrir el sitio web.');
    }
  };

  const renderItem = ({ item, index }) => {
    const isBest = index === 0;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => openPharmacyUrl(item.productUrl || item.url)}
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: isBest ? colors.primary : colors.border,
          },
          isBest && styles.bestPriceRow,
        ]}
      >
        {isBest && (
          <View style={styles.bestBadge}>
            <Ionicons name="star" size={14} color="#FFFFFF" />
            <Text style={styles.bestBadgeText}>Mejor precio</Text>
          </View>
        )}

        <View style={styles.headerRow}>
          <MaterialCommunityIcons
            name="pill"
            size={26}
            color={colors.primary}
          />

          <Text
            style={[
              styles.medicineName,
              {
                color: colors.text,
                fontSize: fontSizes.normal + 4,
              },
            ]}
            numberOfLines={2}
          >
            {item.medicineName || 'Medicamento'}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.pharmacy,
                {
                  color: colors.text,
                  fontSize: fontSizes.normal,
                },
              ]}
            >
              {item.pharmacy || 'Farmacia'}
            </Text>

            <Text
              style={[
                styles.availableText,
                {
                  color: colors.primary,
                  fontSize: fontSizes.small,
                },
              ]}
            >
              Disponible
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <Text
              style={[
                styles.price,
                {
                  color: isBest ? colors.primary : colors.text,
                  fontSize: fontSizes.normal + 4,
                },
              ]}
            >
              ${formatPrice(item.price)}
            </Text>

            {isBest ? (
              <Ionicons name="star" size={16} color="#F1C40F" />
            ) : (
              <Ionicons name="open-outline" size={17} color={colors.text} />
            )}
          </View>
        </View>

        <Text
          style={[
            styles.openHint,
            {
              color: colors.secondaryText,
              fontSize: fontSizes.small,
            },
          ]}
        >
          Toca para ir al sitio de compra
        </Text>
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
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text
            style={[
              styles.logoText,
              {
                color: colors.text,
                fontSize: fontSizes.header,
              },
            ]}
          >
            Ofertas
          </Text>

          <Ionicons name="cart" size={24} color="#F39C12" />
        </View>

        <Text
          style={[
            styles.header,
            {
              color: colors.text,
              fontSize: fontSizes.title,
            },
          ]}
        >
          Comparador de precios
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: colors.secondaryText,
              fontSize: fontSizes.subtitle,
            },
          ]}
        >
          Busca un medicamento o elige uno de tus medicamentos.
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
              {
                color: colors.text,
                fontSize: fontSizes.normal,
              },
            ]}
            placeholder="Ej: Paracetamol"
            placeholderTextColor={colors.secondaryText}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
        </View>

        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: colors.primary }]}
          onPress={handleSearch}
          disabled={loading}
        >
          <Text style={[styles.searchButtonText, { fontSize: fontSizes.button }]}>
            {loading ? 'Buscando...' : 'Buscar ofertas'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.myMedicinesButton, { backgroundColor: '#2D9CDB' }]}
          onPress={onGoMyMedicines}
          activeOpacity={0.85}
        >
          <View style={styles.myMedicinesButtonContent}>
            <MaterialCommunityIcons
              name="pill-multiple"
              size={38}
              color="#FFFFFF"
              style={styles.myMedicinesIcon}
            />

            <Text
              style={[
                styles.myMedicinesText,
                {
                  fontSize: fontSizes.normal + 6,
                },
              ]}
            >
              Mis medicamentos
            </Text>

            <Ionicons name="chevron-forward" size={28} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text
              style={[
                styles.loadingText,
                {
                  color: colors.secondaryText,
                  fontSize: fontSizes.normal,
                },
              ]}
            >
              Buscando ofertas...
            </Text>
          </View>
        ) : (
          <FlatList
            data={offers}
            keyExtractor={(item, index) =>
              `${item.pharmacy}-${item.medicineName}-${item.price}-${index}`
            }
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: 100 + insets.bottom },
            ]}
            ListEmptyComponent={
              searched ? (
                <View style={styles.centerContent}>
                  <Ionicons
                    name="medkit-outline"
                    size={48}
                    color={colors.secondaryText}
                  />

                  <Text
                    style={[
                      styles.emptyText,
                      {
                        color: colors.secondaryText,
                        fontSize: fontSizes.normal,
                      },
                    ]}
                  >
                    No se encontraron ofertas disponibles para ese medicamento.
                  </Text>
                </View>
              ) : null
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
                {
                  color: colors.text,
                  fontSize: fontSizes.small,
                },
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
                {
                  color: '#E74C3C',
                  fontSize: fontSizes.small,
                },
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
                {
                  color: '#F39C12',
                  fontSize: fontSizes.small,
                },
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
                {
                  color: colors.text,
                  fontSize: fontSizes.small,
                },
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

export default OffersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
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
    marginBottom: 12,
  },

  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  myMedicinesButton: {
    borderRadius: 26,
    minHeight: 95,
    justifyContent: 'center',
    paddingHorizontal: 22,
    marginBottom: 20,
    alignSelf: 'center',
    width: '100%',
    elevation: 6,
  },

  myMedicinesButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  myMedicinesIcon: {
    marginRight: 14,
  },

  myMedicinesText: {
    flex: 1,
    color: '#FFFFFF',
    fontWeight: '900',
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

  bestPriceRow: {
    backgroundColor: '#EAF8EE',
  },

  bestBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#42B65A',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  bestBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    marginLeft: 5,
    fontSize: 12,
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

  pharmacy: {
    fontWeight: '700',
  },

  availableText: {
    marginTop: 4,
    fontWeight: '800',
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  price: {
    fontWeight: '900',
    marginRight: 5,
  },

  openHint: {
    marginTop: 8,
    fontWeight: '700',
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