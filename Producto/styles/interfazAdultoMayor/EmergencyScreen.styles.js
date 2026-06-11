import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const scale = Math.min(width / 390, 1.12);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FA',
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 34,
    paddingBottom: 60,
  },

  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },

  logo: {
    width: 48 * scale,
    height: 48 * scale,
    borderRadius: 12,
    marginRight: 10,
  },

  logoText: {
    fontSize: 26 * scale,
    fontWeight: '900',
    color: '#2D3436',
  },

  emergencyIconBox: {
    width: 118,
    height: 118,
    borderRadius: 34,
    backgroundColor: '#FDECEC',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#F5B7B1',
  },

  title: {
    textAlign: 'center',
    fontSize: 33 * scale,
    fontWeight: '900',
    color: '#E74C3C',
    marginBottom: 10,
  },

  subtitle: {
    textAlign: 'center',
    fontSize: 18 * scale,
    color: '#4F5D75',
    marginBottom: 16,
    fontWeight: '800',
    lineHeight: 25 * scale,
  },

  caregiverBox: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 3,
  },

  caregiverText: {
    marginLeft: 8,
    color: '#2D3436',
    fontSize: 16,
    fontWeight: '900',
  },

  actionButton: {
    width: '100%',
    minHeight: 105,
    borderRadius: 24,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    elevation: 5,
  },

  greenButton: {
    backgroundColor: '#EAF8EE',
    borderWidth: 1,
    borderColor: '#42B65A',
  },

  redButton: {
    backgroundColor: '#FDECEC',
    borderWidth: 1,
    borderColor: '#E74C3C',
  },

  yellowButton: {
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#F39C12',
  },

  infoButton: {
    backgroundColor: '#EAF3FF',
    borderWidth: 1,
    borderColor: '#2D9CDB',
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  actionTextDark: {
    flexShrink: 1,
    fontSize: 23 * scale,
    fontWeight: '900',
    color: '#2D3436',
    lineHeight: 31 * scale,
    marginLeft: 10,
  },

  successBox: {
    marginTop: 4,
    backgroundColor: '#EAF8EE',
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#42B65A',
  },

  successIcon: {
    fontSize: 24,
    marginRight: 10,
  },

  successText: {
    fontSize: 17 * scale,
    fontWeight: '900',
    color: '#27AE60',
    textAlign: 'center',
  },

  cancelButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 34,
  },

  cancelText: {
    color: '#FFFFFF',
    fontSize: 23 * scale,
    fontWeight: '900',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  medicalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    elevation: 8,
  },

  medicalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  medicalTitle: {
    marginLeft: 10,
    fontSize: 24,
    fontWeight: '900',
    color: '#2D3436',
  },

  infoRow: {
    backgroundColor: '#F7F9FA',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E9EEF2',
  },

  infoLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#636E72',
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2D3436',
  },

  closeMedicalButton: {
    marginTop: 10,
    backgroundColor: '#42B65A',
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
  },

  closeMedicalText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },

  actionIconBox: {
  width: 66,
  height: 66,
  borderRadius: 22,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 18,
},

greenIconBox: {
  backgroundColor: '#FFFFFF',
  borderWidth: 2,
  borderColor: '#42B65A',
},

redIconBox: {
  backgroundColor: '#FFFFFF',
  borderWidth: 2,
  borderColor: '#E74C3C',
},

yellowIconBox: {
  backgroundColor: '#FFFFFF',
  borderWidth: 2,
  borderColor: '#F39C12',
},

blueIconBox: {
  backgroundColor: '#FFFFFF',
  borderWidth: 2,
  borderColor: '#2D9CDB',
},
});