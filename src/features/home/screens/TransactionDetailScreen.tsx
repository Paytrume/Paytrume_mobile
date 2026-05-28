import { Text } from '@/components/typography/Text';
import { theme } from '@/theme';
import { Transaction } from '@/types/transaction.types';
import * as FileSystem from 'expo-file-system/legacy';
import { useLocalSearchParams } from 'expo-router';
import { ArrowDownLeft, ClockArrowDown, Download } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export const TransactionDetailScreen: React.FC = () => {
  const params = useLocalSearchParams();

  const transaction: Transaction = React.useMemo(() => {
    return JSON.parse(params.transaction as string);
  }, [params.transaction]);

  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownloadReceipt = async () => {
    if (!transaction?.receipt_url) {
      Alert.alert('Error', 'Receipt not available for this transaction');
      return;
    }

    setIsDownloading(true);
    try {
      const receiptName = `receipt_${transaction?.reference_id || transaction?._id}.pdf`;
      const dirPath = `${FileSystem.cacheDirectory}`;
      const localPath = `${dirPath}${receiptName}`;

      // Create directory if it doesn't exist
      await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true }).catch(() => {
        // Directory might already exist
      });

      await FileSystem.downloadAsync(transaction?.receipt_url, localPath);

      Alert.alert('Success', `Receipt downloaded to ${localPath}`, [
        {
          text: 'OK',
          onPress: () => {},
        },
      ]);
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download receipt. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const getStatusColor = () => {
    switch (transaction?.status) {
      case 'complete':
        return theme.colors.state.success;
      case 'pending':
        return theme.colors.state.warning;
      case 'cancel':
        return theme.colors.state.error;
      default:
        return theme.colors.text.tertiary;
    }
  };

  const isIncoming = transaction.status === 'complete' && transaction.direction === 'credit';
  const amountColor = isIncoming ? theme.colors.state.success : theme.colors.text.primary;

  console.log(Object.values(transaction), transaction, 'transaction');

  //   [
  //     'escrow_ref',
  //     '_id',
  //     'product_id',
  //     'buyer_id',
  //     'seller_id',
  //     'status',
  //     'transaction_success_id',
  //     'amount',
  //     'balance_before',
  //     'balance_after',
  //     'deposit_log_id',
  //     'withdrawal_id',
  //     'createdAt',
  //     'updatedAt',
  //     '__v',
  //     'direction',
  //     'payment_link',
  //   ];

  // [
  //   { access_code: 'wuxzzt7upyg8afu', authorization_url: 'https://checkout.paystack.com/wuxzzt7upyg8afu', reference: '6a181f3b674cc5cfe1904949' },
  //   '6a181f3b674cc5cfe190494b',
  //   {
  //     _id: '6a181f3b674cc5cfe1904949',
  //     buyer_email: 'eifezulike@gmail.com',
  //     buyer_phone: '08136300744',
  //     createdAt: '2026-05-28T10:55:55.258Z',
  //     customer_paid: { createdAt: '2026-05-28T11:10:44.618Z', status: true, updatedAt: '2026-05-28T11:10:44.618Z' },
  //     payment_category: 'weekly',
  //     payment_type: 'one-time',
  //     product_description: 'Nice bag',
  //     product_images: 'https://res.cloudinary.com/ifezulike/image/upload/v1779965752/vgwdcwvenr7rfg6yotuz.jpg',
  //     product_name: 'Bag',
  //     product_price: '10000',
  //     seller_email: 'bossbtk@gmail.com',
  //     type: 'goods',
  //     updatedAt: '2026-05-28T11:10:44.618Z',
  //   },
  //   '6a17eca6b921a83c06e918b0',
  //   '6a0a968f373fe91b9b0f20fd',
  //   'payment-in-escrow',
  //   6195733382,
  //   10000,
  //   0,
  //   10000,
  //   '6a1822b4674cc5cfe1904b16',
  //   null,
  //   '2026-05-28T10:55:55.269Z',
  //   '2026-05-28T11:10:45.058Z',
  //   0,
  //   'credit',
  //   'https://checkout.paystack.com/wuxzzt7upyg8afu',
  // ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Transaction Summary */}
        <View style={styles.summaryContainer}>
          <View style={{ backgroundColor: getStatusColor() + '20', padding: 15, borderRadius: 100 }}>
            {isIncoming ? <ArrowDownLeft size={50} color={theme.colors.state.success} /> : <ClockArrowDown size={50} color={theme.colors.text.tertiary} />}
          </View>
          <Text variant='h1' style={{ color: amountColor, textAlign: 'center', margin: 10 }}>
            {transaction?.currency} {transaction?.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          {/* Status Badge */}
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
              <Text variant='small' style={{ color: getStatusColor(), textTransform: 'capitalize' }}>
                {transaction?.status}
              </Text>
            </View>
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text variant='small' color={theme.colors.text.tertiary}>
              Date & Time
            </Text>
            <Text variant='body'>{new Date(transaction?.createdAt).toLocaleString()}</Text>
          </View>

          {transaction?._id && (
            <View style={styles.detailRow}>
              <Text variant='small' color={theme.colors.text.tertiary}>
                Reference ID
              </Text>
              <Text variant='body'>{transaction?._id}</Text>
            </View>
          )}

          {transaction?.product_id && (
            <View style={styles.detailRow}>
              <Text variant='small' color={theme.colors.text.tertiary}>
                Customer Email
              </Text>
              <Text variant='body'>{transaction?.product_id.buyer_email}</Text>
            </View>
          )}

          {transaction?.product_id && (
            <View style={styles.detailRow}>
              <Text variant='small' color={theme.colors.text.tertiary}>
                Payment Type
              </Text>
              <Text variant='body'>{transaction?.product_id.payment_type}</Text>
            </View>
          )}

          {transaction?.product_id && (
            <View style={styles.detailRow}>
              <Text variant='small' color={theme.colors.text.tertiary}>
                Product ID
              </Text>
              <Text variant='body'>{transaction?.product_id._id}</Text>
            </View>
          )}
        </View>

        {/* Download Receipt Button */}
        {transaction?.receipt_url && (
          <TouchableOpacity style={[styles.downloadButton, isDownloading && styles.downloadButtonDisabled]} onPress={handleDownloadReceipt} disabled={isDownloading}>
            {isDownloading ? (
              <ActivityIndicator size='small' color={theme.colors.raw.white} />
            ) : (
              <>
                <Download size={20} color={theme.colors.raw.white} />
                <Text variant='body' style={styles.downloadButtonText}>
                  Download Receipt
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}

        <View style={styles.footer} />
      </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  summaryContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    marginTop: 12,
    fontWeight: '600',
  },
  description: {
    marginTop: 4,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  detailsSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  downloadButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  downloadButtonDisabled: {
    opacity: 0.6,
  },
  downloadButtonText: {
    color: theme.colors.raw.white,
    marginLeft: 8,
    fontWeight: '600',
  },
  footer: {
    height: 24,
  },
});
