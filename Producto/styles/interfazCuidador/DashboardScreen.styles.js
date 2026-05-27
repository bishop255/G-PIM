import {StyleSheet} from 'react-native';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 55,
    paddingHorizontal: 20,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontWeight: '800',
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  headerTitle: {
    fontWeight: '900',
  },

  scrollContent: {
    paddingBottom: 40,
  },

  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 24,
    alignItems: 'center',
    elevation: 3,
    marginBottom: 18,
  },

  heroIcon: {
    width: 78,
    height: 78,
    borderRadius: 26,
    backgroundColor: '#EAF8EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#2D3436',
  },

  heroSubtitle: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '700',
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 22,
  },

  percentText: {
    marginTop: 18,
    fontSize: 48,
    fontWeight: '900',
    color: '#42B65A',
  },

  percentLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#636E72',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    alignItems: 'center',
    marginBottom: 14,
    elevation: 2,
  },

  statIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  statValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2D3436',
  },

  statTitle: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '800',
    color: '#636E72',
  },

  sectionHeader: {
    marginTop: 10,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2D3436',
  },

  sectionSubtitle: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '700',
    color: '#636E72',
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 28,
    alignItems: 'center',
    elevation: 2,
  },

  emptyTitle: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: '900',
    color: '#2D3436',
  },

  emptyText: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '700',
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 21,
  },

  doseRow: {
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  doseIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  doseInfo: {
    flex: 1,
  },

  doseName: {
    fontSize: 17,
    fontWeight: '900',
    color: '#2D3436',
  },

  doseMeta: {
    marginTop: 3,
    fontSize: 14,
    fontWeight: '800',
    color: '#636E72',
  },
});