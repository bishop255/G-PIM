import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getTheme } from '../../theme/theme';
import { useInventory } from '../../hook/useInventory';

// URL de la API publicada con Google Apps Script
const API_URL = 'https://script.google.com/macros/s/AKfycbxVlvaQ1NE76H2ryldf3rTl67__-e7cuF5UGAWmoLo0NfOQOpxPhusjlzliF-wRPJfjBA/exec';

const MyMedicinesOffersScreen = ({ patientId, settings, onBack }) => {
  const { colors, fontSizes } = getTheme(settings);

  // Obtener medicamentos del paciente
  const { medicines } = useInventory(patientId);

  // Medicamento actualmente abierto
  const [expandedMedicine, setExpandedMedicine] = useState('');

  // Ofertas del medicamento abierto
  const [offers, setOffers] = useState([]);

  // Estado de carga
  const [loading, setLoading] = useState(false);

  // Obtener nombres únicos de medicamentos
  const uniqueMedicines = useMemo(() => {
    const names = medicines
      .map((item) => item.name?.trim())
      .filter(Boolean);

    return [...new Set(names)];
  }, [medicines]);

  // Consultar API para el medicamento seleccionado
  const fetchOffers = async (medicineName) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}?nombre_medicamento=${encodeURIComponent(medicineName)}&top=3`
      );

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Respuesta inválida de la API');
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

  // Abrir o cerrar un medicamento
  const handleToggleMedicine = async (medicineName) => {
    // Si ya estaba abierto, cerrarlo
    if (expandedMedicine === medicineName) {
      setExpandedMedicine('');
      setOffers([]);
      return;
    }

    // Si se selecciona otro, abrirlo y consultar sus ofertas
    setExpandedMedicine(medicineName);
    setOffers([]);
    await fetchOffers(medicineName);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Barra superior */}
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

      {/* Título */}
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
        Toca un medicamento para ver en qué farmacias está más económico.
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
                {/* Tarjeta del medicamento */}
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

                {/* Contenido desplegado debajo del medicamento seleccionado */}
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
                          Buscando ofertas...
                        </Text>
                      </View>
                    ) : offers.length > 0 ? (
                      offers.map((item, offerIndex) => {
                        const isBest = offerIndex === 0;

                        return (
                          <View
                            key={`${item.id_oferta || offerIndex}`}
                            style={[
                              styles.offerCard,
                              isBest && styles.bestPriceRow,
                            ]}
                          >
                            <View style={styles.offerHeader}>
                              <Text
                                style={[
                                  styles.offerPharmacy,
                                  {
                                    color: colors.text,
                                    fontSize: fontSizes.normal,
                                  },
                                ]}
                              >
                                {item.nombre_farmacia}
                              </Text>

                              <View style={styles.priceContainer}>
                                <Text
                                  style={[
                                    styles.offerPrice,
                                    {
                                      color: isBest ? colors.primary : colors.text,
                                      fontSize: fontSizes.normal,
                                    },
                                  ]}
                                >
                                  ${item.precio}
                                </Text>

                                {isBest && (
                                  <Ionicons
                                    name="star"
                                    size={16}
                                    color="#F1C40F"
                                  />
                                )}
                              </View>
                            </View>

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
                                Esta es la farmacia más económica.
                              </Text>
                            )}
                          </View>
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
                          No se encontraron ofertas para este medicamento.
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
  scrollContent: {
    paddingBottom: 30,
  },
  medicineBlock: {
    marginBottom: 14,
  },
  medicineCard: {
    width: '100%',
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 5,
  },
  medicineCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  medicineCardText: {
    flex: 1,
    fontWeight: '800',
    marginLeft: 14,
    marginRight: 10,
  },
  offersContainer: {
    marginTop: 10,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  offerCard: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offerPharmacy: {
    fontWeight: '700',
    flex: 1,
    marginRight: 10,
  },
  offerPrice: {
    fontWeight: '700',
    marginRight: 5,
  },
  bestPriceRow: {
    backgroundColor: '#EAF8EE',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bestText: {
    marginTop: 6,
    fontWeight: '700',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  loadingText: {
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
  },
});