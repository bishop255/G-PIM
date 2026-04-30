import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useInventory } from '../../hook/useInventory';

const PACIENTE_ID_DEMO = 'demo-paciente-001';

const MedicineDetailScreen = ({ medicine, onBack, onEdit }) => {
  const { deleteMedicine, consumeDose } = useInventory(PACIENTE_ID_DEMO);

  const getRemainingDays = () => {
    const stock = Number(medicine.currentStock || 0);
    const dose = Number(medicine.dailyDose || 0);

    if (stock <= 0) return 0;
    if (dose <= 0) return null;

    return Math.floor(stock / dose);
  };

  const getStatus = () => {
    const stock = Number(medicine.currentStock || 0);
    const minStock = Number(medicine.minStock || 0);

    if (stock <= 0) {
      return {
        label: 'Sin stock',
        color: '#E74C3C',
        background: '#FDECEC',
      };
    }

    if (stock <= minStock) {
      return {
        label: 'Stock crítico',
        color: '#F39C12',
        background: '#FFF4E5',
      };
    }

    if (stock <= minStock * 1.5) {
      return {
        label: 'Bajo stock',
        color: '#D68910',
        background: '#FFF8E1',
      };
    }

    return {
      label: 'Stock suficiente',
      color: '#27AE60',
      background: '#EAF8EE',
    };
  };

  const getCategoryIcon = () => {
    switch (medicine.category) {
      case 'Tableta':
        return 'pill';
      case 'Jarabe':
        return 'bottle-tonic';
      case 'Inyección':
        return 'needle';
      case 'Otro':
        return 'medical-bag';
      default:
        return 'pill';
    }
  };

  const getStockPercentage = () => {
    const stock = Number(medicine.currentStock || 0);
    const minStock = Number(medicine.minStock || 1);

    const percentage = (stock / minStock) * 100;

    return Math.min(Math.max(percentage, 0), 100);
  };

  const getStockLevel = () => {
    const percentage = getStockPercentage();

    if (percentage <= 30) {
      return {
        label: 'Crítico',
        color: '#E74C3C',
        message: 'Nivel peligroso. Se recomienda reponer cuanto antes.',
      };
    }

    if (percentage <= 70) {
      return {
        label: 'Bajo',
        color: '#D68910',
        message: 'Stock bajo. Conviene planificar una reposición.',
      };
    }

    return {
      label: 'Seguro',
      color: '#27AE60',
      message: 'Stock en rango seguro.',
    };
  };

  const getEstimatedDate = () => {
    if (remainingDays === null) return null;

    const date = new Date();
    date.setDate(date.getDate() + remainingDays);

    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'long',
    });
  };

  const remainingDays = getRemainingDays();
  const status = getStatus();
  const stockPercentage = getStockPercentage();
  const stockLevel = getStockLevel();

  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: stockPercentage,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [stockPercentage]);

  const animatedWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const handleDelete = () => {
    Alert.alert('Eliminar medicamento', '¿Seguro que deseas eliminarlo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await deleteMedicine(medicine.id);
          onBack();
        },
      },
    ]);
  };

  const handleConsumeDose = async () => {
    await consumeDose(medicine);
    Alert.alert('Dosis registrada', 'Se descontó la dosis diaria del stock.');
    onBack();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>

        <Text style={styles.title}>{medicine.name}</Text>

        <TouchableOpacity onPress={onEdit}>
          <Ionicons name="create-outline" size={24} color="#2D3436" />
        </TouchableOpacity>
      </View>

      <View style={styles.mainCard}>
        <View style={[styles.iconCircle, { borderColor: status.color }]}>
          <MaterialCommunityIcons
            name={getCategoryIcon()}
            size={88}
            color={status.color}
          />
        </View>

        <View style={[styles.statusBadge, { backgroundColor: status.background }]}>
          <Text style={[styles.statusText, { color: status.color }]}>
            {status.label}
          </Text>
        </View>

        <Text style={styles.remainingText}>
          {remainingDays === null
            ? 'Dosis diaria no definida'
            : remainingDays === 1
            ? 'Se acaba en 1 día'
            : `Se acaba en ${remainingDays} días`}
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Nivel de seguridad del stock</Text>

            <View style={[styles.levelBadge, { backgroundColor: stockLevel.color }]}>
              <Text style={styles.levelBadgeText}>{stockLevel.label}</Text>
            </View>
          </View>

          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: animatedWidth,
                  backgroundColor: stockLevel.color,
                },
              ]}
            />
          </View>

          <Text style={[styles.progressPercent, { color: stockLevel.color }]}>
            {Math.round(stockPercentage)}%
          </Text>
        </View>

        <View style={[styles.alertBox, { backgroundColor: status.background }]}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={stockLevel.color}
          />
          <Text style={[styles.alertText, { color: stockLevel.color }]}>
            {stockLevel.message}
          </Text>
        </View>

        {getEstimatedDate() && (
          <Text style={styles.estimatedDate}>
            Fecha estimada de agotamiento: {getEstimatedDate()}
          </Text>
        )}

        <Text style={styles.categoryText}>
          Categoría: {medicine.category || 'No definida'}
        </Text>

        <View style={styles.stockRow}>
          <View style={styles.stockBox}>
            <Text style={styles.stockNumber}>{medicine.currentStock ?? 0}</Text>
            <Text style={styles.stockLabel}>Stock actual</Text>
          </View>

          <View style={styles.stockBox}>
            <Text style={styles.stockNumber}>{medicine.minStock ?? 0}</Text>
            <Text style={styles.stockLabel}>Stock mínimo</Text>
          </View>

          <View style={styles.stockBox}>
            <Text style={styles.stockNumber}>{medicine.dailyDose ?? 0}</Text>
            <Text style={styles.stockLabel}>Dosis diaria</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.consumeButton} onPress={handleConsumeDose}>
          <Ionicons name="remove-circle-outline" size={22} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Consumir dosis</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.restockButton}>
          <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Reponer stock</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Ionicons name="create-outline" size={22} color="#2D3436" />
          <Text style={styles.secondaryButtonText}>Editar medicamento</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Eliminar medicamento</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default MedicineDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 20,
    paddingTop: 55,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    color: '#2D3436',
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    alignItems: 'center',
    marginTop: 24,
    elevation: 3,
  },
  iconCircle: {
    width: 145,
    height: 145,
    borderRadius: 34,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  statusBadge: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '800',
  },
  remainingText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2D3436',
    marginTop: 14,
  },
  progressContainer: {
    width: '100%',
    marginTop: 18,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#636E72',
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  levelBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  progressBarBackground: {
    width: '100%',
    height: 12,
    backgroundColor: '#EEF2F3',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 999,
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '900',
    marginTop: 8,
    textAlign: 'center',
  },
  alertBox: {
    width: '100%',
    marginTop: 16,
    padding: 13,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '800',
  },
  estimatedDate: {
    marginTop: 12,
    fontSize: 13,
    color: '#636E72',
    fontWeight: '700',
    textAlign: 'center',
  },
  categoryText: {
    marginTop: 8,
    fontSize: 13,
    color: '#636E72',
    fontWeight: '700',
  },
  stockRow: {
    flexDirection: 'row',
    marginTop: 22,
    width: '100%',
    justifyContent: 'space-between',
  },
  stockBox: {
    width: '31%',
    backgroundColor: '#F7F7F7',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  stockNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2D3436',
  },
  stockLabel: {
    fontSize: 11,
    color: '#636E72',
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
  actions: {
    marginTop: 20,
  },
  consumeButton: {
    backgroundColor: '#42B65A',
    borderRadius: 18,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 3,
  },
  restockButton: {
    backgroundColor: '#2D9CDB',
    borderRadius: 18,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 3,
  },
  editButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DFE6E9',
  },
    deleteButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 18,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
},
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#2D3436',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 8,
  },
});