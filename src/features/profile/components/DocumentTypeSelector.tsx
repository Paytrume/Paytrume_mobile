import React from 'react';
import { Modal, Pressable, View, StyleSheet, TouchableOpacity } from 'react-native';
import { X, ChevronRight } from 'lucide-react-native';
import { Text } from '../../../components/typography/Text';
import { theme } from '../../../theme';
import { DocumentTypeOption, DocumentType } from '../profile.types';

interface DocumentTypeSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (type: DocumentType) => void;
  selectedType: DocumentType | null;
  options: DocumentTypeOption[];
}

export const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({ visible, onClose, onSelect, selectedType, options }) => {
  const getSelectedLabel = () => {
    const selected = options.find((opt) => opt.id === selectedType);
    return selected?.label || 'Select Document Type';
  };

  return (
    <Modal visible={visible} transparent animationType='slide' onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text variant='h2' style={styles.modalTitle}>
              Select Document Type
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsList}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.optionItem, selectedType === option.id && styles.optionItemSelected]}
                onPress={() => {
                  onSelect(option.id);
                  onClose();
                }}
              >
                <Text variant='body' color={selectedType === option.id ? theme.colors.primary : theme.colors.text.primary} style={selectedType === option.id && styles.optionTextSelected}>
                  {option.label}
                </Text>
                {selectedType === option.id && <ChevronRight size={20} color={theme.colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
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
  optionsList: {
    gap: 8,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: 12,
    marginBottom: 8,
  },
  optionItemSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}05`,
  },
  optionTextSelected: {
    fontWeight: '600',
  },
});
