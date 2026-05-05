import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getTheme } from '../../theme/theme';

const mockData = [
  {
    id: '1',
    name: 'Paracetamol',
    prices: [
      { pharmacy: 'Cruz Verde', price: 3500 },
      { pharmacy: 'Inkafarma', price: 3200 },
      { pharmacy: 'Mifarma', price: 3800 },
    ],
  },
  {
    id: '2',
    name: 'Ibuprofeno',
    prices: [
      { pharmacy: 'Cruz Verde', price: 5000 },
      { pharmacy: 'Inkafarma', price: 4800 },
      { pharmacy: 'Mifarma', price: 5200 },
    ],
  },
];

const OffersScreen = ({ settings, onBack, onGoInventory, onGoAlerts }) => {
  const { colors, fontSizes } = getTheme(settings);

  const getBestPrice = (prices) => {
    return prices.reduce((min, item) =>
      item.price < min.price ? item : min
    );
  };

  const renderItem = ({ item }) => {
    const best = getBestPrice(item.prices);

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
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
            {item.name}
          </Text>
        </View>

        {item.prices.map((p, index) => {
          const isBest = p.price === best.price;

          return (
            <View
              key={index}
              style={[
                styles.priceRow,
                isBest && styles.bestPriceRow,
              ]}
            >
              <Text
                style={[
                  styles.pharmacy,
                  { color: colors.text, fontSize: fontSizes.normal },
                ]}
              >
                {p.pharmacy}
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
                  ${p.price}
                </Text>

                {isBest && (
                  <Ionicons name="star" size={16} color="#F1C40F" />
                )}
              </View>
            </View>
          );
        })}
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
        Encuentra el mejor precio disponible.
      </Text>

      <FlatList
        data={mockData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

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

        <TouchableOpacity style={styles.navItem}>
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
    marginBottom: 20,
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
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  bestPriceRow: {
    backgroundColor: '#EAF8EE',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  pharmacy: {},
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontWeight: '700',
    marginRight: 5,
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