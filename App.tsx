import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import Main from './src/screens/Main';
import '@walletconnect/react-native-compat';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Main></Main>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
