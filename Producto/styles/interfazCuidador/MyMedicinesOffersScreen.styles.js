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

  logoText: {
    fontWeight: '900',
    textAlign: 'center',
  },

  header: {
    fontWeight: '900',
    marginTop: 24,
    marginBottom: 6,
  },

  subtitle: {
    marginBottom: 14,
    lineHeight: 22,
    fontWeight: '600',
  },

  summaryCard: {
    backgroundColor: '#EAF8EE',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#42B65A',
  },

  summaryIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  summaryTitle: {
    color: '#2D3436',
    fontWeight: '900',
  },

  summaryText: {
    color: '#4F5D75',
    fontWeight: '700',
    marginTop: 3,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  medicineBlock: {
    marginBottom: 16,
  },

  medicineCard: {
    width: '100%',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderWidth: 1,
    elevation: 4,
  },

  medicineCardExpanded: {
    backgroundColor: '#2D9CDB',
    borderColor: '#2D9CDB',
  },

  medicineCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  medicineIconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#EAF8EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  medicineIconBoxExpanded: {
    backgroundColor: 'rgba(255,255,255,0.22)',
  },

  medicineTextBlock: {
    flex: 1,
    marginRight: 10,
  },

  medicineCardText: {
    fontWeight: '900',
  },

  medicineHint: {
    marginTop: 4,
    fontWeight: '700',
  },

  offersContainer: {
    marginTop: 10,
    borderRadius: 22,
    borderWidth: 1,
    padding: 14,
    elevation: 2,
  },

  offerCard: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
  },

  offerMedicine: {
    fontWeight: '900',
    marginBottom: 10,
  },

  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  offerPharmacy: {
    fontWeight: '900',
    flex: 1,
    marginRight: 10,
  },

  availableText: {
    marginTop: 4,
    fontWeight: '800',
  },

  offerPrice: {
    fontWeight: '900',
    marginRight: 6,
  },

  bestPriceRow: {
    backgroundColor: '#EAF8EE',
  },

  bestBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#42B65A',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  bestBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    marginLeft: 5,
    fontSize: 11,
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  bestText: {
    marginTop: 8,
    fontWeight: '900',
  },

  openText: {
    marginTop: 8,
    fontWeight: '700',
  },

  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    paddingVertical: 20,
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