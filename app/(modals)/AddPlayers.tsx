import React, { useState, useEffect } from 'react';
import { View, Button, FlatList, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';

type RootStackParamList = {
  Home: undefined;
  AddPlayers: undefined;
  Game: { players: { id: string; name: string; points: number; gamesWon: number }[] };
};

type AddPlayersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddPlayers'>;

export default function AddPlayersScreen() {
  const [players, setPlayers] = useState<{ id: string; name: string; points: number; gamesWon: number }[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<{ id: string; name: string; points: number; gamesWon: number }[]>([]);
  const navigation = useNavigation<AddPlayersScreenNavigationProp>();

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

  const startGame = () => {
    if (selectedPlayers.length < 3) {
      Alert.alert('Error', 'You need at least 3 players to start the game.');
      return;
    }
    navigation.navigate('Game', { players: selectedPlayers });
  };

  const handlePlayerSelect = (player: { id: string; name: string; points: number; gamesWon: number }) => {
    if (!selectedPlayers.some(p => p.id === player.id)) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<{ id: string; name: string; points: number; gamesWon: number }>) => {
    return (
      <TouchableOpacity
        style={[styles.playerItem, isActive && styles.activePlayerItem]}
        onLongPress={drag}
        onPress={() => handlePlayerSelect(item)}
      >
        <Text style={styles.playerText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Players</Text>
      <DraggableFlatList
        data={players}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onDragEnd={({ data }) => setPlayers(data)}
      />
      <Button title="Start Game" onPress={startGame} />
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
  playerItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  activePlayerItem: {
    backgroundColor: '#ddd',
  },
  playerText: {
    color: '#000',
  },
});
