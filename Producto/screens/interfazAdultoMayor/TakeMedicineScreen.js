import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot } from 'firebase/firestore';

import { db } from '../../database/firebaseConfig';
import { useInventory } from '../../hook/useInventory';

import {
  getTodayKey,
  getDoseTakenId,
  getDoseWindowStatus,
  getScheduleTimeText,
  registerMedicineDoseTaken,
  registerMissedMedicineDose,
} from '../../services/medicineTakenService';

import { cancelPatientDoseReminders } from '../../services/patientReminderService';

const TakeMedicineScreen = ({ patientId, onBack }) => {
  const { medicines, loading } = useInventory(patientId);

  const [takenDoses, setTakenDoses] = useState({});
  const [savingDoseId, setSavingDoseId] = useState(null);
  const [checkingMissed, setCheckingMissed] = useState(false);

  useEffect(() => {
    if (!patientId) return;

    const dosesRef = collection(db, 'pacientes', patientId, 'dosisTomadas');

    const unsubscribe = onSnapshot(dosesRef, (snapshot) => {
      const today = getTodayKey();
      const doses = {};

      snapshot.docs.forEach((docItem) => {
        const data = docItem.data();

        if (data.date === today) {
          doses[docItem.id] = {
            id: docItem.id,
            ...data,
          };
        }
      });

      setTakenDoses(doses);
    });

    return unsubscribe;
  }, [patientId]);

  useEffect(() => {
    const markMissedDoses = async () => {
      if (!patientId || loading || checkingMissed) return;

      try {
        setCheckingMissed(true);

        for (const medicine of medicines) {
          const schedules = Array.isArray(medicine.schedules)
            ? medicine.schedules
            : [];

          for (let index = 0; index < schedules.length; index++) {
            const schedule = schedules[index];

            const doseId = getDoseTakenId({
              medicineId: medicine.id,
              dateKey: getTodayKey(),
              scheduleIndex: index,
            });

            if (takenDoses[doseId]) continue;

            const windowStatus = getDoseWindowStatus(schedule);

            if (windowStatus.status === 'expired') {
              await registerMissedMedicineDose({
                patientId,
                medicineId: medicine.id,
                scheduleIndex: index,
              });
            }
          }
        }
      } catch (error) {
        console.error('Error revisando dosis omitidas:', error);
      } finally {
        setCheckingMissed(false);
      }
    };

    markMissedDoses();
  }, [patientId, medicines, takenDoses, loading]);

  const doseCards = useMemo(() => {
    const today = getTodayKey();
    const list = [];

    medicines.forEach((medicine) => {
      const schedules = Array.isArray(medicine.schedules)
        ? medicine.schedules
        : [];

      schedules.forEach((schedule, index) => {
        const doseId = getDoseTakenId({
          medicineId: medicine.id,
          dateKey: today,
          scheduleIndex: index,
        });

        const registeredDose = takenDoses[doseId];
        const isTaken = registeredDose?.status === 'taken';
        const isMissed = registeredDose?.status === 'missed';

        const windowStatus = getDoseWindowStatus(schedule);

        let status = windowStatus.status;
        let statusLabel = windowStatus.label;

        if (isTaken) {
          status = 'taken';
          statusLabel = 'Ya tomada';
        }

        if (isMissed) {
          status = 'missed';
          statusLabel = 'Dosis omitida';
        }

        list.push({
          doseId,
          medicine,
          schedule,
          scheduleIndex: index,
          scheduledTime: getScheduleTimeText(schedule),
          status,
          statusLabel,
        });
      });
    });

    return list.sort((a, b) => {
      const aTime = a.schedule.hour * 60 + a.schedule.minute;
      const bTime = b.schedule.hour * 60 + b.schedule.minute;
      return aTime - bTime;
    });
  }, [medicines, takenDoses]);

  const handleTakeDose = async (item) => {
    if (item.status !== 'available') return;

    try {
      setSavingDoseId(item.doseId);

      const result = await registerMedicineDoseTaken({
        patientId,
        medicineId: item.medicine.id,
        scheduleIndex: item.scheduleIndex,
        source: 'manual',
      });

    if (!result.ok) {
      Alert.alert('Aviso', result.message);
      return;
    }

    await cancelPatientDoseReminders({
      patientId,
      medicineId: item.medicine.id,
      scheduleIndex: item.scheduleIndex,
    });

    Alert.alert(
      'Dosis registrada',
      `${item.medicine.name} fue registrado correctamente.`
    );
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo registrar la dosis.');
    } finally {
      setSavingDoseId(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'available':
        return {
          background: '#EAF8EE',
          color: '#27AE60',
          icon: 'checkmark-circle-outline',
          buttonText: 'Tomar ahora',
          buttonColor: '#42B65A',
          buttonIcon: 'checkmark-circle',
        };

      case 'taken':
        return {
          background: '#EAF8EE',
          color: '#27AE60',
          icon: 'checkmark-done-circle-outline',
          buttonText: 'Ya tomada',
          buttonColor: '#A5D6A7',
          buttonIcon: 'checkmark-done-circle',
        };

      case 'missed':
        return {
          background: '#FDECEC',
          color: '#E74C3C',
          icon: 'close-circle-outline',
          buttonText: 'Dosis omitida',
          buttonColor: '#E74C3C',
          buttonIcon: 'close-circle',
        };

      case 'locked':
        return {
          background: '#F1F2F6',
          color: '#636E72',
          icon: 'lock-closed-outline',
          buttonText: 'Aún no disponible',
          buttonColor: '#B2BEC3',
          buttonIcon: 'lock-closed',
        };

      case 'expired':
      default:
        return {
          background: '#FFF4E5',
          color: '#F39C12',
          icon: 'warning-outline',
          buttonText: checkingMissed ? 'Revisando...' : 'Dosis vencida',
          buttonColor: '#F2C230',
          buttonIcon: 'warning',
        };
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#42B65A" />
        <Text style={styles.loadingText}>Cargando medicamentos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F7F7" />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={30} color="#2D3436" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Tomar medicamento</Text>

        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoCard}>
          <Ionicons name="medical-outline" size={46} color="#42B65A" />
          <Text style={styles.infoTitle}>Dosis de hoy</Text>
          <Text style={styles.infoText}>
            Toca “Tomar ahora” solo cuando corresponda. Las dosis ya tomadas se bloquean automáticamente.
          </Text>

          {checkingMissed && (
            <View style={styles.checkingBox}>
              <ActivityIndicator size="small" color="#42B65A" />
              <Text style={styles.checkingText}>Revisando dosis omitidas...</Text>
            </View>
          )}
        </View>

        {doseCards.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="calendar-outline" size={56} color="#636E72" />
            <Text style={styles.emptyTitle}>No hay dosis programadas</Text>
            <Text style={styles.emptyText}>
              El cuidador debe agregar horarios para los medicamentos.
            </Text>
          </View>
        ) : (
          doseCards.map((item) => {
            const statusStyle = getStatusStyle(item.status);
            const isSaving = savingDoseId === item.doseId;
            const doseAmount = Number(item.medicine.doseAmount || 1);
            const stockUnit = item.medicine.stockUnit || 'unidad';

            return (
              <View
                key={item.doseId}
                style={[
                  styles.doseCard,
                  { backgroundColor: statusStyle.background },
                ]}
              >
                <View style={styles.doseTop}>
                  <View style={styles.iconBox}>
                    <Ionicons
                      name={statusStyle.icon}
                      size={34}
                      color={statusStyle.color}
                    />
                  </View>

                  <View style={styles.doseInfo}>
                    <Text style={styles.medicineName}>
                      {item.medicine.name}
                    </Text>

                    <Text style={styles.scheduleText}>
                      Hora: {item.scheduledTime}
                    </Text>

                    <Text style={styles.amountText}>
                      Cantidad: {doseAmount} {stockUnit}
                    </Text>

                    <Text
                      style={[
                        styles.statusText,
                        { color: statusStyle.color },
                      ]}
                    >
                      {item.statusLabel}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.takeButton,
                    { backgroundColor: statusStyle.buttonColor },
                    item.status !== 'available' && styles.disabledButton,
                  ]}
                  onPress={() => handleTakeDose(item)}
                  disabled={item.status !== 'available' || isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons
                        name={statusStyle.buttonIcon}
                        size={22}
                        color="#FFFFFF"
                      />

                      <Text style={styles.takeButtonText}>
                        {statusStyle.buttonText}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default TakeMedicineScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },

  centerContainer: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
    color: '#636E72',
    fontSize: 16,
    fontWeight: '800',
  },

  header: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 34,
  },

  headerTitle: {
    color: '#2D3436',
    fontSize: 22,
    fontWeight: '900',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 34,
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },

  infoTitle: {
    marginTop: 8,
    fontSize: 25,
    fontWeight: '900',
    color: '#2D3436',
  },

  infoText: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
    color: '#636E72',
    textAlign: 'center',
  },

  checkingBox: {
    marginTop: 14,
    backgroundColor: '#EAF8EE',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkingText: {
    marginLeft: 8,
    color: '#27AE60',
    fontSize: 13,
    fontWeight: '900',
  },

  doseCard: {
    borderRadius: 26,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
  },

  doseTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBox: {
    width: 66,
    height: 66,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  doseInfo: {
    flex: 1,
  },

  medicineName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2D3436',
  },

  scheduleText: {
    marginTop: 4,
    fontSize: 17,
    fontWeight: '800',
    color: '#4F5D75',
  },

  amountText: {
    marginTop: 3,
    fontSize: 15,
    fontWeight: '700',
    color: '#636E72',
  },

  statusText: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '900',
  },

  takeButton: {
    marginTop: 18,
    borderRadius: 18,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  disabledButton: {
    opacity: 0.75,
  },

  takeButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    marginLeft: 8,
  },

  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    elevation: 2,
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: '900',
    color: '#2D3436',
    textAlign: 'center',
  },

  emptyText: {
    marginTop: 8,
    fontSize: 15,
    color: '#636E72',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 21,
  },
});