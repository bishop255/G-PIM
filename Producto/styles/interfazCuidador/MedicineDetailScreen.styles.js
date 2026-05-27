import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 55,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '800',
  },
  mainCard: {
    borderRadius: 28,
    padding: 22,
    alignItems: 'center',
    marginTop: 24,
    elevation: 3,
    borderWidth: 1,
  },
  iconCircle: {
    width: 145,
    height: 145,
    borderRadius: 34,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  statusBadge: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
  },
  statusText: {
    fontWeight: '800',
  },
  remainingText: {
    fontWeight: '800',
    marginTop: 14,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    marginTop: 18,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontWeight: '800',
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  levelBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  progressBarBackground: {
    width: '100%',
    height: 12,
    backgroundColor: '#EEF2F3',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 999,
  },
  progressPercent: {
    fontWeight: '900',
    marginTop: 8,
    textAlign: 'center',
  },
  alertBox: {
    width: '100%',
    marginTop: 16,
    padding: 13,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertText: {
    flex: 1,
    marginLeft: 8,
    fontWeight: '800',
  },
  estimatedDate: {
    marginTop: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  categoryText: {
    marginTop: 8,
    fontWeight: '700',
  },
  stockRow: {
    flexDirection: 'row',
    marginTop: 22,
    width: '100%',
    justifyContent: 'space-between',
  },
  stockBox: {
    width: '31%',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  stockNumber: {
    fontWeight: '900',
  },
  stockLabel: {
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
  infoGrid: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  infoBox: {
    width: '48%',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
  },
  infoLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  infoValue: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  scheduleSection: {
    width: '100%',
    marginTop: 18,
  },
  sectionTitle: {
    fontWeight: '900',
    marginBottom: 10,
  },
  scheduleList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  schedulePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  scheduleText: {
    marginLeft: 6,
    fontWeight: '900',
    fontSize: 14,
  },
  actions: {
    marginTop: 20,
  },
  restockButton: {
    backgroundColor: '#2D9CDB',
    borderRadius: 18,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 3,
  },
  editButton: {
    borderRadius: 18,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 18,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    marginLeft: 8,
  },
  secondaryButtonText: {
    fontWeight: '800',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },
  modalTitle: {
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    padding: 12,
  },
  cancelText: {
    fontWeight: '700',
  },
  confirmButton: {
    backgroundColor: '#2D9CDB',
    padding: 12,
    borderRadius: 12,
  },
  confirmText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});