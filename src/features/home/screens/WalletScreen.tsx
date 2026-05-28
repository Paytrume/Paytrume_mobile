import { Text } from '@/components/typography/Text';
import { useCustomersStore } from '@/store/customers.store';
import { useTransactionsStore } from '@/store/transactions.store';
import { theme } from '@/theme';
import { Transaction } from '@/types/transaction.types';
import { router } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TransactionItem } from '../components/TransactionItem';

//images
import empty from '../../../../assets/images/empty.png';

const { width, height } = Dimensions.get('window');

export const WalletScreen: React.FC = () => {
  const { userBalanceData } = useCustomersStore();
  const { transactions, isLoading } = useTransactionsStore();
  const { selectTransaction } = useTransactionsStore();
  const [showBalance, setShowBalance] = useState(true);

  const handleTransactionPress = useCallback(
    (transaction: Transaction) => {
      selectTransaction(transaction);
      router.push({
        pathname: '/transaction-detail',
        params: {
          transaction: JSON.stringify(transaction),
        },
      });
    },
    [selectTransaction],
  );
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        {/* Available to Withdraw Section */}
        <View style={styles.withdrawalSection}>
          <View style={styles.balanceHeader}>
            <Text variant='body' color={theme.colors.text.tertiary}>
              Available balance
            </Text>

            <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
              {showBalance ? <Eye size={18} color={theme.colors.text.tertiary} /> : <EyeOff size={18} color={theme.colors.text.secondary} />}
            </TouchableOpacity>
          </View>

          <Text variant='h1' style={styles.withdrawalAmount}>
            {showBalance
              ? `₦${(Number(userBalanceData?.availableBalance) || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : '*******'}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.button.primary }]} onPress={() => router.push('/payout')}>
            <Text variant='small' style={[styles.actionLabel, { color: theme.colors.text.inverse }]}>
              Request withdrawal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.state.activeWithOpacity[15] }]} onPress={() => router.push('/(profile)/payment-methods')}>
            <Text variant='small' style={[styles.actionLabel, { color: theme.colors.primary }]} numberOfLines={1} ellipsizeMode='tail'>
              Manage accounts
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions Header */}
        {transactions.length > 0 && (
          <View style={styles.recentHeader}>
            <Text variant='body' style={styles.recentTitle}>
              Recent history
            </Text>
            {transactions.length > 5 && (
              <TouchableOpacity onPress={() => router.push('/(wallet)/all-transactions')}>
                <Text variant='small' color={theme.colors.primary}>
                  See all
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size='large' color={theme.colors.primary} />
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Image source={empty} style={styles.image} resizeMode='contain' />
        <Text variant='body' color={theme.colors.text.tertiary}>
          No wallet activity here yet
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={transactions.slice(0, 5)} // Show first 5 transactions
        renderItem={({ item }) => <TransactionItem transaction={item} onPress={handleTransactionPress} />}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  balanceHeader: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  withdrawalSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  withdrawalAmount: {
    marginTop: 8,
    color: theme.colors.text.primary,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    textAlign: 'center',
    color: theme.colors.text.primary,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 8,
  },
  recentTitle: {
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    height: height * 0.5,
    marginHorizontal: 14,
    backgroundColor: theme.colors.state.activeWithOpacity[10],
    borderRadius: 10,
  },
  image: {
    width: width * 0.3,
    height: width * 0.3,
  },
});
