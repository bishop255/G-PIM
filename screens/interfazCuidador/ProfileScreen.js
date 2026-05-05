import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// El prop "onBack" es la función que nos permitirá regresar al inventario
const ProfileScreen = ({ onBack }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* CABECERA CON BOTÓN VOLVER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <View style={{ width: 28 }} /> {/* Espacio para equilibrar el título */}
      </View>

      {/* CONTENIDO DEL PERFIL */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={120} color="#42B65A" />
        </View>
        <Text style={styles.userName}>Nombre del Cuidador</Text>
        <Text style={styles.userEmail}>cuidador@ejemplo.com</Text>
      </View>

      {/* BOTÓN CERRAR SESIÓN (OPCIONAL) */}
      <TouchableOpacity style={styles.logoutButton} onPress={onBack}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2D3436' },
  backButton: { padding: 5 },
  profileCard: {
    backgroundColor: '#FFF',
    margin: 20,
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#2D3436', marginTop: 15 },
  userEmail: { fontSize: 16, color: '#636E72', marginTop: 5 },
  logoutButton: {
    marginHorizontal: 20,
    backgroundColor: '#FF7675',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 30
  },
  logoutText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default ProfileScreen;