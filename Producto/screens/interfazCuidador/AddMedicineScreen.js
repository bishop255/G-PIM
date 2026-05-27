import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { getTheme } from '../../theme/theme';
import { styles } from '../../styles/interfazCuidador/AddMedicineScreen.styles';
import { useInventory } from '../../hook/useInventory';

const categories = [
  'Tableta / Cápsula',
  'Jarabe / Gotas',
  'Inyección',
  'Insumo médico',
];

const getStockUnitByCategory = (category) => {
  switch (category) {
    case 'Jarabe / Gotas':
      return 'mL';
    case 'Inyección':
      return 'dosis';
    case 'Tableta / Cápsula':
    case 'Insumo médico':
    default:
      return 'unidad';
  }
};

const getStockPlaceholder = (category) => {
  switch (category) {
    case 'Jarabe / Gotas':
      return 'Ej: 120';
    case 'Inyección':
      return 'Ej: 10';
    case 'Insumo médico':
      return 'Ej: 50';
    case 'Tableta / Cápsula':
    default:
      return 'Ej: 30';
  }
};

const getDosePlaceholder = (category) => {
  switch (category) {
    case 'Jarabe / Gotas':
      return 'Ej: 5';
    case 'Inyección':
      return 'Ej: 1';
    case 'Insumo médico':
      return 'Ej: 1';
    case 'Tableta / Cápsula':
    default:
      return 'Ej: 1 o 0.5';
  }
};

