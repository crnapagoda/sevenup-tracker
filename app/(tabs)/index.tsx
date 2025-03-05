import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const createNewGame = () => {
    router.push({ pathname: '/AddPlayers' });  // Expo Router uses `router.push()`
  };

  return (
    <View style={styles.container}>
      <Button title="Create New Game" onPress={createNewGame} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
