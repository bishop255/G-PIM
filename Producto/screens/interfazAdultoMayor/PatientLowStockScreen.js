import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';
import { getTheme } from '../../theme/theme';
import { styles } from '../../styles/interfazAdultoMayor/PatientLowStockScreen.styles';
import { useInventory } from '../../hook/useInventory';
import { db } from '../../database/firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { sendExpoPushNotification } from '../../services/notificationService';

const PatientLowStockScreen = ({ patientId, settings, onBack }) => {
  const { colors, fontSizes } = getTheme(settings);
  const { medicines, loading, updateMedicine } = useInventory(patientId);

  const [processingMedicineId, setProcessingMedicineId] = useState(null);

  // Filtrar medicamentos válidos del inventario
  const validMedicines = useMemo(() => {
    return medicines.filter((item) => item?.name);
  }, [medicines]);

  // Notificar a los cuidadores vinculados al paciente
  const notifyCaregivers = async (medicine) => {
    try {
      // Buscar usuarios cuidadores que estén vinculados a este paciente
      const usersRef = collection(db, 'usuarios');
      const caregiversQuery = query(
        usersRef,
        where('patientId', '==', patientId)
      );

      const caregiversSnapshot = await getDocs(caregiversQuery);

      if (caregiversSnapshot.empty) {
        console.log('No se encontraron cuidadores vinculados para este paciente.');
        return;
      }

      const notifications = caregiversSnapshot.docs.map(async (docItem) => {
        const userData = docItem.data();

        // Enviar notificación solo si existe token push
        if (userData?.expoPushToken) {
          return sendExpoPushNotification({
            expoPushToken: userData.expoPushToken,
            title: 'Stock crítico reportado',
            body: `El paciente indicó que ${medicine.name} está por agotarse.`,
            data: {
              type: 'patient_low_stock',
              patientId,
              medicineId: medicine.id,
              medicineName: medicine.name,
            },
          });
        }

        return null;
      });

      await Promise.all(notifications);
    } catch (error) {
      console.log('Error notificando al cuidador:', error);
    }
  };

  // Marcar medicamento como crítico y notificar al cuidador
  const handleReportLowStock = async (medicine) => {
    try {
      setProcessingMedicineId(medicine.id);

      // Marcar medicamento con alerta crítica reportada por el paciente
      await updateMedicine(medicine.id, {
        patientReportedLowStock: true,
        patientReportedLowStockAt: serverTimestamp(),
        patientReportedLowStockStatus: 'critical',
      });

      // Enviar notificación push al cuidador
      await notifyCaregivers(medicine);

      Alert.alert(
        'Aviso enviado',
        `Se notificó al cuidador que ${medicine.name} está en stock crítico.`
      );
    } catch (error) {
      console.log('Error reportando stock crítico:', error);
      Alert.alert(
        'Error',
        'No se pudo enviar la notificación al cuidador.'
      );
    } finally {
      setProcessingMedicineId(null);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Barra superior */}
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
          Stock crítico
        </Text>

        <View style={styles.rightSpacer} />
      </View>

      {/* Encabezado */}
      <Text
        style={[
          styles.headerText,
          { color: colors.text, fontSize: fontSizes.title },
        ]}
      >
        Selecciona el medicamento
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: colors.secondaryText, fontSize: fontSizes.subtitle },
        ]}
      >
        El cuidador recibirá una notificación indicando que el stock del medicamento seleccionado está crítico.
      </Text>

      {/* Contenido */}
      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text
            style={[
              styles.loadingText,
              { color: colors.secondaryText, fontSize: fontSizes.normal },
            ]}
          >
            Cargando medicamentos...
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {validMedicines.length > 0 ? (
            validMedicines.map((medicine) => {
              const isProcessing = processingMedicineId === medicine.id;

              return (
                <TouchableOpacity
                  key={medicine.id}
                  style={[
                    styles.medicineCard,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                  onPress={() => handleReportLowStock(medicine)}
                  activeOpacity={0.85}
                  disabled={isProcessing}
                >
                  <View style={styles.medicineCardContent}>
                    <MaterialCommunityIcons
                      name="pill"
                      size={34}
                      color="#F39C12"
                    />

                    <View style={styles.medicineTextBlock}>
                      <Text
                        style={[
                          styles.medicineName,
                          { color: colors.text, fontSize: fontSizes.normal + 2 },
                        ]}
                      >
                        {medicine.name}
                      </Text>

                      <Text
                        style={[
                          styles.medicineInfo,
                          { color: colors.secondaryText, fontSize: fontSizes.small },
                        ]}
                      >
                        Stock actual: {medicine.currentStock ?? 0} | Stock mínimo: {medicine.minStock ?? 0}
                      </Text>
                    </View>

                    {isProcessing ? (
                      <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                      <Ionicons
                        name="chevron-forward"
                        size={24}
                        color={colors.text}
                      />
                    )}
                  </View>
                </TouchableOpacity>
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
      )}
    </SafeAreaView>
  );
};

export default PatientLowStockScreen;
