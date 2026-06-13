import React, { useState } from 'react';
import {
  View,
  Text,
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
import { styles } from '../../styles/interfazCuidador/OffersScreen.styles';
import { getTheme } from '../../theme/theme';
import { useInventory } from '../../hook/useInventory';

const API_URL = 'http://192.168.100.10:3001/api/prices';

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
              { color: colors.text, fontSize: fontSizes.header },
            ]}
          >
            Ofertas
          </Text>

          <View style={{ width: 24 }} />
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
          style={[styles.myMedicinesButton, { backgroundColor: '#42B65A' }]}
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

