import {StyleSheet} from 'react-native';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center', // Añadido para centrar el texto abajo
    width: '100%',
  },
  tagline: {
    fontSize: 14,
    color: '#636E72',
    fontWeight: '500',
    letterSpacing: 1.2,
  },
});