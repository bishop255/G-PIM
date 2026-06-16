import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 55,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 44,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontWeight: '800',
    textAlign: 'center',
  },

  rightSpacer: {
    width: 44,
  },

  headerText: {
    fontWeight: '900',
    marginTop: 24,
    marginBottom: 8,
  },

  subtitle: {
    marginTop: 4,
    marginBottom: 22,
    lineHeight: 24,
    fontWeight: '600',
  },

  scrollContent: {
    paddingBottom: 40,
  },

  medicineCard: {
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 18,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 5,
  },

  medicineCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#FFF4E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  medicineTextBlock: {
    flex: 1,
    marginRight: 10,
  },

  medicineName: {
    fontWeight: '900',
  },

  medicineInfo: {
    marginTop: 6,
    fontWeight: '700',
  },

  reportHint: {
    marginTop: 6,
    fontWeight: '800',
  },

  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 70,
  },

  loadingText: {
    marginTop: 10,
    fontWeight: '700',
  },

  emptyText: {
    textAlign: 'center',
    fontWeight: '700',
  },
});