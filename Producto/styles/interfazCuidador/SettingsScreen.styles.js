import {StyleSheet} from 'react-native';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 55,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
  },
  card: {
    marginTop: 25,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  rowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 10,
    fontWeight: '700',
  },
});