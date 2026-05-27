import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },

  backButton: {
    padding: 5,
  },

  headerTitle: {
    fontWeight: '800',
  },

  profileCard: {
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    elevation: 3,
  },

  avatarContainer: {
    width: 125,
    height: 125,
    borderRadius: 32,
    backgroundColor: '#F4FFF7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  avatarImage: {
    width: 90,
    height: 90,
  },

  userName: {
    fontWeight: '900',
    textAlign: 'center',
  },

  userEmail: {
    marginTop: 6,
    fontWeight: '600',
    textAlign: 'center',
  },

  roleBadge: {
    marginTop: 18,
    backgroundColor: '#42B65A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },

  roleText: {
    color: '#FFFFFF',
    fontWeight: '800',
    marginLeft: 6,
    fontSize: 13,
  },

  infoCard: {
    marginTop: 18,
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    elevation: 2,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoTextContainer: {
    marginLeft: 14,
    flex: 1,
  },

  infoLabel: {
    fontSize: 13,
    fontWeight: '700',
  },

  infoValue: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '800',
  },

  divider: {
    height: 1,
    backgroundColor: '#DFE6E9',
    marginVertical: 18,
  },

  patientCard: {
    marginTop: 18,
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    elevation: 2,
  },

  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  patientIconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#EAF8EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  patientInfo: {
    flex: 1,
  },

  patientLabel: {
    fontSize: 13,
    fontWeight: '700',
  },

  patientName: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '900',
  },

  connectionBadge: {
    marginTop: 16,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },

  connectionText: {
    fontSize: 13,
    fontWeight: '900',
    marginLeft: 6,
  },

  editButton: {
    marginTop: 24,
    marginHorizontal: 20,
    backgroundColor: '#42B65A',
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },

  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 8,
  },

  logoutButton: {
    marginTop: 14,
    marginHorizontal: 20,
    backgroundColor: '#E74C3C',
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
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
});