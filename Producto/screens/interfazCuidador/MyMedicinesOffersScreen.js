import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Linking,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { getTheme } from '../../theme/theme';
import { styles } from '../../styles/interfazCuidador/OffersScreen.styles';
import { useInventory } from '../../hook/useInventory';

const API_URL = 'http://192.168.100.10:3001/api/prices';

const formatPrice = (price) => {
  const value = Number(price || 0);
  return value.toLocaleString('es-CL');
};

const getBestOfferByPharmacy = (items = []) => {
  const availableItems = items
    .filter((item) => item.available !== false)
    .sort((a, b) => Number(a.price || 0) - Number(b.price || 0));

  const bestByPharmacy = new Map();

  availableItems.forEach((item) => {
    const pharmacy = item.pharmacy || 'Farmacia';

    if (!bestByPharmacy.has(pharmacy)) {
      bestByPharmacy.set(pharmacy, item);
    }
  });

  return Array.from(bestByPharmacy.values())
    .sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
    .slice(0, 3);
};

const MyMedicinesOffersScreen = ({ patientId, settings, onBack }) => {
  const { colors, fontSizes } = getTheme(settings);
  const { medicines } = useInventory(patientId);

  const [expandedMedicine, setExpandedMedicine] = useState('');
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  const uniqueMedicines = useMemo(() => {
    const names = medicines
      .map((item) => item.name?.trim())
      .filter(Boolean);

    return [...new Set(names)];
  }, [medicines]);

  const openProductUrl = async (item) => {
    const url = item.productUrl || item.url;

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

  const fetchOffers = async (medicineName) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}?query=${encodeURIComponent(medicineName)}`
      );

      const data = await response.json();

      if (!data?.ok || !Array.isArray(data.results)) {
        throw new Error('Respuesta inválida de la API');
      }

      setOffers(getBestOfferByPharmacy(data.results));
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

  const handleToggleMedicine = async (medicineName) => {
    if (expandedMedicine === medicineName) {
      setExpandedMedicine('');
      setOffers([]);
      return;
    }

    setExpandedMedicine(medicineName);
    setOffers([]);
    await fetchOffers(medicineName);
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
          Mis medicamentos
        </Text>

        <MaterialCommunityIcons
          name="pill-multiple"
          size={24}
          color={colors.primary}
        />
      </View>

      <Text
        style={[
          styles.header,
          { color: colors.text, fontSize: fontSizes.title },
        ]}
      >
        Selecciona un medicamento
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: colors.secondaryText, fontSize: fontSizes.subtitle },
        ]}
      >
        Verás la mejor opción disponible por farmacia.
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {uniqueMedicines.length > 0 ? (
          uniqueMedicines.map((medicineName, index) => {
            const isExpanded = expandedMedicine === medicineName;

            return (
              <View key={`${medicineName}-${index}`} style={styles.medicineBlock}>
                <TouchableOpacity
                  style={[
                    styles.medicineCard,
                    {
                      backgroundColor: isExpanded ? '#2D9CDB' : colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => handleToggleMedicine(medicineName)}
                  activeOpacity={0.85}
                >
                  <View style={styles.medicineCardContent}>
                    <MaterialCommunityIcons
                      name="pill"
                      size={34}
                      color={isExpanded ? '#FFFFFF' : colors.primary}
                    />

                    <Text
                      style={[
                        styles.medicineCardText,
                        {
                          color: isExpanded ? '#FFFFFF' : colors.text,
                          fontSize: fontSizes.normal + 2,
                        },
                      ]}
                    >
                      {medicineName}
                    </Text>

                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-forward'}
                      size={24}
                      color={isExpanded ? '#FFFFFF' : colors.text}
                    />
                  </View>
                </TouchableOpacity>

                {isExpanded && (
                  <View
                    style={[
                      styles.offersContainer,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                  >
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
                          Buscando mejores precios...
                        </Text>
                      </View>
                    ) : offers.length > 0 ? (
                      offers.map((item, offerIndex) => {
                        const isBest = offerIndex === 0;

                        return (
                          <TouchableOpacity
                            key={`${item.pharmacy}-${item.medicineName}-${item.price}-${offerIndex}`}
                            activeOpacity={0.85}
                            onPress={() => openProductUrl(item)}
                            style={[
                              styles.offerCard,
                              {
                                borderColor: isBest ? colors.primary : colors.border,
                              },
                              isBest && styles.bestPriceRow,
                            ]}
                          >
                            {isBest && (
                              <View style={styles.bestBadge}>
                                <Ionicons name="star" size={13} color="#FFFFFF" />
                                <Text style={styles.bestBadgeText}>
                                  Mejor precio
                                </Text>
                              </View>
                            )}

                            <Text
                              style={[
                                styles.offerMedicine,
                                {
                                  color: colors.text,
                                  fontSize: fontSizes.normal,
                                },
                              ]}
                              numberOfLines={2}
                            >
                              {item.medicineName}
                            </Text>

                            <View style={styles.offerHeader}>
                              <View style={{ flex: 1 }}>
                                <Text
                                  style={[
                                    styles.offerPharmacy,
                                    {
                                      color: colors.text,
                                      fontSize: fontSizes.normal,
                                    },
                                  ]}
                                >
                                  {item.pharmacy}
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
                                    styles.offerPrice,
                                    {
                                      color: isBest ? colors.primary : colors.text,
                                      fontSize: fontSizes.normal + 3,
                                    },
                                  ]}
                                >
                                  ${formatPrice(item.price)}
                                </Text>

                                <Ionicons
                                  name={isBest ? 'star' : 'open-outline'}
                                  size={16}
                                  color={isBest ? '#F1C40F' : colors.text}
                                />
                              </View>
                            </View>

                            <Text
                              style={[
                                styles.openText,
                                {
                                  color: colors.secondaryText,
                                  fontSize: fontSizes.small,
                                },
                              ]}
                            >
                              Toca para ir al producto
                            </Text>

                            {isBest && (
                              <Text
                                style={[
                                  styles.bestText,
                                  {
                                    color: colors.primary,
                                    fontSize: fontSizes.small,
                                  },
                                ]}
                              >
                                Esta es la opción más económica disponible.
                              </Text>
                            )}
                          </TouchableOpacity>
                        );
                      })
                    ) : (
                      <View style={styles.centerContent}>
                        <Text
                          style={[
                            styles.emptyText,
                            {
                              color: colors.secondaryText,
                              fontSize: fontSizes.normal,
                            },
                          ]}
                        >
                          No se encontraron opciones disponibles para este medicamento.
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <View style={styles.centerContent}>
            <Text
              style={[
                styles.emptyText,
                { color: colors.secondaryText, fontSize: fontSizes.normal },
              ]}
            >
              No hay medicamentos registrados.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MyMedicinesOffersScreen;
