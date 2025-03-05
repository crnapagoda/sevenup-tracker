import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function Leaderboard() {
  const [players, setPlayers] = useState<{ id: string; name: string; gamesWon: number }[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'players'), orderBy('gamesWon', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const playersData: { id: string; name: string; gamesWon: number }[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as { name: string; gamesWon: number };
        playersData.push({ ...data, id: doc.id });
      });
      setPlayers(playersData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={players}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.playerItem}>
            <Text style={styles.playerText}>{item.name}: {item.gamesWon} wins</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff', // Set background color to white
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  playerItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  playerText: {
    color: '#000',
  },
});
