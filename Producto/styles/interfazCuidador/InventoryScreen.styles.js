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

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: 6,
  },

  logoText: {
    fontWeight: '800',
  },

  header: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 18,
  },

  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },

  searchIcon: {
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
  },

  listContent: {
    paddingBottom: 185,
  },

  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 2,
  },

  textBox: {
    flex: 1,
  },

  productName: {
    fontWeight: '700',
  },

  productStock: {
    marginTop: 4,
  },

  remainingDays: {
    marginTop: 4,
    fontWeight: '600',
  },

  statusText: {
    fontWeight: '700',
    marginTop: 6,
  },

  editButton: {
    padding: 6,
    marginLeft: 10,
  },

  addButton: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: '#42B65A',
    borderRadius: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 8,
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
    justifyContent: 'center',
  },

  navText: {
    fontWeight: '700',
    marginTop: 3,
  },

  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },

  loadingText: {
    marginTop: 10,
  },

  emptyText: {
    marginTop: 12,
    textAlign: 'center',
  },
});