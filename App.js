import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// Startgerüst — der Inhalt wird in den ersten Runden mit Claude Code aufgebaut.
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.titel}>Geschichte begreifen</Text>
      <Text style={styles.untertitel}>Startgerüst — Inhalt folgt.</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titel: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7C4A03',
  },
  untertitel: {
    fontSize: 16,
    color: '#B8860B',
    marginTop: 8,
  },
});
