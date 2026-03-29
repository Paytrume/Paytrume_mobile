import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '../typography/Text';
import { theme } from '../../theme';

interface Props {
  options: string[];
  value: string;
  onChange: (val: string) => void;
}

export const SegmentedControl: React.FC<Props> = ({ options, value, onChange }) => {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isActive = option === value;

        return (
          <TouchableOpacity key={option} onPress={() => onChange(option)} style={[styles.button, isActive && styles.activeButton]}>
            <Text style={[styles.text, isActive && styles.activeText]}>{option}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: 8,
    padding: 4,
    marginVertical: 12
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: theme.colors.primary,
  },
  text: {
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  activeText: {
    color: '#fff',
    fontWeight: '600',
  },
});