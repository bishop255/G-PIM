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
    marginTop: 18,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 18,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    fontWeight: '600',
  },
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    elevation: 2,
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
  loginButton: {
    backgroundColor: '#42B65A',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  registerLink: {
    alignItems: 'center',
    marginTop: 18,
  },
  registerText: {
    color: '#42B65A',
    fontWeight: '800',
  },

  inputError: {
  borderWidth: 2,
  borderColor: '#E74C3C',
  backgroundColor: '#FDECEC',
},

errorText: {
  color: '#E74C3C',
  fontSize: 13,
  fontWeight: '800',
  marginTop: 6,
  marginBottom: 4,
},

loginButtonDisabled: {
  opacity: 0.6,
},
});