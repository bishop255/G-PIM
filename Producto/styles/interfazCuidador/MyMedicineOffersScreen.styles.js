import {StyleSheet} from 'react-native';


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
  },
  logoText: {
    fontWeight: '800',
  },
  header: {
    fontWeight: 'bold',
    marginTop: 20,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  medicineBlock: {
    marginBottom: 14,
  },
  medicineCard: {
    width: '100%',
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderWidth: 1,
    elevation: 5,
  },
  medicineCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  medicineCardText: {
    flex: 1,
    fontWeight: '800',
    marginLeft: 14,
    marginRight: 10,
  },
  offersContainer: {
    marginTop: 10,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  offerCard: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  offerMedicine: {
    fontWeight: '900',
    marginBottom: 8,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offerPharmacy: {
    fontWeight: '800',
    flex: 1,
    marginRight: 10,
  },
  availableText: {
    marginTop: 4,
    fontWeight: '800',
  },
  offerPrice: {
    fontWeight: '900',
    marginRight: 5,
  },
  bestPriceRow: {
    backgroundColor: '#EAF8EE',
  },
  bestBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#42B65A',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
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
    fontWeight: '800',
  },
  openText: {
    marginTop: 8,
    fontWeight: '700',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  loadingText: {
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
  },
});