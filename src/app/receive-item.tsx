// src/app/receive-item.tsx
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../components/typography/Text';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useProductsStore } from '../store/products.store';
import { theme } from '../theme';

export default function ReceiveItemScreen() {
  const router = useRouter();
  const [transactionCode, setTransactionCode] = useState('');
  // const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { getSingleProduct, isLoading, error: errorState } = useProductsStore();

  const handleViewProductDetails = async () => {
    if (!transactionCode.trim()) {
      setError('Please enter a transaction code');
      return;
    }
    setError('');

    try {
      await getSingleProduct(transactionCode);

      // Navigate to code details page only on success
      router.push({
        pathname: '/code-details',
        params: { code: transactionCode },
      });
    } catch (err) {
      Alert.alert('Error', errorState || 'Invalid transaction code. Please check and try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Receive an item',
          headerBackTitle: 'Back',
          headerTintColor: theme.colors.primary,
          headerStyle: styles.headBg,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ChevronLeft size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.content}>
        {/* Description */}
        <Text variant='body' color={theme.colors.text.secondary} style={styles.description}>
          Pay for an item by entering the transaction code provided by your seller.
        </Text>

        {/* Transaction Code Input */}
        <View style={styles.inputContainer}>
          <Input
            label='Transaction code'
            value={transactionCode}
            onChangeText={(text) => {
              setTransactionCode(text);
              setError('');
            }}
            placeholder='e.g. 839heuf7'
            error={error}
            touched={!!error}
            autoCapitalize='none'
            autoCorrect={false}
          />

          {/* QR Code Scanner Button */}
          {/* <TouchableOpacity style={styles.qrButton} onPress={handleScanQR}>
            <QrCode size={24} color={theme.colors.primary} />
            <Text variant='small' color={theme.colors.primary} style={styles.qrText}>
              Scan QR
            </Text>
          </TouchableOpacity> */}
        </View>

        {/* View Product Details Button */}
        <Button
          title={isLoading ? 'Loading...' : 'See product details'}
          onPress={handleViewProductDetails}
          style={styles.viewButton}
          disabled={isLoading || !transactionCode.trim()}
          loading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  description: {
    marginBottom: 32,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 32,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: 8,
    backgroundColor: theme.colors.background.secondary,
  },
  qrText: {
    fontWeight: '500',
  },
  viewButton: {
    marginTop: 'auto',
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  headBg: { backgroundColor: `${theme.colors.primary}15` },
});
