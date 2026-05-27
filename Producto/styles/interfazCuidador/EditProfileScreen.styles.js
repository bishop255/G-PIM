import {StyleSheet} from 'react-native';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontWeight: '800',
  },
  card: {
    marginHorizontal: 20,
    marginTop: 18,
    borderRadius: 24,
    padding: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: '900',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F1F2F6',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 15,
  },
  disabledInput: {
    opacity: 0.75,
  },
  dateButton: {
    backgroundColor: '#F1F2F6',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 15,
    fontWeight: '700',
  },
  bloodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  bloodButton: {
    backgroundColor: '#F1F2F6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  bloodButtonSelected: {
    backgroundColor: '#42B65A',
  },
  bloodText: {
    color: '#2D3436',
    fontWeight: '800',
    fontSize: 14,
  },
  bloodTextSelected: {
    color: '#FFFFFF',
  },
  multiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: 24,
    marginBottom: 40,
    marginHorizontal: 20,
    backgroundColor: '#42B65A',
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});