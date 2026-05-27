import {StyleSheet} from 'react-native';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 55,
  },
  backButton: {
    width: 42,
    height: 42,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  logo: {
    width: 105,
    height: 105,
  },
  title: {
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 14,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 22,
    fontWeight: '600',
  },
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    elevation: 2,
    marginBottom: 40,
  },
  label: {
    fontWeight: '800',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  passwordContainer: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingRight: 10,
  },
  registerButton: {
    backgroundColor: '#42B65A',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 18,
  },
  loginText: {
    color: '#42B65A',
    fontWeight: '800',
  },
  relationshipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 8,
  },
  relationshipButton: {
    backgroundColor: '#EFEFEF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  relationshipButtonSelected: {
    backgroundColor: '#42B65A',
  },
  relationshipText: {
    color: '#2D3436',
    fontWeight: '700',
  },
  relationshipTextSelected: {
    color: '#FFFFFF',
  },
});