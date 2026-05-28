import { usePayout } from '@/hooks/use-payout';
import { theme } from '@/theme';
import { ChevronDown } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Text } from '../../../components/typography/Text';
import { ResolveAccountModal } from './ResolveAccountModal';

interface Bank {
  id: string;
  name: string;
  code: string;
}

interface AddBankModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddBankModal: React.FC<AddBankModalProps> = ({ visible, onClose, onSuccess }) => {
  const { nigerianBanks, getBanks, resolveAccount, resolvedAccount, isLoading, addPayoutDestination } = usePayout();

  const [step, setStep] = useState<'bank-select' | 'account-input' | 'confirm'>('bank-select');
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [searchBankText, setSearchBankText] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);

  // Fetch banks when modal opens
  useEffect(() => {
    if (visible && step === 'bank-select') {
      const fetchBanks = async () => {
        try {
          await getBanks();
        } catch (err) {
          console.error('Error fetching banks:', err);
        }
      };
      fetchBanks();
    }
  }, [visible, step, getBanks]);

  // Map API banks to our interface
  const formattedBanks: Bank[] = (nigerianBanks || []).map((bank: any) => ({
    id: bank.code || bank.id,
    name: bank.name,
    code: bank.code,
  }));

  const filteredBanks = formattedBanks.filter((bank) => bank.name.toLowerCase().includes(searchBankText.toLowerCase()));

  const handleSelectBank = (bank: Bank) => {
    setSelectedBank(bank);
    setShowBankDropdown(false);
    setSearchBankText('');
  };

  const handleResolveAccount = async () => {
    if (!selectedBank || !accountNumber.trim()) {
      Alert.alert('Error', 'Please select a bank and enter account number');
      return;
    }

    setIsResolving(true);
    try {
      await resolveAccount(selectedBank.code, accountNumber);
      setShowResolveModal(true);
    } catch {
      Alert.alert('Error', 'Failed to resolve account. Please check the details and try again.');
    } finally {
      setIsResolving(false);
    }
  };

  const handleConfirmAddBank = async () => {
    if (!selectedBank || !resolvedAccount) {
      Alert.alert('Error', 'Please resolve account details first');
      return;
    }

    try {
      await addPayoutDestination({
        bank_code: selectedBank.code,
        acct_num: resolvedAccount.account_number,
        acct_name: resolvedAccount.account_name,
      });

      Alert.alert('Success', 'Bank account added successfully');
      setShowResolveModal(false);
      resetForm();
      onSuccess();
    } catch (error: any) {
      let errorMessage = 'Failed to add bank account. Please try again.';
      if (error.response?.data) {
        errorMessage = error.response.data.message || errorMessage;
      }
      Alert.alert('Error', errorMessage);
    }
  };

  const resetForm = () => {
    setStep('bank-select');
    setSelectedBank(null);
    setAccountNumber('');
    setSearchBankText('');
    setShowBankDropdown(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <>
      <Modal visible={visible && !showResolveModal} transparent animationType='slide'>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose}>
              <Text variant='body' color={theme.colors.primary}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text variant='h3'>Add Bank Account</Text>
            <View style={styles.spacer} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
            {/* Step 1: Select Bank */}
            <View style={styles.section}>
              <Text variant='body' style={styles.label}>
                Select Bank *
              </Text>
              <TouchableOpacity style={styles.dropdown} onPress={() => setShowBankDropdown(!showBankDropdown)}>
                <Text variant='body' color={selectedBank ? theme.colors.text.primary : theme.colors.text.tertiary}>
                  {selectedBank ? selectedBank.name : 'Choose a bank'}
                </Text>
                <ChevronDown size={20} color={theme.colors.text.tertiary} />
              </TouchableOpacity>

              {showBankDropdown && (
                <View style={styles.dropdownContent}>
                  <TextInput style={styles.searchInput} placeholder='Search banks...' placeholderTextColor={theme.colors.text.tertiary} value={searchBankText} onChangeText={setSearchBankText} />
                  <FlatList
                    data={filteredBanks}
                    renderItem={({ item }) => (
                      <TouchableOpacity style={styles.bankOption} onPress={() => handleSelectBank(item)}>
                        <Text variant='body'>{item.name}</Text>
                        <Text variant='small' color={theme.colors.text.tertiary}>
                          {item.code}
                        </Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.code}
                    scrollEnabled={false}
                    maxToRenderPerBatch={20}
                  />
                </View>
              )}
            </View>

            {/* Step 2: Account Number */}
            {selectedBank && (
              <View style={styles.section}>
                <Text variant='body' style={styles.label}>
                  Account Number *
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder='Enter account number'
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  keyboardType='number-pad'
                  editable={!isResolving}
                />
              </View>
            )}

            {/* Resolve Button */}
            {selectedBank && accountNumber.trim() && (
              <TouchableOpacity style={[styles.button, isResolving && styles.buttonDisabled]} onPress={handleResolveAccount} disabled={isResolving}>
                {isResolving ? (
                  <ActivityIndicator size='small' color={theme.colors.raw.white} />
                ) : (
                  <Text variant='body' style={styles.buttonText}>
                    Resolve Account
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Resolve Account Modal */}
      <ResolveAccountModal
        visible={showResolveModal}
        resolvedAccount={resolvedAccount}
        isLoading={isLoading}
        onConfirm={handleConfirmAddBank}
        onCancel={() => {
          setShowResolveModal(false);
          setAccountNumber('');
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  spacer: {
    width: 50,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.background.secondary,
  },
  dropdownContent: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: 8,
    backgroundColor: theme.colors.background.secondary,
    maxHeight: 300,
    overflow: 'hidden',
  },
  searchInput: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: theme.colors.text.primary,
  },
  bankOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border.light,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.secondary,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: theme.colors.raw.white,
    fontWeight: '600',
  },
});
