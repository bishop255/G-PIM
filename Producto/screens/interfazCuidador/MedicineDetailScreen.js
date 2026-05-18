import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getTheme } from '../../theme/theme';
import { useInventory } from '../../hook/useInventory';

const MedicineDetailScreen = ({ settings, medicine, onBack, onEdit, patientId }) => {
  const { deleteMedicine, replenishStock } = useInventory(patientId);
  const { colors, fontSizes } = getTheme(settings);

  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);

  const inputBackground = colors.isDark ? '#2A2A2A' : '#EFEFEF';

  const stockUnit = medicine.stockUnit || 'unidad';
  const doseAmount = Number(medicine.doseAmount || 1);
  const dailyDose = Number(medicine.dailyDose || 0);
  const dailyConsumption = doseAmount * dailyDose;

  const getRemainingDays = () => {
    const stock = Number(medicine.currentStock || 0);

    if (stock <= 0) return 0;
    if (dailyConsumption <= 0) return null;

    return Math.floor(stock / dailyConsumption);
  };

  const getStatus = () => {
    const stock = Number(medicine.currentStock || 0);
    const minStock = Number(medicine.minStock || 0);

    if (stock <= 0) {
      return { label: 'Sin stock', color: '#E74C3C', background: '#FDECEC' };
    }

    if (stock <= minStock) {
      return { label: 'Stock crítico', color: '#F39C12', background: '#FFF4E5' };
    }

    if (stock <= minStock * 1.5) {
      return { label: 'Bajo stock', color: '#D68910', background: '#FFF8E1' };
    }

    return { label: 'Stock suficiente', color: '#27AE60', background: '#EAF8EE' };
  };

  const getCategoryIcon = () => {
    switch (medicine.category) {
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

  const getStockPercentage = () => {
    const stock = Number(medicine.currentStock || 0);
    const initialStock = Number(medicine.initialStock || 1);
    const percentage = (stock / initialStock) * 100;

    return Math.min(Math.max(percentage, 0), 100);
  };

  const getStockLevel = () => {
    const stock = Number(medicine.currentStock || 0);
    const minStock = Number(medicine.minStock || 0);
    const percentage = getStockPercentage();

    if (stock < minStock) {
      return {
        label: 'Crítico',
        color: '#E74C3C',
        message: 'El stock está por debajo del mínimo establecido.',
      };
    }

    if (stock === minStock) {
      return {
        label: 'Bajo',
        color: '#F39C12',
        message: 'El stock llegó al mínimo establecido.',
      };
    }

    if (percentage <= 50) {
      return {
        label: 'Medio',
        color: '#D68910',
        message: 'El stock está a la mitad o menos de su capacidad inicial.',
      };
    }

    return {
      label: 'Seguro',
      color: '#27AE60',
      message: 'El stock está en un rango seguro.',
    };
  };

  const remainingDays = getRemainingDays();
  const status = getStatus();
  const stockPercentage = getStockPercentage();
  const stockLevel = getStockLevel();

  const getEstimatedDate = () => {
    if (remainingDays === null) return null;

    const date = new Date();
    date.setDate(date.getDate() + remainingDays);

    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'long',
    });
  };

  const formatSchedule = (schedule) => {
    const hour = String(schedule.hour).padStart(2, '0');
    const minute = String(schedule.minute).padStart(2, '0');

    return `${hour}:${minute}`;
  };

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

  const handleReplenish = async () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Error', `Ingresa una cantidad válida en ${stockUnit}`);
      return;
    }

    if (Number(amount) <= 0) {
      Alert.alert('Error', 'La cantidad debe ser mayor a 0');
      return;
    }

    setLoadingAction(true);

    await replenishStock(medicine.id, Number(amount));

    setLoadingAction(false);
    setModalVisible(false);
    setAmount('');

    Alert.alert('Stock actualizado', `Se agregaron ${amount} ${stockUnit}.`);
    onBack();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text
          style={[
            styles.title,
            { color: colors.text, fontSize: fontSizes.header },
          ]}
        >
          {medicine.name}
        </Text>

        <TouchableOpacity onPress={onEdit}>
          <Ionicons name="create-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.mainCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={[styles.iconCircle, { borderColor: status.color }]}>
          <MaterialCommunityIcons
            name={getCategoryIcon()}
            size={88}
            color={status.color}
          />
        </View>

        <View style={[styles.statusBadge, { backgroundColor: status.background }]}>
          <Text
            style={[
              styles.statusText,
              { color: status.color, fontSize: fontSizes.normal },
            ]}
          >
            {status.label}
          </Text>
        </View>

        <Text
          style={[
            styles.remainingText,
            { color: colors.text, fontSize: fontSizes.header - 2 },
          ]}
        >
          {remainingDays === null
            ? 'Consumo diario no definido'
            : remainingDays === 1
            ? 'Se acaba en 1 día'
            : `Se acaba en ${remainingDays} días`}
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text
              style={[
                styles.progressLabel,
                { color: colors.secondaryText, fontSize: fontSizes.normal },
              ]}
            >
              Nivel de seguridad del stock
            </Text>

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

          <Text
            style={[
              styles.progressPercent,
              { color: stockLevel.color, fontSize: fontSizes.normal },
            ]}
          >
            {Math.round(stockPercentage)}%
          </Text>
        </View>

        <View style={[styles.alertBox, { backgroundColor: status.background }]}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={stockLevel.color}
          />
          <Text
            style={[
              styles.alertText,
              { color: stockLevel.color, fontSize: fontSizes.normal },
            ]}
          >
            {stockLevel.message}
          </Text>
        </View>

        {getEstimatedDate() && (
          <Text
            style={[
              styles.estimatedDate,
              { color: colors.secondaryText, fontSize: fontSizes.small },
            ]}
          >
            Fecha estimada de agotamiento: {getEstimatedDate()}
          </Text>
        )}

        <Text
          style={[
            styles.categoryText,
            { color: colors.secondaryText, fontSize: fontSizes.small },
          ]}
        >
          Categoría: {medicine.category || 'No definida'}
        </Text>

        <View style={styles.stockRow}>
          <View style={[styles.stockBox, { backgroundColor: colors.background }]}>
            <Text
              style={[
                styles.stockNumber,
                { color: colors.text, fontSize: fontSizes.header },
              ]}
            >
              {medicine.currentStock ?? 0}
            </Text>
            <Text
              style={[
                styles.stockLabel,
                { color: colors.secondaryText, fontSize: fontSizes.small },
              ]}
            >
              Stock actual ({stockUnit})
            </Text>
          </View>

          <View style={[styles.stockBox, { backgroundColor: colors.background }]}>
            <Text
              style={[
                styles.stockNumber,
                { color: colors.text, fontSize: fontSizes.header },
              ]}
            >
              {medicine.minStock ?? 0}
            </Text>
            <Text
              style={[
                styles.stockLabel,
                { color: colors.secondaryText, fontSize: fontSizes.small },
              ]}
            >
              Stock mínimo ({stockUnit})
            </Text>
          </View>

          <View style={[styles.stockBox, { backgroundColor: colors.background }]}>
            <Text
              style={[
                styles.stockNumber,
                { color: colors.text, fontSize: fontSizes.header },
              ]}
            >
              {dailyDose}
            </Text>
            <Text
              style={[
                styles.stockLabel,
                { color: colors.secondaryText, fontSize: fontSizes.small },
              ]}
            >
              Tomas diarias
            </Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={[styles.infoBox, { backgroundColor: colors.background }]}>
            <Ionicons name="medkit-outline" size={22} color={colors.text} />
            <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>
              Cantidad por toma
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {doseAmount} {stockUnit}
            </Text>
          </View>

          <View style={[styles.infoBox, { backgroundColor: colors.background }]}>
            <Ionicons name="calculator-outline" size={22} color={colors.text} />
            <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>
              Consumo diario
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {dailyConsumption || 0} {stockUnit}
            </Text>
          </View>
        </View>

        {Array.isArray(medicine.schedules) && medicine.schedules.length > 0 && (
          <View style={styles.scheduleSection}>
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.text, fontSize: fontSizes.normal },
              ]}
            >
              Horarios de toma
            </Text>

            <View style={styles.scheduleList}>
              {medicine.schedules.map((schedule, index) => (
                <View
                  key={index}
                  style={[
                    styles.schedulePill,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <Ionicons name="time-outline" size={18} color={colors.text} />
                  <Text style={[styles.scheduleText, { color: colors.text }]}>
                    {formatSchedule(schedule)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.restockButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
          <Text style={[styles.primaryButtonText, { fontSize: fontSizes.button }]}>
            Reponer stock
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.editButton,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={onEdit}
        >
          <Ionicons name="create-outline" size={22} color={colors.text} />
          <Text
            style={[
              styles.secondaryButtonText,
              { color: colors.text, fontSize: fontSizes.button },
            ]}
          >
            Editar medicamento
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
          <Text style={[styles.primaryButtonText, { fontSize: fontSizes.button }]}>
            Eliminar medicamento
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: colors.text, fontSize: fontSizes.header },
              ]}
            >
              Reponer stock
            </Text>

            <Text
              style={[
                styles.modalSubtitle,
                { color: colors.secondaryText, fontSize: fontSizes.normal },
              ]}
            >
              Ingresa la cantidad a agregar en {stockUnit}.
            </Text>

            <TextInput
              placeholder={`Cantidad a agregar (${stockUnit})`}
              placeholderTextColor={colors.secondaryText}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              style={[
                styles.input,
                {
                  backgroundColor: inputBackground,
                  color: colors.text,
                  borderColor: colors.border,
                  fontSize: fontSizes.normal,
                },
              ]}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text
                  style={[
                    styles.cancelText,
                    { color: colors.secondaryText, fontSize: fontSizes.normal },
                  ]}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  loadingAction && { opacity: 0.6 },
                ]}
                onPress={handleReplenish}
                disabled={loadingAction}
              >
                <Text style={[styles.confirmText, { fontSize: fontSizes.normal }]}>
                  {loadingAction ? 'Agregando...' : 'Agregar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default MedicineDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontWeight: '800',
  },
  mainCard: {
    borderRadius: 28,
    padding: 22,
    alignItems: 'center',
    marginTop: 24,
    elevation: 3,
    borderWidth: 1,
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
    fontWeight: '800',
  },
  remainingText: {
    fontWeight: '800',
    marginTop: 14,
    textAlign: 'center',
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
    fontWeight: '800',
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
    fontWeight: '800',
  },
  estimatedDate: {
    marginTop: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  categoryText: {
    marginTop: 8,
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
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  stockNumber: {
    fontWeight: '900',
  },
  stockLabel: {
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
  infoGrid: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  infoBox: {
    width: '48%',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
  },
  infoLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  infoValue: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  scheduleSection: {
    width: '100%',
    marginTop: 18,
  },
  sectionTitle: {
    fontWeight: '900',
    marginBottom: 10,
  },
  scheduleList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  schedulePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  scheduleText: {
    marginLeft: 6,
    fontWeight: '900',
    fontSize: 14,
  },
  actions: {
    marginTop: 20,
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
    borderRadius: 18,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
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
    fontWeight: '800',
    marginLeft: 8,
  },
  secondaryButtonText: {
    fontWeight: '800',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },
  modalTitle: {
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    padding: 12,
  },
  cancelText: {
    fontWeight: '700',
  },
  confirmButton: {
    backgroundColor: '#2D9CDB',
    padding: 12,
    borderRadius: 12,
  },
  confirmText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});