import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { collection, query, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function GameTracker() {
  const [players, setPlayers] = useState<{ id: string; name: string; points: number; gamesWon: number }[]>([]);
  const [currentPoints, setCurrentPoints] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'players'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const playersData: { id: string; name: string; points: number; gamesWon: number }[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as { name: string; points: number; gamesWon: number };
        playersData.push({ ...data, id: doc.id });
      });
      setPlayers(playersData);
    });

    return () => unsubscribe();
  }, []);

  const addPoint = async (player: { id: string; name: string; points: number; gamesWon: number }) => {
    const newPoints = player.points + currentPoints + 1;
    if (newPoints >= 7) {
      await updateDoc(doc(db, 'players', player.id), { points: 0, gamesWon: player.gamesWon + 1 });
      setCurrentPoints(newPoints - 7);
    } else {
      await updateDoc(doc(db, 'players', player.id), { points: newPoints });
      setCurrentPoints(0);
    }
  };

  return (
    <View style={styles.container}>
      {players.map((player) => (
        <View key={player.id} style={styles.playerItem}>
          <Text style={styles.playerText}>{player.name}: {player.points} points</Text>
          <Button title="Add Point" onPress={() => addPoint(player)} />
        </View>
      ))}
      <Text style={styles.currentPointsText}>Current Points in Game: {currentPoints}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff', // Set background color to white
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  playerText: {
    color: '#000',
  },
  currentPointsText: {
    color: '#000',
  },
});