const AddMedicineScreen = ({ settings, onCancel, onSaved, patientId }) => {
  const { addMedicine } = useInventory(patientId);
  const { colors, fontSizes } = getTheme(settings);

  const [name, setName] = useState('');
  const [currentStock, setCurrentStock] = useState('');
  const [minStock, setMinStock] = useState('');
  const [doseAmount, setDoseAmount] = useState('');
  const [dailyDose, setDailyDose] = useState('');
  const [category, setCategory] = useState('Tableta / Cápsula');
  const [saving, setSaving] = useState(false);

  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [showTimePickerIndex, setShowTimePickerIndex] = useState(null);

  const stockUnit = getStockUnitByCategory(category);

  useEffect(() => {
    const doseNumber = Number(dailyDose);

    if (!doseNumber || doseNumber <= 0 || isNaN(doseNumber)) {
      setSchedules([]);
      return;
    }

    const limitedDose = Math.min(doseNumber, 6);

    setSchedules((prev) => {
      const newSchedules = [...prev];

      while (newSchedules.length < limitedDose) {
        newSchedules.push({
          hour: 8,
          minute: 0,
        });
      }

      return newSchedules.slice(0, limitedDose);
    });
  }, [dailyDose]);

  const showCategoryHelp = () => {
    Alert.alert(
      'Guía de categorías',
      'Tableta / Cápsula:\nPastillas, comprimidos o cápsulas. Puedes usar 0.5 si el paciente toma media pastilla.\n\n' +
        'Jarabe / Gotas:\nMedicamentos líquidos. Se miden en mL. Ejemplo: 5 mL por toma.\n\n' +
        'Inyección:\nLa medición para inyecciones se registra solo como dosis inyectables.\n\n' +
        'Insumo médico:\nPañales, guantes, gasas, tiras, mascarillas u otros elementos. Se manejan por unidades.'
    );
  };

  const formatTime = (schedule) => {
    const hour = String(schedule.hour).padStart(2, '0');
    const minute = String(schedule.minute).padStart(2, '0');

    return `${hour}:${minute}`;
  };

  const getDateFromSchedule = (schedule) => {
    const date = new Date();
    date.setHours(schedule.hour);
    date.setMinutes(schedule.minute);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
  };

  const handleTimeChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowTimePickerIndex(null);
    }

    if (!selectedDate || showTimePickerIndex === null) return;

    const hour = selectedDate.getHours();
    const minute = selectedDate.getMinutes();

    setSchedules((prev) =>
      prev.map((item, index) =>
        index === showTimePickerIndex ? { hour, minute } : item
      )
    );
  };

  const handleSave = async () => {
    if (!patientId) {
      Alert.alert('Error', 'No hay paciente seleccionado.');
      return;
    }

    if (!name.trim()) {
      Alert.alert('Campo requerido', 'Ingresa el nombre del medicamento.');
      return;
    }

    if (!currentStock.trim() || isNaN(Number(currentStock))) {
      Alert.alert('Dato inválido', `Ingresa una cantidad inicial válida en ${stockUnit}.`);
      return;
    }

    if (!minStock.trim() || isNaN(Number(minStock))) {
      Alert.alert('Dato inválido', `Ingresa un stock mínimo válido en ${stockUnit}.`);
      return;
    }

    if (!doseAmount.trim() || isNaN(Number(doseAmount))) {
      Alert.alert('Dato inválido', `Ingresa una cantidad por toma válida en ${stockUnit}.`);
      return;
    }

    if (!dailyDose.trim() || isNaN(Number(dailyDose))) {
      Alert.alert('Dato inválido', 'Ingresa una dosis diaria válida.');
      return;
    }

    const doseAmountNumber = Number(doseAmount);
    const doseNumber = Number(dailyDose);

    if (Number(currentStock) <= 0) {
      Alert.alert('Dato inválido', 'La cantidad inicial debe ser mayor a 0.');
      return;
    }

    if (Number(minStock) < 0) {
      Alert.alert('Dato inválido', 'El stock mínimo no puede ser negativo.');
      return;
    }

    if (doseAmountNumber <= 0) {
      Alert.alert('Dato inválido', 'La cantidad por toma debe ser mayor a 0.');
      return;
    }

    if (doseNumber <= 0) {
      Alert.alert('Dato inválido', 'La dosis diaria debe ser mayor a 0.');
      return;
    }

    if (doseNumber > 6) {
      Alert.alert(
        'Dosis muy alta',
        'Por seguridad, configura máximo 6 horarios por medicamento.'
      );
      return;
    }

    if (reminderEnabled && schedules.length !== doseNumber) {
      Alert.alert(
        'Horarios incompletos',
        'Configura un horario por cada dosis diaria.'
      );
      return;
    }

    try {
      setSaving(true);

      await addMedicine({
        name: name.trim(),
        currentStock: Number(currentStock),
        initialStock: Number(currentStock),
        minStock: Number(minStock),
        doseAmount: doseAmountNumber,
        dailyDose: doseNumber,
        category,
        stockUnit,
        reminderEnabled,
        schedules: reminderEnabled ? schedules : [],
      });

      Alert.alert('Éxito', 'Medicamento agregado correctamente.');

      setName('');
      setCurrentStock('');
      setMinStock('');
      setDoseAmount('');
      setDailyDose('');
      setCategory('Tableta / Cápsula');
      setReminderEnabled(true);
      setSchedules([]);

      onSaved?.();
    } catch (error) {
      console.error('Error guardando medicamento:', error);
      Alert.alert('Error', 'No se pudo guardar el medicamento.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.scrollContent,
        { backgroundColor: colors.background },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onCancel}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text
            style={[
              styles.title,
              { color: colors.text, fontSize: fontSizes.header },
            ]}
          >
            Añadir Medicamento
          </Text>

          <View style={{ width: 24 }} />
        </View>

        <View
          style={[
            styles.form,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.label, { color: colors.text, fontSize: fontSizes.normal }]}>
            Nombre
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.isDark ? '#2A2A2A' : '#EFEFEF',
                color: colors.text,
                fontSize: fontSizes.normal,
              },
            ]}
            placeholder="Ej: Omeprazol"
            placeholderTextColor={colors.secondaryText}
            value={name}
            onChangeText={setName}
          />

          <View style={styles.labelRow}>
            <Text style={[styles.label, { color: colors.text, fontSize: fontSizes.normal }]}>
              Categoría
            </Text>

            <TouchableOpacity style={styles.helpButton} onPress={showCategoryHelp}>
              <Ionicons name="help-circle-outline" size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.categoryContainer}>
            {categories.map((item) => {
              const selected = item === category;

              return (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor: selected
                        ? colors.primary
                        : colors.isDark
                        ? '#2A2A2A'
                        : '#EFEFEF',
                    },
                  ]}
                  onPress={() => setCategory(item)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      {
                        color: selected ? '#FFFFFF' : colors.text,
                        fontSize: fontSizes.normal,
                      },
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View
            style={[
              styles.unitBox,
              {
                backgroundColor: colors.isDark ? '#2A2A2A' : '#EAF8EE',
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            <Text
              style={[
                styles.unitText,
                { color: colors.text, fontSize: fontSizes.small },
              ]}
            >
              Esta categoría se manejará en: {stockUnit}
            </Text>
          </View>

          <Text style={[styles.label, { color: colors.text, fontSize: fontSizes.normal }]}>
            Cantidad inicial ({stockUnit})
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.isDark ? '#2A2A2A' : '#EFEFEF',
                color: colors.text,
                fontSize: fontSizes.normal,
              },
            ]}
            placeholder={getStockPlaceholder(category)}
            placeholderTextColor={colors.secondaryText}
            keyboardType="decimal-pad"
            value={currentStock}
            onChangeText={setCurrentStock}
          />

          <Text style={[styles.label, { color: colors.text, fontSize: fontSizes.normal }]}>
            Stock mínimo ({stockUnit})
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.isDark ? '#2A2A2A' : '#EFEFEF',
                color: colors.text,
                fontSize: fontSizes.normal,
              },
            ]}
            placeholder={category === 'Jarabe / Gotas' ? 'Ej: 20' : 'Ej: 5'}
            placeholderTextColor={colors.secondaryText}
            keyboardType="decimal-pad"
            value={minStock}
            onChangeText={setMinStock}
          />

          <Text style={[styles.label, { color: colors.text, fontSize: fontSizes.normal }]}>
            Cantidad por toma ({stockUnit})
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.isDark ? '#2A2A2A' : '#EFEFEF',
                color: colors.text,
                fontSize: fontSizes.normal,
              },
            ]}
            placeholder={getDosePlaceholder(category)}
            placeholderTextColor={colors.secondaryText}
            keyboardType="decimal-pad"
            value={doseAmount}
            onChangeText={setDoseAmount}
          />

          <Text
            style={[
              styles.helperText,
              { color: colors.secondaryText, fontSize: fontSizes.small },
            ]}
          >
            Ejemplo: 1 unidad, 0.5 media pastilla, 5 mL de jarabe o 1 dosis.
          </Text>

          <Text style={[styles.label, { color: colors.text, fontSize: fontSizes.normal }]}>
            Dosis diaria
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.isDark ? '#2A2A2A' : '#EFEFEF',
                color: colors.text,
                fontSize: fontSizes.normal,
              },
            ]}
            placeholder="Ej: 2"
            placeholderTextColor={colors.secondaryText}
            keyboardType="numeric"
            value={dailyDose}
            onChangeText={setDailyDose}
          />

          <View style={styles.reminderHeader}>
            <View style={styles.reminderTitleBox}>
              <Ionicons name="alarm-outline" size={22} color={colors.primary} />
              <Text
                style={[
                  styles.reminderTitle,
                  { color: colors.text, fontSize: fontSizes.normal },
                ]}
              >
                Horario de toma
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.switchButton,
                {
                  backgroundColor: reminderEnabled
                    ? colors.primary
                    : colors.isDark
                    ? '#2A2A2A'
                    : '#EFEFEF',
                },
              ]}
              onPress={() => setReminderEnabled((prev) => !prev)}
            >
              <Text
                style={[
                  styles.switchText,
                  { color: reminderEnabled ? '#FFFFFF' : colors.text },
                ]}
              >
                {reminderEnabled ? 'Activo' : 'Inactivo'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.helperText,
              { color: colors.secondaryText, fontSize: fontSizes.small },
            ]}
          >
            Se mostrará un horario por cada dosis diaria.
          </Text>

          {reminderEnabled && schedules.length > 0 && (
            <View style={styles.scheduleContainer}>
              {schedules.map((schedule, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.scheduleButton,
                    {
                      backgroundColor: colors.isDark ? '#2A2A2A' : '#F1F2F6',
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setShowTimePickerIndex(index)}
                >
                  <View>
                    <Text
                      style={[
                        styles.scheduleLabel,
                        { color: colors.secondaryText, fontSize: fontSizes.small },
                      ]}
                    >
                      Horario {index + 1}
                    </Text>

                    <Text
                      style={[
                        styles.scheduleTime,
                        { color: colors.text, fontSize: fontSizes.header },
                      ]}
                    >
                      {formatTime(schedule)}
                    </Text>
                  </View>

                  <Ionicons name="time-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {showTimePickerIndex !== null && (
            <DateTimePicker
              value={getDateFromSchedule(schedules[showTimePickerIndex])}
              mode="time"
              is24Hour
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimeChange}
            />
          )}

          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: colors.primary },
              saving && styles.buttonDisabled,
            ]}
            onPress={handleSave}
            disabled={saving}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text
              style={[
                styles.saveButtonText,
                { fontSize: fontSizes.button },
              ]}
            >
              {saving ? 'Guardando...' : 'Añadir medicamento'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: colors.danger }]}
            onPress={onCancel}
          >
            <Text
              style={[
                styles.cancelButtonText,
                { fontSize: fontSizes.button },
              ]}
            >
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddMedicineScreen;