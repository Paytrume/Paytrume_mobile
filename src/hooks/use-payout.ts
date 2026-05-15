import { usePayoutStore } from '../store/payout.store';

export const usePayout = () => {
  const {
    nigerianBanks,
    payoutDestinations,
    resolvedAccount,
    balance,
    ledger,
    isLoading,
    error,
    getBanks,
    getPayoutDestinations,
    addPayoutDestination,
    deletePayoutDestination,
    resolveAccount,
    getSellerBalance,
    getSellerLedger,
    requestPayout,
    request2FA,
    clearError,
    resetPayout,
  } = usePayoutStore();

  return {
    nigerianBanks,
    payoutDestinations,
    resolvedAccount,
    balance,
    ledger,
    isLoading,
    error,
    getBanks,
    getPayoutDestinations,
    addPayoutDestination,
    deletePayoutDestination,
    resolveAccount,
    getSellerBalance,
    getSellerLedger,
    requestPayout,
    request2FA,
    clearError,
    resetPayout,
  };
};
