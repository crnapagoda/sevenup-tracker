import React from 'react';
import { View, StyleSheet } from 'react-native';
import Leaderboard from '../../components/Leaderboard';

export default function LeaderboardScreen() {
  return (
    <View style={styles.container}>
      <Leaderboard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
});
