import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../components/typography/Text';
import { Button } from '../../components/ui/Button';
import { theme } from '../../theme';

export const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text variant='h1'>Welcome</Text>
      <Button title='Click Me' onPress={() => console.log('Pressed')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    justifyContent: 'center',
    padding: 24,
  },
});
