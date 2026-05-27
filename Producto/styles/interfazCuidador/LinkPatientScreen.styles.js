import {StyleSheet} from 'react-native';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'space-between',
  },

  topBar: {
    marginTop: 55,
    paddingHorizontal: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },

  scanArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  scanBox: {
    width: 260,
    height: 260,
    borderWidth: 4,
    borderColor: '#42B65A',
    borderRadius: 28,
    backgroundColor: 'transparent',
  },

  footer: {
    paddingBottom: 70,
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  scanText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },

  rescanButton: {
    marginTop: 20,
    backgroundColor: '#42B65A',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 18,
  },

  rescanText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
  },

  manualButton: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  manualButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    marginLeft: 8,
  },

  centerContainer: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  connectedIcon: {
    width: 112,
    height: 112,
    borderRadius: 34,
    backgroundColor: '#EAF8EE',
    justifyContent: 'center',
    alignItems: 'center',
  },

  connectedBox: {
    marginTop: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  connectedText: {
    marginLeft: 10,
    color: '#2D3436',
    fontSize: 18,
    fontWeight: '900',
  },

  title: {
    marginTop: 18,
    fontSize: 28,
    fontWeight: '900',
    color: '#2D3436',
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '700',
  },

  button: {
    marginTop: 28,
    backgroundColor: '#42B65A',
    borderRadius: 18,
    paddingHorizontal: 28,
    paddingVertical: 16,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  unlinkButton: {
    marginTop: 14,
    backgroundColor: '#E74C3C',
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  unlinkText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    marginLeft: 8,
  },

  manualPermissionButton: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  manualPermissionText: {
    color: '#42B65A',
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '900',
  },

  cancelText: {
    marginTop: 20,
    color: '#636E72',
    fontSize: 15,
    fontWeight: '800',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    alignItems: 'center',
  },

  modalIcon: {
    width: 74,
    height: 74,
    borderRadius: 24,
    backgroundColor: '#EAF8EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  modalTitle: {
    fontSize: 23,
    fontWeight: '900',
    color: '#2D3436',
  },

  modalSubtitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
  },

  modalInput: {
    width: '100%',
    backgroundColor: '#F1F2F6',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 17,
    fontWeight: '900',
    color: '#2D3436',
    textAlign: 'center',
    letterSpacing: 1,
  },

  modalButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  modalCancelButton: {
    flex: 1,
    backgroundColor: '#F1F2F6',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 8,
  },

  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#42B65A',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 8,
  },

  modalCancelText: {
    color: '#636E72',
    fontSize: 15,
    fontWeight: '900',
  },

  modalConfirmText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  buttonDisabled: {
    opacity: 0.6,
  },
});