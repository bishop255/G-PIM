import {StyleSheet} from 'react-native';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },

  centerContainer: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
    color: '#636E72',
    fontSize: 16,
    fontWeight: '800',
  },

  header: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 34,
  },

  headerTitle: {
    color: '#2D3436',
    fontSize: 22,
    fontWeight: '900',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 34,
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },

  infoTitle: {
    marginTop: 8,
    fontSize: 25,
    fontWeight: '900',
    color: '#2D3436',
  },

  infoText: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
    color: '#636E72',
    textAlign: 'center',
  },

  checkingBox: {
    marginTop: 14,
    backgroundColor: '#EAF8EE',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkingText: {
    marginLeft: 8,
    color: '#27AE60',
    fontSize: 13,
    fontWeight: '900',
  },

  doseCard: {
    borderRadius: 26,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
  },

  doseTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBox: {
    width: 66,
    height: 66,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  doseInfo: {
    flex: 1,
  },

  medicineName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2D3436',
  },

  scheduleText: {
    marginTop: 4,
    fontSize: 17,
    fontWeight: '800',
    color: '#4F5D75',
  },

  amountText: {
    marginTop: 3,
    fontSize: 15,
    fontWeight: '700',
    color: '#636E72',
  },

  statusText: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '900',
  },

  takeButton: {
    marginTop: 18,
    borderRadius: 18,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  disabledButton: {
    opacity: 0.75,
  },

  takeButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    marginLeft: 8,
  },

  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    elevation: 2,
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: '900',
    color: '#2D3436',
    textAlign: 'center',
  },

  emptyText: {
    marginTop: 8,
    fontSize: 15,
    color: '#636E72',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 21,
  },
});