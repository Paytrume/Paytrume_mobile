import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { X } from 'lucide-react-native';
import { Text } from '../../../components/typography/Text';
import { theme } from '../../../theme';
import { RecurringOption } from '../links.types';

const RECURRING_RATES: RecurringOption[] = [
  { label: '10% of amount', value: '10' },
  { label: '20% of amount', value: '20' },
  { label: '25% of amount', value: '25' },
  { label: '50% of amount', value: '50' },
  { label: '100% of payment', value: '100' },
];

const RECURRING_CATEGORIES: RecurringOption[] = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Bi-weekly', value: 'bi-weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
  { label: 'Custom', value: 'custom' },
];

interface RecurringRateSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (rate: RecurringOption) => void;
  selectedRate?: string;
}

interface RecurringCategorySelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (rate: RecurringOption) => void;
  selectedCategory?: string;
}

export const RecurringRateSelector: React.FC<RecurringRateSelectorProps> = ({ visible, onClose, onSelect, selectedRate }) => {
  const renderItem = ({ item }: { item: RecurringOption }) => (
    <TouchableOpacity
      style={[styles.item, selectedRate === item.value && styles.itemSelected]}
      onPress={() => {
        onSelect(item);
        onClose();
      }}
    >
      <Text variant='body' color={selectedRate === item.value ? theme.colors.primary : theme.colors.text.primary} style={selectedRate === item.value && styles.rateTextSelected}>
        {item.label}
      </Text>
      {selectedRate === item.value && <View style={styles.checkmark} />}
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType='slide' onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text variant='h2'>Select payment rate</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>

          <FlatList data={RECURRING_RATES} renderItem={renderItem} keyExtractor={(item) => item.value} contentContainerStyle={styles.listContent} />
        </View>
      </View>
    </Modal>
  );
};

export const RecurringCategorySelector: React.FC<RecurringCategorySelectorProps> = ({ visible, onClose, onSelect, selectedCategory }) => {
  const renderItem = ({ item }: { item: RecurringOption }) => (
    <TouchableOpacity
      style={[styles.item, selectedCategory === item.value && styles.itemSelected]}
      onPress={() => {
        onSelect(item);
        onClose();
      }}
    >
      <Text variant='body' color={selectedCategory === item.value ? theme.colors.primary : theme.colors.text.primary} style={selectedCategory === item.value && styles.rateTextSelected}>
        {item.label}
      </Text>
      {selectedCategory === item.value && <View style={styles.checkmark} />}
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType='slide' onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text variant='h2'>Select a category</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>

          <FlatList data={RECURRING_CATEGORIES} renderItem={renderItem} keyExtractor={(item) => item.value} contentContainerStyle={styles.listContent} />
        </View>
      </View>
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
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  listContent: {
    padding: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}05`,
  },
  rateTextSelected: {
    fontWeight: '600',
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
  },
});
