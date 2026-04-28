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
    import { useInventory } from '../../hook/useInventory';

    const PACIENTE_ID_DEMO = 'demo-paciente-001';
    const categories = ['Tableta', 'Jarabe', 'Inyección', 'Otro'];

    const EditMedicineScreen = ({ medicine, onCancel, onSaved }) => {
    const { updateMedicine } = useInventory(PACIENTE_ID_DEMO);

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
        <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
            <View style={styles.topBar}>
            <TouchableOpacity onPress={onCancel}>
                <Ionicons name="arrow-back" size={24} color="#2D3436" />
            </TouchableOpacity>

            <Text style={styles.title}>Editar medicamento</Text>

            <View style={{ width: 24 }} />
            </View>

            <View style={styles.form}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />

            <Text style={styles.label}>Cantidad actual</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={currentStock}
                onChangeText={setCurrentStock}
            />

            <Text style={styles.label}>Stock mínimo</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={minStock}
                onChangeText={setMinStock}
            />

            <Text style={styles.label}>Dosis diaria</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={dailyDose}
                onChangeText={setDailyDose}
            />

            <Text style={styles.label}>Categoría</Text>
            <View style={styles.categoryContainer}>
                {categories.map((item) => {
                const selected = item === category;

                return (
                    <TouchableOpacity
                    key={item}
                    style={[styles.categoryButton, selected && styles.categoryButtonSelected]}
                    onPress={() => setCategory(item)}
                    >
                    <Text style={[styles.categoryText, selected && styles.categoryTextSelected]}>
                        {item}
                    </Text>
                    </TouchableOpacity>
                );
                })}
            </View>

            <TouchableOpacity
                style={[styles.saveButton, saving && styles.buttonDisabled]}
                onPress={handleSave}
                disabled={saving}
            >
                <Text style={styles.saveButtonText}>
                {saving ? 'Guardando...' : 'Guardar cambios'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            </View>
        </View>
        </ScrollView>
    );
    };

    const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        backgroundColor: '#F7F7F7',
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
        fontSize: 22,
        fontWeight: '800',
        color: '#2D3436',
    },
    form: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        elevation: 2,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2D3436',
        marginBottom: 8,
        marginTop: 10,
    },
    input: {
        backgroundColor: '#EFEFEF',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: '#2D3436',
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
        backgroundColor: '#EFEFEF',
        marginRight: 8,
        marginBottom: 8,
    },
    categoryButtonSelected: {
        backgroundColor: '#42B65A',
    },
    categoryText: {
        color: '#2D3436',
        fontWeight: '600',
    },
    categoryTextSelected: {
        color: '#FFFFFF',
    },
    saveButton: {
        marginTop: 18,
        backgroundColor: '#42B65A',
        borderRadius: 16,
        paddingVertical: 15,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },
    cancelButton: {
        marginTop: 12,
        backgroundColor: '#FF3B30',
        borderRadius: 16,
        paddingVertical: 15,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    });

export default EditMedicineScreen;