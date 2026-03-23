import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { Text } from '../../components/typography/Text';

export default function HistoryScreen() {
  return (
    <Screen style={styles.container}>
      <Text variant='h2'>History</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
