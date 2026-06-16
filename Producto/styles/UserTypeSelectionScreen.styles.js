import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    
container: {
  backgroundColor: '#F7F9FA',
  paddingHorizontal: 22,
  paddingTop: 35,
},
  logoCard: {
    alignSelf: 'center',
    width: 170,
    height: 170,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },

  logo: {
    width: 125,
    height: 125,
  },

  title: {
    fontSize: 40,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 24,
    color: '#2D3436',
  },

  subtitle: {
    fontSize: 17,
    color: '#636E72',
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '700',
  },

  infoBox: {
    marginTop: 24,
    backgroundColor: '#EAF8EE',
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoText: {
    flex: 1,
    marginLeft: 10,
    color: '#2D3436',
    fontSize: 15,
    fontWeight: '800',
  },

  optionsContainer: {
    marginTop: 24,
  },

  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#EEF1F3',
  },

  iconCircle: {
    width: 82,
    height: 82,
    borderRadius: 24,
    backgroundColor: '#F4FFF7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  iconImage: {
    width: 58,
    height: 58,
    resizeMode: 'contain',
  },

  optionTitle: {
    position: 'absolute',
    left: 118,
    top: 20,
    fontSize: 22,
    fontWeight: '900',
    color: '#2D3436',
  },

  optionDescription: {
    flex: 1,
    marginTop: 32,
    marginRight: 8,
    color: '#636E72',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },

  selectRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectText: {
    color: '#42B65A',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 4,
  },

closeButton: {
  marginTop: 20,
  marginBottom: 20,
  backgroundColor: '#E74C3C',
  borderRadius: 20,
  paddingVertical: 16,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  elevation: 5,
},

  closeText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    marginLeft: 8,
  },

  scrollContent: {
  flexGrow: 1,
  paddingBottom: 30,
},

safeContainer: {
  flex: 1,
  backgroundColor: '#F7F9FA',
},

scrollContent: {
  flexGrow: 1,
  paddingBottom: 45,
},
});