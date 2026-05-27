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
  title: {
    fontWeight: '800',
  },
  header: {
    fontWeight: '900',
    marginTop: 28,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 40,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  content: {
    flex: 1,
  },
  medicineName: {
    fontWeight: '900',
    color: '#2D3436',
  },
  typeText: {
    fontWeight: '900',
    marginTop: 4,
  },
  description: {
    color: '#636E72',
    marginTop: 4,
  },
  stockText: {
    color: '#4F5D75',
    fontWeight: '800',
    marginTop: 6,
  },
  dateText: {
    color: '#636E72',
    marginTop: 4,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 90,
  },
  loadingText: {
    marginTop: 10,
    fontWeight: '600',
  },
  emptyText: {
    marginTop: 12,
    textAlign: 'center',
  },
});