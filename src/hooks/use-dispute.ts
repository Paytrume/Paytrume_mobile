import { useDisputeStore } from '../store/dispute.store';

export const useDispute = () => {
  const { disputes, isLoading, error, raiseDispute, getAllDisputes, deleteDispute, clearError, resetDisputes } = useDisputeStore();

  return {
    disputes,
    isLoading,
    error,
    raiseDispute,
    getAllDisputes,
    deleteDispute,
    clearError,
    resetDisputes,
  };
};
