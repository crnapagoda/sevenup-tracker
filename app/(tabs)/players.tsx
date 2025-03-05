import React from 'react';
import { View, StyleSheet } from 'react-native';
import PlayerManager from '../../components/PlayerManager';

export default function PlayersScreen() {
  return (
    <View style={styles.container}>
      <PlayerManager />
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
