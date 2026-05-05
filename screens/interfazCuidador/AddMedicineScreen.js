import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTheme } from '../../theme/theme';
import { useInventory } from '../../hook/useInventory';

const PACIENTE_ID_DEMO = 'demo-paciente-001';

const categories = ['Tableta', 'Jarabe', 'Inyección', 'Otro'];

const AddMedicineScreen = ({ settings, onCancel, onSaved }) => {
  const { addMedicine } = useInventory(PACIENTE_ID_DEMO);
  const { colors, fontSizes } = getTheme(settings);

  const [name, setName] = useState('');
  const [currentStock, setCurrentStock] = useState('');
  const [minStock, setMinStock] = useState('');
  const [dailyDose, setDailyDose] = useState('');
  const [category, setCategory] = useState('Tableta');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Campo requerido', 'Ingresa el nombre del medicamento.');
      return;
    }

    if (!currentStock.trim() || isNaN(Number(currentStock))) {
      Alert.alert('Dato inválido', 'Ingresa una cantidad inicial válida.');
      return;
    }

    if (!minStock.trim() || isNaN(Number(minStock))) {
      Alert.alert('Dato inválido', 'Ingresa un stock mínimo válido.');
      return;
    }

    if (!dailyDose.trim() || isNaN(Number(dailyDose))) {
      Alert.alert('Dato inválido', 'Ingresa una dosis diaria válida.');
      return;
    }

    try {
      setSaving(true);

      await addMedicine({
        name: name.trim(),
        currentStock: Number(currentStock),
        minStock: Number(minStock),
        dailyDose: Number(dailyDose),
        category,
      });

      Alert.alert('Éxito', 'Medicamento agregado correctamente.');

      setName('');
      setCurrentStock('');
      setMinStock('');
      setDailyDose('');
      setCategory('Tableta');

      onSaved?.();
    } catch (error) {
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
          <Text
            style={[
              styles.label,
              { color: colors.text, fontSize: fontSizes.normal },
            ]}
          >
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

          <Text
            style={[
              styles.label,
              { color: colors.text, fontSize: fontSizes.normal },
            ]}
          >
            Cantidad inicial
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
            placeholder="Ej: 60"
            placeholderTextColor={colors.secondaryText}
            keyboardType="numeric"
            value={currentStock}
            onChangeText={setCurrentStock}
          />

          <Text
            style={[
              styles.label,
              { color: colors.text, fontSize: fontSizes.normal },
            ]}
          >
            Stock mínimo
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
            placeholder="Ej: 10"
            placeholderTextColor={colors.secondaryText}
            keyboardType="numeric"
            value={minStock}
            onChangeText={setMinStock}
          />

          <Text
            style={[
              styles.label,
              { color: colors.text, fontSize: fontSizes.normal },
            ]}
          >
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

          <Text
            style={[
              styles.label,
              { color: colors.text, fontSize: fontSizes.normal },
            ]}
          >
            Categoría
          </Text>

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

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 30,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  title: {
    fontWeight: '800',
  },
  form: {
    borderRadius: 24,
    padding: 20,
    elevation: 2,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  label: {
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    marginBottom: 12,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontWeight: '600',
  },
  saveButton: {
    marginTop: 18,
    borderRadius: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    marginLeft: 8,
  },
  cancelButton: {
    marginTop: 12,
    borderRadius: 16,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});

export default AddMedicineScreen;