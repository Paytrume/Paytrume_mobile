// src/app/code-details.tsx
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { AlertCircle, Check, ChevronLeft, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Modal, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { Text } from '../components/typography/Text';
import { Button } from '../components/ui/Button';
import { theme } from '../theme';

import kettle from '../../assets/images/kettle.png';

interface DisputeReason {
  id: string;
  label: string;
}

const disputeReasons: DisputeReason[] = [
  { id: '1', label: 'Agreed price of item is incorrect' },
  { id: '2', label: 'Price is too expensive' },
  { id: '3', label: "I don't need it anymore" },
];

export default function CodeDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showDisputeSheet, setShowDisputeSheet] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [isDisputing, setIsDisputing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Mock data - in real app, fetch by transaction code
  const productData = {
    title: 'Electric kettle',
    amount: 'N15,000.00',
    description: 'This is a description of what the work for the logo design job would entail.',
    dateCreated: '25th Oct, 2025',
    sellerEmail: 'examplecustomer@email.com',
    transactionCode: (params.code as string) || '839heuf7',
  };

  const handleProceedToPayment = () => {
    Alert.alert('Proceed to Payment', `You are about to pay ${productData.amount} for ${productData.title}`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Continue',
        onPress: () => {
          // Navigate to payment screen
          Alert.alert('Success', 'Payment initiated successfully');
        },
      },
    ]);
  };

  const handleDispute = async () => {
    if (!selectedReason) {
      Alert.alert('Please select a reason', 'Choose a reason for disputing this transaction');
      return;
    }

    setIsDisputing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsDisputing(false);
    setShowDisputeSheet(false);
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    router.back(); // Go back after dispute
  };

  const renderDisputeSheet = () => (
    <Modal visible={showDisputeSheet} transparent animationType='slide' onRequestClose={() => setShowDisputeSheet(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.bottomSheet}>
          <View style={styles.sheetHeader}>
            <Text variant='h2' style={styles.sheetTitle}>
              Dispute this transaction?
            </Text>
            <TouchableOpacity onPress={() => setShowDisputeSheet(false)}>
              <X size={24} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <Text variant='body' color={theme.colors.text.secondary} style={styles.sheetSubtitle}>
            Select a reason why you would like to dispute this transaction
          </Text>

          <View style={styles.reasonsList}>
            {disputeReasons.map((reason) => (
              <TouchableOpacity key={reason.id} style={[styles.reasonItem, selectedReason === reason.id && styles.reasonItemSelected]} onPress={() => setSelectedReason(reason.id)}>
                <Text variant='body' color={selectedReason === reason.id ? theme.colors.primary : theme.colors.text.primary} style={selectedReason === reason.id && styles.reasonTextSelected}>
                  {reason.label}
                </Text>
                <View style={styles.radioCircle}>{selectedReason === reason.id && <View style={styles.radioSelected} />}</View>
              </TouchableOpacity>
            ))}
          </View>

          <Button title='Dispute transaction' onPress={handleDispute} style={styles.disputeButton} loading={isDisputing} />
        </View>
      </View>
    </Modal>
  );

  const renderSuccessModal = () => (
    <Modal visible={showSuccessModal} transparent animationType='fade' onRequestClose={handleCloseSuccessModal}>
      <View style={styles.modalOverlay}>
        <View style={styles.successModal}>
          <View style={styles.successIcon}>
            <Check size={48} color={theme.colors.primary} />
          </View>
          <Text variant='h2' style={styles.successTitle}>
            Transaction disputed
          </Text>
          <Text variant='body' color={theme.colors.text.secondary} style={styles.successMessage}>
            Your seller will be notified of the update.
          </Text>
          <Button title='Done' onPress={handleCloseSuccessModal} style={styles.successButton} />
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Product details',
          headerBackTitle: 'Back',
          headerTintColor: theme.colors.primary,
          headerStyle: styles.headBg,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ChevronLeft size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => setShowDisputeSheet(true)} style={styles.disputeIcon}>
              <AlertCircle size={24} color={theme.colors.state.error} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title and Amount */}
        <View style={styles.headerSection}>
          <Text variant='body' style={styles.title}>
            {productData.title}
          </Text>
          <Text variant='body' style={styles.amount}>
            {productData.amount}
          </Text>
        </View>

        {/* Description */}
        <Text variant='body' color={theme.colors.text.secondary} style={styles.description}>
          {productData.description}
        </Text>

        {/* Date and Seller */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text variant='small' color={theme.colors.text.tertiary} style={styles.infoLabel}>
              Date created
            </Text>
            <Text variant='body' style={styles.infoValue}>
              {productData.dateCreated}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text variant='small' color={theme.colors.text.tertiary} style={styles.infoLabel}>
              Seller email
            </Text>
            <Text variant='body' style={styles.infoValue}>
              {productData.sellerEmail}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text variant='small' color={theme.colors.text.tertiary} style={styles.infoLabel}>
              Transaction code
            </Text>
            <Text variant='body' style={styles.codeValue}>
              {productData.transactionCode}
            </Text>
          </View>
        </View>

        <View style={styles.imageContainer}>
          <Image source={kettle} resizeMode='contain' />
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Proceed to Payment Button */}
      <View style={styles.footer}>
        <Button title='Proceed to make payment' onPress={handleProceedToPayment} style={styles.payButton} />
      </View>

      {renderDisputeSheet()}
      {renderSuccessModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  disputeIcon: {
    padding: 8,
    marginRight: 8,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  headerSection: {
    marginBottom: 24,
    fontWeight: '700',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginBottom: 12,
  },
  amount: {
    color: theme.colors.primary,
  },
  description: {
    lineHeight: 24,
    marginBottom: 24,
  },
  divider: {
    height: 0.5,
    backgroundColor: theme.colors.primary,
    marginVertical: 2,
  },
  infoSection: {
    gap: 20,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    backgroundColor: `${theme.colors.primary}10`,
  },
  infoRow: {
    flex: 1,
    gap: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontWeight: '500',
  },
  infoValue: {
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  codeValue: {
    fontWeight: '600',
    color: theme.colors.primary,
    fontFamily: 'monospace',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background.primary,
    padding: 24,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  payButton: {
    width: '100%',
  },
  bottomPadding: {
    height: 40,
  },
  // Bottom Sheet Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: theme.colors.background.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 34,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 20,
  },
  sheetSubtitle: {
    marginBottom: 24,
    lineHeight: 20,
  },
  reasonsList: {
    marginBottom: 24,
    gap: 16,
  },
  reasonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: 12,
    gap: 12,
  },
  reasonItemSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}05`,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.border.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  reasonTextSelected: {
    fontWeight: '500',
  },
  disputeButton: {
    backgroundColor: theme.colors.state.error,
  },
  // Success Modal Styles
  successModal: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 24,
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${theme.colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  successMessage: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  successButton: {
    width: '100%',
  },
  headBg: { backgroundColor: `${theme.colors.primary}15` },
  imageContainer: {
    marginBottom: 24,
  },
});
