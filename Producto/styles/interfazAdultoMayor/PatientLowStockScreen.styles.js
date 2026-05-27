import {StyleSheet} from 'react-native';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
  },
  rightSpacer: {
    width: 24,
  },
  headerText: {
    fontWeight: 'bold',
    marginTop: 20,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 22,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  medicineCard: {
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 14,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 5,
  },
  medicineCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicineTextBlock: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },
  medicineName: {
    fontWeight: '800',
  },
  medicineInfo: {
    marginTop: 4,
    fontWeight: '600',
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
    textAlign: 'center',
  },
});