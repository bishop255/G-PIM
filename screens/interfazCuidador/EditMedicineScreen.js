import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTheme } from '../../theme/theme';
import { useInventory } from '../../hook/useInventory';

const PACIENTE_ID_DEMO = 'demo-paciente-001';
const categories = ['Tableta', 'Jarabe', 'Inyección', 'Otro'];

const EditMedicineScreen = ({ settings, medicine, onCancel, onSaved }) => {
  const { updateMedicine } = useInventory(PACIENTE_ID_DEMO);
  const { colors, fontSizes } = getTheme(settings);

  const inputBackground = colors.isDark ? '#2A2A2A' : '#EFEFEF';

  const [name, setName] = useState(medicine?.name || '');
  const [currentStock, setCurrentStock] = useState(String(medicine?.currentStock ?? ''));
  const [minStock, setMinStock] = useState(String(medicine?.minStock ?? ''));
  const [dailyDose, setDailyDose] = useState(String(medicine?.dailyDose ?? ''));
  const [category, setCategory] = useState(medicine?.category || 'Tableta');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!medicine?.id) {
      Alert.alert('Error', 'No se encontró el medicamento seleccionado.');
      return;
    }

    if (!name.trim()) {
      Alert.alert('Campo requerido', 'Ingresa el nombre del medicamento.');
      return;
    }

    try {
      setSaving(true);

      await updateMedicine(medicine.id, {
        name: name.trim(),
        currentStock: Number(currentStock) || 0,
        minStock: Number(minStock) || 0,
        dailyDose: Number(dailyDose) || 0,
        category,
      });

      Alert.alert('Éxito', 'Medicamento actualizado correctamente.');
      onSaved?.();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el medicamento.');
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
            Editar medicamento
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
                backgroundColor: inputBackground,
                color: colors.text,
                fontSize: fontSizes.normal,
              },
            ]}
            placeholder="Ej: Omeprazol"
            placeholderTextColor={colors.secondaryText}
            value={name}
            onChangeText={setName}
          />

          <Text style={[styles.label, { color: colors.text, fontSize: fontSizes.normal }]}>
            Cantidad actual
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: inputBackground,
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

          <Text style={[styles.label, { color: colors.text, fontSize: fontSizes.normal }]}>
            Stock mínimo
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: inputBackground,
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

          <Text style={[styles.label, { color: colors.text, fontSize: fontSizes.normal }]}>
            Dosis diaria
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: inputBackground,
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

          <Text style={[styles.label, { color: colors.text, fontSize: fontSizes.normal }]}>
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
                        : inputBackground,
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
            <Text style={[styles.saveButtonText, { fontSize: fontSizes.button }]}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: colors.danger }]}
            onPress={onCancel}
          >
            <Text style={[styles.cancelButtonText, { fontSize: fontSizes.button }]}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default EditMedicineScreen;

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
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  cancelButton: {
    marginTop: 12,
    borderRadius: 16,
    paddingVertical: 15,
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