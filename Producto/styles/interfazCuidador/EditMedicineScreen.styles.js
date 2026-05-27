import {StyleSheet} from 'react-native';


export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 30,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  title: {
    fontWeight: '800',
  },
  form: {
    borderRadius: 24,
    padding: 20,
    elevation: 2,
    borderWidth: 1,
  },
  labelRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 10,
  },
  helpButton: {
    marginLeft: 6,
    marginBottom: 6,
  },
  input: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    marginBottom: 12,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontWeight: '600',
  },
  unitBox: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  unitText: {
    marginLeft: 8,
    fontWeight: '800',
    flex: 1,
  },
  helperText: {
    marginTop: 8,
    fontWeight: '700',
    lineHeight: 18,
  },
  reminderHeader: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderTitle: {
    marginLeft: 8,
    fontWeight: '900',
  },
  switchButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  switchText: {
    fontWeight: '900',
    fontSize: 12,
  },
  scheduleContainer: {
    marginTop: 14,
  },
  scheduleButton: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleLabel: {
    fontWeight: '800',
    marginBottom: 4,
  },
  scheduleTime: {
    fontWeight: '900',
  },
  saveButton: {
    marginTop: 18,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  cancelButton: {
    marginTop: 12,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});