import { theme } from '@/theme';
import { Check } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Modal, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../../../components/typography/Text';

interface ResolveAccountModalProps {
  visible: boolean;
  resolvedAccount: any;
  isLoading: boolean;
  bankName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ResolveAccountModal: React.FC<ResolveAccountModalProps> = ({ visible, resolvedAccount, isLoading, bankName, onConfirm, onCancel }) => {
  return (
    <Modal visible={visible} transparent animationType='fade'>
      <SafeAreaView style={styles.container}>
        <View style={styles.backdrop} />
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Check size={32} color={theme.colors.state.success} />
            </View>
            <Text variant='h2' style={styles.title}>
              Confirm Account
            </Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {resolvedAccount && (
              <>
                <View style={styles.detailsSection}>
                  <Text variant='small' color={theme.colors.text.tertiary} style={styles.label}>
                    Account Name
                  </Text>
                  <Text variant='body' style={styles.value}>
                    {resolvedAccount.account_name || 'N/A'}
                  </Text>
                </View>

                {resolvedAccount.account_number && (
                  <View style={styles.detailsSection}>
                    <Text variant='small' color={theme.colors.text.tertiary} style={styles.label}>
                      Account Number
                    </Text>
                    <Text variant='body' style={styles.value}>
                      {resolvedAccount.account_number}
                    </Text>
                  </View>
                )}

                {bankName && (
                  <View style={styles.detailsSection}>
                    <Text variant='small' color={theme.colors.text.tertiary} style={styles.label}>
                      Bank
                    </Text>
                    <Text variant='body' style={styles.value}>
                      {bankName}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>

          {/* Description */}
          <View style={styles.description}>
            <Text variant='small' color={theme.colors.text.tertiary} style={styles.descriptionText}>
              Please verify the account details are correct before proceeding. You can use this account to receive payouts.
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel} disabled={isLoading}>
              <Text variant='body' color={theme.colors.primary} style={styles.buttonLabel}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.confirmButton, isLoading && styles.buttonDisabled]} onPress={onConfirm} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size='small' color={theme.colors.raw.white} />
              ) : (
                <Text variant='body' style={styles.confirmButtonLabel}>
                  Save
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modal: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    width: '85%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${theme.colors.state.success}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    textAlign: 'center',
  },
  content: {
    marginBottom: 24,
  },
  detailsSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  label: {
    marginBottom: 4,
  },
  value: {
    fontWeight: '600',
  },
  description: {
    marginBottom: 24,
  },
  descriptionText: {
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonLabel: {
    fontWeight: '600',
  },
  confirmButtonLabel: {
    color: theme.colors.raw.white,
    fontWeight: '600',
  },
});
