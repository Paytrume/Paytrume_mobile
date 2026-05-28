import { usePayout } from '@/hooks/use-payout';
import { theme } from '@/theme';
import { truncateString } from '../../../utils/string';
import { Plus, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../../../components/typography/Text';
import { AddBankModal } from './AddBankModal';

export const PaymentMethodsScreen: React.FC = () => {
  const { payoutDestinations, isLoading, error, getPayoutDestinations, deletePayoutDestination, clearError } = usePayout();

  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch payout destinations on mount
  useEffect(() => {
    getPayoutDestinations();
  }, [getPayoutDestinations]);

  const handleDeleteBank = (bankId: string, bankName: string) => {
    Alert.alert('Delete Bank Account', `Are you sure you want to remove ${bankName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePayoutDestination(bankId);
            Alert.alert('Success', 'Bank account deleted successfully');
          } catch {
            Alert.alert('Error', 'Failed to delete bank account');
          }
        },
      },
    ]);
  };

  const handleAddBankSuccess = () => {
    setShowAddModal(false);
    getPayoutDestinations(); // Refresh the list
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (!accountNumber) return 'N/A';
    const last4 = accountNumber.slice(-4);
    return `**** ${last4}`;
  };

  console.log(payoutDestinations);

  const renderBankItem = ({ item, index }: { item: any; index: number }) => (
    <View style={[styles.bankCard, index === 0 && styles.primaryCard]}>
      <View style={styles.bankInfo}>
        <Text variant='body' style={styles.bankName}>
          {truncateString(item.acct_name, 17)}
        </Text>
        <Text variant='small' color={theme.colors.text.tertiary} style={styles.accountNumber}>
          {maskAccountNumber(`${item.acct_num}`)}
        </Text>
        <Text variant='small' color={theme.colors.text.tertiary} style={styles.accountNumber}>
          {item.bank_name}
        </Text>
      </View>
      <View style={styles.cardActions}>
        {index === 0 && (
          <View style={styles.primaryBadge}>
            <Text variant='small' style={styles.primaryBadgeText}>
              Primary
            </Text>
          </View>
        )}
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteBank(item._id || item.id, item.account_name || item.account_number)}>
          <Trash2 size={18} color={theme.colors.state.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text variant='h3' style={styles.emptyTitle}>
        No Bank Accounts
      </Text>
      <Text variant='body' color={theme.colors.text.tertiary} style={styles.emptyDescription}>
        Add a bank account to receive payouts
      </Text>
    </View>
  );

  const renderContent = () => (
    <View style={styles.contentWrapper}>
      {/* Saved Accounts Section */}
      <View style={styles.section}>
        <Text variant='h3' style={styles.sectionTitle}>
          Saved Accounts
        </Text>
        <Text variant='body' color={theme.colors.text.tertiary} style={styles.sectionDescription}>
          Manage bank accounts where you withdraw your secure funds.
        </Text>
      </View>

      {/* Bank Accounts List */}
      {payoutDestinations && payoutDestinations.length > 0 ? (
        <FlatList data={payoutDestinations} renderItem={renderBankItem} keyExtractor={(item) => item._id || item.id} scrollEnabled={false} nestedScrollEnabled={false} />
      ) : (
        renderEmptyState()
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>

      {/* Add Bank Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
        <Plus size={24} color={theme.colors.raw.white} />
        <Text variant='body' style={styles.addButtonText}>
          Add New Bank Account
        </Text>
      </TouchableOpacity>

      {/* Add Bank Modal */}
      <AddBankModal visible={showAddModal} onClose={() => setShowAddModal(false)} onSuccess={handleAddBankSuccess} />

      {/* Error Alert */}
      {error && (
        <View style={styles.errorContainer}>
          <Text variant='small' color={theme.colors.state.error}>
            {error}
          </Text>
          <TouchableOpacity onPress={clearError}>
            <Text variant='small' color={theme.colors.primary}>
              Dismiss
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size='large' color={theme.colors.primary} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 100,
  },
  contentWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  sectionDescription: {
    lineHeight: 20,
  },
  bankCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  primaryCard: {
    backgroundColor: `${theme.colors.primary}15`,
    borderColor: theme.colors.primary,
  },
  bankInfo: {
    flex: 1,
  },
  bankName: {
    marginBottom: 4,
    fontWeight: '600',
  },
  accountNumber: {
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryBadge: {
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  primaryBadgeText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    left: 16,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addButtonText: {
    color: theme.colors.raw.white,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 48,
  },
  emptyTitle: {
    marginBottom: 4,
  },
  emptyDescription: {
    textAlign: 'center',
  },
  errorContainer: {
    position: 'absolute',
    bottom: 100,
    left: 24,
    right: 24,
    backgroundColor: theme.colors.state.error,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
