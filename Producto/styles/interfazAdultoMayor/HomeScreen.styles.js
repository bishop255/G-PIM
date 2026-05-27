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
    paddingTop: height * 0.055,
    paddingHorizontal: width * 0.06,
    paddingBottom: height * 0.04,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 48 * scale,
    height: 48 * scale,
    marginRight: 8,
  },

  logoText: {
    fontSize: 23 * scale,
    fontWeight: '900',
    color: '#2D3436',
  },

  rightSpacer: {
    width: 42,
  },

  headerContainer: {
    marginTop: height * 0.12,
    marginBottom: height * 0.035,
    alignItems: 'center',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  title: {
    fontSize: 30 * scale,
    fontWeight: '900',
    color: '#2D3436',
    marginRight: 8,
    textAlign: 'center',
  },

  titleIcon: {
    fontSize: 30 * scale,
  },

  subtitle: {
    marginTop: 12,
    fontSize: 21 * scale,
    fontWeight: '800',
    color: '#2D3436',
    textAlign: 'center',
  },

  buttonsWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 0,
  },

  actionButton: {
    width: '100%',
    minHeight: height * 0.13,
    borderRadius: 30,
    justifyContent: 'center',
    paddingHorizontal: width * 0.07,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
  },

  greenButton: {
    backgroundColor: '#42B65A',
  },

  yellowButton: {
    backgroundColor: '#F2C230',
  },

  redButton: {
    backgroundColor: '#E74C3C',
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  buttonEmoji: {
    fontSize: 44 * scale,
    marginRight: 18,
  },

  actionText: {
    flexShrink: 1,
    fontSize: 21 * scale,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 29 * scale,
  },
});