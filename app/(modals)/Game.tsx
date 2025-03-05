import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

type RootStackParamList = {
  index: undefined;
  AddPlayers: undefined;
  Game: { players: { id: string; name: string; points: number; gamesWon: number }[] };
};

type GameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Game'>;
type GameScreenRouteProp = RouteProp<RootStackParamList, 'Game'>;

export default function GameScreen() {
  const route = useRoute<GameScreenRouteProp>();
  const navigation = useNavigation<GameScreenNavigationProp>();
  const { players: initialPlayers } = route.params;
  const [players, setPlayers] = useState(initialPlayers.map(player => ({ ...player, points: 0 })));
  const [eliminatedPlayers, setEliminatedPlayers] = useState<{ id: string; name: string; points: number; gamesWon: number }[]>([]);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
    setIntervalId(id);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (players.length === 1) {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
      const winner = players[0];
      updateDoc(doc(db, 'players', winner.id), { gamesWon: winner.gamesWon + 1 });
      Alert.alert('Round Over', `${winner.name} has won this round!`, [
        { text: 'Start New Round', onPress: startNewRound },
        { text: 'Stop Game', onPress: stopGame },
      ]);
    }
  }, [players]);

  const startNewRound = () => {
    const resetPlayers = [...players, ...eliminatedPlayers].map(player => ({ ...player, points: 0 }));
    setPlayers(resetPlayers);
    setEliminatedPlayers([]);
    setCurrentPoints(0);
    setTimer(0);
    const id = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
    setIntervalId(id);
  };

  const stopGame = async () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
    const gameData = {
      date: new Date().toISOString(),
      players: [...players, ...eliminatedPlayers],
    };
    await addDoc(collection(db, 'games'), gameData);
    navigation.navigate('index');
  };

  const handleScore = () => {
    setCurrentPoints(currentPoints + 1);
  };

  const handleMiss = async (player: { id: string; name: string; points: number; gamesWon: number }) => {
    let pointsToAdd = currentPoints;
    if (player.points + pointsToAdd >= 7) {
      pointsToAdd = 7 - player.points;
      setEliminatedPlayers((prevEliminatedPlayers) => [...prevEliminatedPlayers, { ...player, points: 7 }]);
      setPlayers(players.filter(p => p.id !== player.id));
      await updateDoc(doc(db, 'players', player.id), { points: 0 });
    } else {
      await updateDoc(doc(db, 'players', player.id), { points: player.points + pointsToAdd });
      setPlayers(players.map(p => p.id === player.id ? { ...p, points: player.points + pointsToAdd } : p));
    }
    setCurrentPoints(0);
    if (players.length === 2) {
      const winner = players.find(p => p.id !== player.id);
      if (winner) {
        updateDoc(doc(db, 'players', winner.id), { gamesWon: winner.gamesWon + 1 });
        Alert.alert('Round Over', `${winner.name} has won this round!`, [
          { text: 'Start New Round', onPress: startNewRound },
          { text: 'Stop Game', onPress: stopGame },
        ]);
      }
    }
  };

  const handleMissCompletely = async (player: { id: string; name: string; points: number; gamesWon: number }) => {
    const pointsToAdd = currentPoints + 1;
    if (player.points + pointsToAdd >= 7) {
      setEliminatedPlayers((prevEliminatedPlayers) => [...prevEliminatedPlayers, { ...player, points: 7 }]);
      setPlayers(players.filter(p => p.id !== player.id));
      await updateDoc(doc(db, 'players', player.id), { points: 0 });
    } else {
      await updateDoc(doc(db, 'players', player.id), { points: player.points + pointsToAdd });
      setPlayers(players.map(p => p.id === player.id ? { ...p, points: player.points + pointsToAdd } : p));
    }
    setCurrentPoints(0);
    if (players.length === 2) {
      const winner = players.find(p => p.id !== player.id);
      if (winner) {
        updateDoc(doc(db, 'players', winner.id), { gamesWon: winner.gamesWon + 1 });
        Alert.alert('Round Over', `${winner.name} has won this round!`, [
          { text: 'Start New Round', onPress: startNewRound },
          { text: 'Stop Game', onPress: stopGame },
        ]);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>Timer: {timer} seconds</Text>
      <Text style={styles.currentPointsText}>Current Points in Game: {currentPoints}</Text>
      <Text style={styles.sectionTitle}>Players in Game</Text>
      {players.map((player) => (
        <View key={player.id} style={styles.playerItem}>
          <Text style={styles.playerText}>{player.name}: {player.points} points</Text>
          <View style={styles.buttonContainer}>
            <Button title="Score" onPress={handleScore} />
            <Button title="Miss" onPress={() => handleMiss(player)} />
            <Button title="Basket Miss" onPress={() => handleMissCompletely(player)} />
          </View>
        </View>
      ))}
      <Text style={styles.sectionTitle}>Eliminated Players</Text>
      {eliminatedPlayers.map((player) => (
        <View key={player.id} style={styles.playerItem}>
          <Text style={styles.playerText}>{player.name}: {player.points} points</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  currentPointsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
  },
});
