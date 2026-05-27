import {StyleSheet} from 'react-native';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 55,
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: '900',
  },
  title: {
    fontWeight: '900',
    marginTop: 28,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 20,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FDECEC',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 2,
    borderColor: '#E74C3C',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: '#E74C3C',
    fontSize: 17,
    fontWeight: '900',
  },
  cardMessage: {
    color: '#2D3436',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
  },
  cardDate: {
    color: '#636E72',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
  },
  centerContent: {
    marginTop: 90,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontWeight: '700',
  },
  emptyContainer: {
    marginTop: 90,
    alignItems: 'center',
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: '900',
    color: '#27AE60',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 15,
    color: '#636E72',
    fontWeight: '700',
    textAlign: 'center',
  },
});