import {StyleSheet, Dimensions} from 'react-native';

const { width, height } = Dimensions.get('window');
const scale = Math.min(width / 390, 1.15);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: width * 0.08,
    paddingTop: height * 0.04,
    paddingBottom: height * 0.05,
    justifyContent: 'center',
  },

  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  logo: {
    width: 52 * scale,
    height: 52 * scale,
    marginRight: 10,
  },

  logoText: {
    fontSize: 26 * scale,
    fontWeight: '900',
    color: '#2D3436',
  },

  emergencyIconBox: {
    width: 120,
    height: 120,
    borderRadius: 36,
    backgroundColor: '#FDECEC',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 22,
  },

  title: {
    textAlign: 'center',
    fontSize: 34 * scale,
    fontWeight: '900',
    color: '#E74C3C',
    marginBottom: 12,
  },

  subtitle: {
    textAlign: 'center',
    fontSize: 19 * scale,
    color: '#333333',
    marginBottom: 18,
    fontWeight: '800',
    lineHeight: 26 * scale,
  },

  caregiverBox: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
    elevation: 2,
  },

  caregiverText: {
    marginLeft: 8,
    color: '#2D3436',
    fontSize: 16,
    fontWeight: '900',
  },

  actionButton: {
    width: '100%',
    minHeight: 115,
    borderRadius: 26,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
  },

  greenButton: {
    backgroundColor: '#B8DDB9',
  },

  yellowButton: {
    backgroundColor: '#F1DE9D',
  },

  redButton: {
    backgroundColor: '#FFD6D6',
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  buttonEmoji: {
    fontSize: 46 * scale,
    marginRight: 18,
  },

  actionTextDark: {
    flexShrink: 1,
    fontSize: 24 * scale,
    fontWeight: '900',
    color: '#000000',
    lineHeight: 32 * scale,
    marginLeft: 12,
  },

  successBox: {
    marginTop: 10,
    backgroundColor: '#B8DDB9',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 34,
  },

  successIcon: {
    fontSize: 24,
    marginRight: 10,
  },

  successText: {
    fontSize: 18 * scale,
    fontWeight: '800',
    color: '#1F4D2E',
    textAlign: 'center',
  },

  cancelButton: {
    backgroundColor: '#FF1E1E',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    color: '#FFFFFF',
    fontSize: 24 * scale,
    fontWeight: '900',
  },
});