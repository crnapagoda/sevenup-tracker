import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function PlayerManager() {
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState<{ id: string; name: string; points: number; gamesWon: number }[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'players'), (querySnapshot) => {
      const playersData: { id: string; name: string; points: number; gamesWon: number }[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as { name: string; points: number; gamesWon: number };
        playersData.push({ ...data, id: doc.id });
      });
      setPlayers(playersData);
    });

    return () => unsubscribe();
  }, []);

  const addPlayer = async () => {
    if (playerName.trim()) {
      try {
        const docRef = await addDoc(collection(db, 'players'), { name: playerName, points: 0, gamesWon: 0 });
        setPlayers([...players, { id: docRef.id, name: playerName, points: 0, gamesWon: 0 }]);
        setPlayerName('');
      } catch (error) {
        console.error('Error adding player:', error);
      }
    }
  };

  const removePlayer = async (id: string) => {
    await deleteDoc(doc(db, 'players', id));
    setPlayers(players.filter(player => player.id !== id));
  };

  const renamePlayer = async (id: string, newName: string) => {
    await updateDoc(doc(db, 'players', id), { name: newName });
    setPlayers(players.map(player => player.id === id ? { ...player, name: newName } : player));
  };

  const handlePlayerPress = (player: { id: string; name: string; points: number; gamesWon: number }) => {
    Alert.alert(
      'Player Options',
      `Options for ${player.name}`,
      [
        { text: 'Rename', onPress: () => promptRenamePlayer(player) },
        { text: 'Delete', onPress: () => removePlayer(player.id) },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const promptRenamePlayer = (player: { id: string; name: string }) => {
    Alert.prompt(
      'Rename Player',
      'Enter new name:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: (newName) => { if (newName) renamePlayer(player.id, newName); } },
      ],
      'plain-text',
      player.name
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter player name"
        placeholderTextColor="#888"
        value={playerName}
        onChangeText={setPlayerName}
      />
      <Button title="Add Player" onPress={addPlayer} />
      <FlatList
        data={players}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePlayerPress(item)}>
            <View style={styles.playerItem}>
              <Text style={styles.playerText}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    color: '#000',
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
});
