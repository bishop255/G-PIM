import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
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

  searchContainer: {
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 14,
  },

  searchButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },

  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  myMedicinesButton: {
    borderRadius: 26,
    minHeight: 95,
    justifyContent: 'center',
    paddingHorizontal: 22,
    marginBottom: 20,
    alignSelf: 'center',
    width: '100%',
    elevation: 6,
  },

  myMedicinesButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  myMedicinesIcon: {
    marginRight: 14,
  },

  myMedicinesText: {
    flex: 1,
    color: '#FFFFFF',
    fontWeight: '900',
  },

  listContent: {
    paddingBottom: 100,
  },

  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
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
    marginBottom: 10,
  },

  bestBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    marginLeft: 5,
    fontSize: 12,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  medicineName: {
    fontWeight: '800',
    marginLeft: 10,
    flex: 1,
  },

  pharmacy: {
    fontWeight: '700',
  },

  availableText: {
    marginTop: 4,
    fontWeight: '800',
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  price: {
    fontWeight: '900',
    marginRight: 5,
  },

  openHint: {
    marginTop: 8,
    fontWeight: '700',
  },

  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },

  loadingText: {
    marginTop: 10,
  },

  emptyText: {
    marginTop: 12,
    textAlign: 'center',
  },

  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 12,
  },

  navItem: {
    alignItems: 'center',
  },

  navText: {
    fontWeight: '700',
    marginTop: 3,
  },
});