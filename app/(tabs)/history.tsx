import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function HistoryScreen() {
  const [games, setGames] = useState<{ id: string; date: string; players: { name: string; points: number; gamesWon: number }[] }[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'games'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const gamesData: { id: string; date: string; players: { name: string; points: number; gamesWon: number }[] }[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as { date: string; players: { name: string; points: number; gamesWon: number }[] };
        gamesData.push({ ...data, id: doc.id });
      });
      setGames(gamesData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>History of Games</Text>
      <FlatList
        data={games}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.gameItem}>
            <Text style={styles.gameDate}>{item.date}</Text>
            {item.players.map((player, index) => (
              <Text key={index} style={styles.playerText}>{player.name}: {player.points} points, {player.gamesWon} wins</Text>
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  gameItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  gameDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  playerText: {
    color: '#000',
  },
});
