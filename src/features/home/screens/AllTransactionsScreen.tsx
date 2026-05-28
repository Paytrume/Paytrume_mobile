import { Text } from '@/components/typography/Text';
import { useTransactions } from '@/hooks/use-transactions';
import { theme } from '@/theme';
import { Transaction } from '@/types/transaction.types';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TransactionItem } from '../components/TransactionItem';

export const AllTransactionsScreen: React.FC = () => {
  const { transactions, isLoading, selectTransaction } = useTransactions();

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

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <ChevronLeft size={24} color={theme.colors.text.primary} />
      </TouchableOpacity>
      <Text variant='h2'>All Transactions</Text>
      <View style={styles.spacer} />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text variant='body' color={theme.colors.text.tertiary}>
        No transactions found
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!isLoading || transactions.length === 0) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size='small' color={theme.colors.primary} />
      </View>
    );
  };
  console.log(transactions, 'transactions');

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={transactions}
        renderItem={({ item }) => <TransactionItem transaction={item} onPress={handleTransactionPress} />}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  spacer: {
    width: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
