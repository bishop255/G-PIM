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

// 🔥 DATA SIMULADA (luego esto puede venir de API)
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

const OffersScreen = ({ onBack, onGoInventory, onGoAlerts  }) => {
  
  const getBestPrice = (prices) => {
    return prices.reduce((min, item) =>
      item.price < min.price ? item : min
    );
  };

  const renderItem = ({ item }) => {
    const best = getBestPrice(item.prices);

    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <MaterialCommunityIcons name="pill" size={26} color="#42B65A" />
          <Text style={styles.medicineName}>{item.name}</Text>
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
              <Text style={styles.pharmacy}>{p.pharmacy}</Text>

              <View style={styles.priceContainer}>
                <Text style={[styles.price, isBest && styles.bestPrice]}>
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
    <View style={styles.container}>
      
      {/* 🔝 HEADER */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>

        <Text style={styles.logoText}>Ofertas</Text>

        <Ionicons name="cart" size={24} color="#F39C12" />
      </View>

      <Text style={styles.header}>Comparador de precios</Text>
      <Text style={styles.subtitle}>
        Encuentra el mejor precio disponible.
      </Text>

      {/* 📋 LISTA */}
      <FlatList
        data={mockData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* 🔽 MENÚ INFERIOR */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={onGoInventory}>
          <Ionicons name="home-outline" size={24} color="#2D3436" />
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress = {onGoAlerts}>
          <Ionicons name="alert-circle-outline" size={24} color="#E74C3C" />
          <Text style={styles.navText}>Alertas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="cart" size={24} color="#F39C12" />
          <Text style={[styles.navText, { color: '#F39C12' }]}>
            Ofertas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#2D3436" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>

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
    fontSize: 22,
    fontWeight: '800',
    color: '#2D3436',
  },

  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#2D3436',
  },

  subtitle: {
    fontSize: 15,
    color: '#636E72',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  medicineName: {
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 10,
    color: '#2D3436',
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

  pharmacy: {
    fontSize: 14,
    color: '#2D3436',
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  price: {
    fontSize: 14,
    fontWeight: '700',
    marginRight: 5,
  },

  bestPrice: {
    color: '#27AE60',
  },

  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 75,
    backgroundColor: '#FFFFFF',
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
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
  },
});

export default OffersScreen;