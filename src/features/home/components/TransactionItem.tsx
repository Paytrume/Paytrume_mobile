import { ArrowDownLeft, ArrowUpRight, ClockArrowDown } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../../../components/typography/Text';
import { theme } from '../../../theme';
import { Transaction } from '../../../types/transaction.types';

interface TransactionItemProps {
  transaction: Transaction;
  onPress: (transaction: Transaction) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onPress }) => {
  const getIconComponent = () => {
    switch (transaction.direction) {
      case 'credit':
        return <ArrowDownLeft size={20} color={theme.colors.state.success} />;
      case 'debit':
        return <ArrowUpRight size={20} color={theme.colors.primary} />;
      default:
        return <ArrowDownLeft size={20} color={theme.colors.primary} />;
    }
  };

  const getIconBackgroundColor = () => {
    switch (transaction.status) {
      case 'complete':
        return theme.colors.state.success + '20';
      case 'pending':
        return theme.colors.state.warning + '20';
      case 'cancel':
        return theme.colors.state.error + '20';
      default:
        return theme.colors.primary + '20';
    }
  };

  const isIncoming = transaction.status === 'complete' && transaction.direction === 'credit';
  const amountColor = isIncoming ? theme.colors.state.success : theme.colors.text.primary;

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(transaction)}>
      <View style={[styles.iconContainer, { backgroundColor: getIconBackgroundColor() }]}>{isIncoming ? getIconComponent() : <ClockArrowDown size={30} color={theme.colors.text.tertiary} />}</View>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text variant='body' style={styles.title}>
            {transaction.direction === 'credit' ? 'Payment Received' : 'Money Withdrawn'}
          </Text>
          <View style={styles.amountContainer}>
            {isIncoming ? <ArrowDownLeft size={20} color={theme.colors.state.success} /> : <ClockArrowDown size={20} color={theme.colors.text.tertiary} />}
            <Text variant='body' style={{ color: amountColor }}>
              ₦{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        <View style={styles.descriptionRow}>
          <Text variant='small' color={theme.colors.text.tertiary} numberOfLines={1} style={styles.description}>
            {transaction.product_description}
          </Text>
          <Text variant='small' color={theme.colors.text.tertiary}>
            {new Date(transaction.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
  descriptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    flex: 1,
  },
  amountContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
  },
});
