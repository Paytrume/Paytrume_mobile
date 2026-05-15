import React from 'react';
import { Modal, Pressable, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { Text } from '../typography/Text';
import { theme } from '../../theme';

interface SelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  title: string;
  options: string[];
  selectedValue?: string;
}

export const SelectionModal: React.FC<SelectionModalProps> = ({ visible, onClose, onSelect, title, options, selectedValue }) => {
  return (
    <Modal visible={visible} transparent animationType='slide' onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text variant='h2' style={styles.modalTitle}>
              {title}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.optionItem, selectedValue === option && styles.optionItemSelected]}
                onPress={() => {
                  onSelect(option);
                  onClose();
                }}
              >
                <Text variant='body' color={selectedValue === option ? theme.colors.primary : theme.colors.text.primary} style={selectedValue === option && styles.optionTextSelected}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 34,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
  },
  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  optionItemSelected: {
    backgroundColor: `${theme.colors.primary}05`,
  },
  optionTextSelected: {
    fontWeight: '600',
  },
});
