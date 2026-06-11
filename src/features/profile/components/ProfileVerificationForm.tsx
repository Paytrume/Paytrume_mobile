// src/features/profile/components/ProfileVerificationForm.tsx
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { CheckCircle, Edit2, FileText, Lock, Upload } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../../../components/typography/Text';
import { Button } from '../../../components/ui/Button';
import { useKycStore } from '../../../store/kyc.store';
import { theme } from '../../../theme';
import { uploadImageToCloudinary } from '../../../utils/cloudinary';
import { DOCUMENT_TYPES, VerificationDocument } from '../profile.types';
import { DocumentTypeSelector } from './DocumentTypeSelector';

export const ProfileVerificationForm: React.FC = () => {
  const router = useRouter();
  const {
    submitDocuments,
    updateDocuments,
    fetchKycDocuments,
    isLoading: isSubmitting,
    status,
    documentType: storedDocumentType,
    frontImageUrl: storedFrontImageUrl,
    backImageUrl: storedBackImageUrl,
    proofOfAddressUrl: storedProofOfAddressUrl,
    rejectionReason,
  } = useKycStore();

  const [isUploading, setIsUploading] = useState(false);
  const [showDocumentTypeModal, setShowDocumentTypeModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [verificationData, setVerificationData] = useState<VerificationDocument>({
    documentType: null,
    frontImage: null,
    backImage: null,
    proofOfAddress: null,
  });

  // Fetch KYC documents on mount
  useEffect(() => {
    fetchKycDocuments();
  }, [fetchKycDocuments]);

  // Load existing documents into state
  useEffect(() => {
    if (storedDocumentType && storedFrontImageUrl) {
      setVerificationData({
        documentType: storedDocumentType as any,
        frontImage: storedFrontImageUrl,
        backImage: storedBackImageUrl,
        proofOfAddress: storedProofOfAddressUrl,
      });
      // Can only edit if status is PENDING or REJECTED
      if (status === 'pending' || status === 'rejected') {
        setIsEditMode(true);
      }
    }
  }, [storedDocumentType, storedFrontImageUrl, storedBackImageUrl, storedProofOfAddressUrl, status]);

  // Check if user has existing documents
  const hasExistingDocuments = storedDocumentType && storedFrontImageUrl && storedBackImageUrl && storedProofOfAddressUrl;
  const canEdit = hasExistingDocuments && (status === 'pending' || status === 'rejected');

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return cameraStatus === 'granted' && libraryStatus === 'granted';
  };

  const pickImage = async (type: 'front' | 'back' | 'address') => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Please grant camera and photo library permissions to upload documents.');
      return;
    }

    setIsUploading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const selectedUri = result.assets[0].uri;

        if (type === 'front') {
          setVerificationData((prev) => ({ ...prev, frontImage: selectedUri }));
        } else if (type === 'back') {
          setVerificationData((prev) => ({ ...prev, backImage: selectedUri }));
        } else {
          setVerificationData((prev) => ({ ...prev, proofOfAddress: selectedUri }));
        }
      }
    } catch (error) {
      console.error('Image picking error:', error);
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const isFormComplete = () => {
    return verificationData.documentType !== null && verificationData.frontImage !== null && verificationData.backImage !== null && verificationData.proofOfAddress !== null;
  };

  const handleSubmit = () => {
    if (!isFormComplete()) {
      Alert.alert('Incomplete', 'Please upload all required documents before submitting.');
      return;
    }

    const actionText = isEditMode && hasExistingDocuments ? 'update' : 'submit';
    Alert.alert(`${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Documents`, `Are you sure you want to ${actionText} these documents for verification?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: actionText.charAt(0).toUpperCase() + actionText.slice(1),
        onPress: async () => {
          setIsUploading(true);
          try {
            // Check if any images are local files (new uploads) vs existing URLs
            const [frontImageUrl, backImageUrl, proofOfAddressUrl] = await Promise.all([
              verificationData.frontImage!.startsWith('http') ? verificationData.frontImage! : uploadImageToCloudinary(verificationData.frontImage!),
              verificationData.backImage!.startsWith('http') ? verificationData.backImage! : uploadImageToCloudinary(verificationData.backImage!),
              verificationData.proofOfAddress!.startsWith('http') ? verificationData.proofOfAddress! : uploadImageToCloudinary(verificationData.proofOfAddress!),
            ]);

            const payload = {
              document_type: verificationData.documentType!,
              front_image_url: frontImageUrl,
              back_image_url: backImageUrl,
              proof_of_address_url: proofOfAddressUrl,
            };

            // Call appropriate action based on edit mode
            if (isEditMode && hasExistingDocuments) {
              await updateDocuments(payload);
            } else {
              await submitDocuments(payload);
            }

            // Navigate to success screen
            router.push('/(profile)/verification-submitted');
          } catch (error: any) {
            let errorMessage = error instanceof Error ? error.message : 'Failed to submit documents';

            if (error.response?.data) {
              errorMessage = error.response.data.message || errorMessage;
            }
            Alert.alert('Error', errorMessage);
            console.error('Document submission error:', error);
          } finally {
            setIsUploading(false);
          }
        },
      },
    ]);
  };

  const getDocumentTypeLabel = () => {
    const selected = DOCUMENT_TYPES.find((t) => t.id === verificationData.documentType);
    return selected?.label || 'Select Document Type';
  };

  const isDocumentTypeSelected = verificationData.documentType !== null;

  const renderImageWithEditButton = (title: string, imageUri: string | null, onEditPress: () => void, canEditImage: boolean) => (
    <View style={styles.documentPreviewContainer}>
      <View style={styles.documentPreviewContent}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.documentImage} />
        ) : (
          <View style={styles.documentPlaceholder}>
            <FileText size={48} color={theme.colors.text.tertiary} />
            <Text variant='small' color={theme.colors.text.tertiary}>
              No image
            </Text>
          </View>
        )}
      </View>
      <View style={styles.documentInfo}>
        <Text variant='body' style={styles.documentTitle}>
          {title}
        </Text>
        {canEditImage && imageUri && (
          <TouchableOpacity style={styles.editButton} onPress={onEditPress} disabled={isUploading || isSubmitting}>
            <Edit2 size={16} color={theme.colors.white} />
            <Text variant='small' style={styles.editButtonText}>
              Edit
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderUploadSection = (title: string, imageUri: string | null, onPress: () => void, required: boolean = true, disabled: boolean = false, disabledMessage?: string) => (
    <View style={styles.uploadSection}>
      <View style={styles.sectionHeader}>
        <Text variant='body' style={styles.sectionTitle}>
          {title}
        </Text>
        {required && (
          <View style={styles.requiredBadge}>
            <Text variant='small' style={styles.requiredText}>
              REQUIRED
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={[styles.uploadArea, disabled && styles.uploadAreaDisabled]} onPress={onPress} disabled={disabled || isUploading}>
        {isUploading ? (
          <ActivityIndicator size='large' color={theme.colors.primary} />
        ) : imageUri ? (
          <View style={styles.uploadedPreview}>
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
            <View style={styles.checkmarkOverlay}>
              <CheckCircle size={24} color={theme.colors.state.success} />
            </View>
          </View>
        ) : disabled ? (
          <View style={styles.uploadPlaceholder}>
            <Lock size={32} color={theme.colors.text.tertiary} />
            <Text variant='body' style={styles.uploadTextDisabled}>
              {disabledMessage || 'Select document type first'}
            </Text>
            <Text variant='small' color={theme.colors.text.tertiary}>
              JPG, PNG or PDF (Max 5MB)
            </Text>
          </View>
        ) : (
          <View style={styles.uploadPlaceholder}>
            <Upload size={32} color={theme.colors.primary} />
            <Text variant='body' style={styles.uploadText}>
              Upload {title.toLowerCase()}
            </Text>
            <Text variant='small' color={theme.colors.text.tertiary}>
              JPG, PNG or PDF (Max 5MB)
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Identity Document Section */}
        <View style={styles.section}>
          <Text variant='h2' style={styles.sectionMainTitle}>
            Compliance
          </Text>
          <View style={styles.card}>
            <Text variant='body' style={styles.cardTitle}>
              Identity Verification
            </Text>
            <Text variant='small' color={theme.colors.text.secondary} style={styles.cardDescription}>
              As a regulated platform, we require these documents to ensure a secure environment and remove withdrawal limits.
            </Text>
          </View>
        </View>

        {/* Status Badge */}
        {status && (
          <View
            style={[
              styles.statusBadge,
              status === 'pending' && styles.statusPending,
              status === 'reviewing' && styles.statusReviewing,
              status === 'verified' && styles.statusVerified,
              status === 'rejected' && styles.statusRejected,
            ]}
          >
            <Text variant='body' style={styles.statusText}>
              Status: {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
            {rejectionReason && (
              <Text variant='small' style={styles.rejectionReasonText}>
                Reason: {rejectionReason}
              </Text>
            )}
          </View>
        )}

        {hasExistingDocuments ? (
          // Show existing documents
          <>
            <View style={styles.section}>
              <Text variant='h2' style={styles.sectionMainTitle}>
                Submitted Documents
              </Text>
              <Text variant='small' color={theme.colors.text.secondary} style={styles.documentHint}>
                {canEdit ? 'You can update your documents below' : 'Your documents are under review'}
              </Text>
            </View>

            <View style={styles.section}>
              <Text variant='body' style={styles.sectionTitle}>
                Document Type
              </Text>
              <View style={styles.documentTypeDisplay}>
                <Text variant='body' style={styles.documentTypeLabel}>
                  {getDocumentTypeLabel()}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text variant='h2' style={styles.sectionMainTitle}>
                Identity Document
              </Text>
              {renderImageWithEditButton('Front of ID', verificationData.frontImage, () => pickImage('front'), !!canEdit)}
              {renderImageWithEditButton('Back of ID', verificationData.backImage, () => pickImage('back'), !!canEdit)}
            </View>

            <View style={styles.section}>
              <Text variant='h2' style={styles.sectionMainTitle}>
                Proof of Address
              </Text>
              {renderImageWithEditButton('Document', verificationData.proofOfAddress, () => pickImage('address'), !!canEdit)}
            </View>

            {canEdit && (
              <Button
                title={isUploading || isSubmitting ? 'Updating...' : 'Update documents'}
                onPress={handleSubmit}
                style={styles.submitButton}
                disabled={!isFormComplete() || isUploading || isSubmitting}
              />
            )}
          </>
        ) : (
          // Show uploader for new documents
          <>
            <View style={styles.section}>
              <Text variant='h2' style={styles.sectionMainTitle}>
                Identity Document
              </Text>

              {/* Document Type Selection */}
              <View style={styles.documentTypeSection}>
                <View style={styles.sectionHeader}>
                  <Text variant='body' style={styles.sectionSubtitle}>
                    Document Type
                  </Text>
                  <View style={styles.requiredBadge}>
                    <Text variant='small' style={styles.requiredText}>
                      REQUIRED
                    </Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.documentTypeButton} onPress={() => setShowDocumentTypeModal(true)}>
                  <FileText size={20} color={theme.colors.primary} />
                  <Text variant='body' style={styles.documentTypeText}>
                    {getDocumentTypeLabel()}
                  </Text>
                  <View style={styles.chevronIcon} />
                </TouchableOpacity>
              </View>

              {/* Upload Front of ID */}
              {renderUploadSection('Front of ID', verificationData.frontImage, () => pickImage('front'), true, !isDocumentTypeSelected, 'Please select document type first')}

              {/* Upload Back of ID - Disabled until document type selected */}
              {renderUploadSection('Back of ID', verificationData.backImage, () => pickImage('back'), true, !isDocumentTypeSelected, 'Please select document type first')}
            </View>

            {/* Proof of Address */}
            <View style={styles.section}>
              <Text variant='h2' style={styles.sectionMainTitle}>
                Proof of Address
              </Text>

              {renderUploadSection('Document', verificationData.proofOfAddress, () => pickImage('address'))}

              <Text variant='small' color={theme.colors.text.tertiary} style={styles.addressHint}>
                Utility bill or bank statement (Max 5MB)
              </Text>
            </View>

            {/* Submit Button */}
            <Button
              title={isUploading || isSubmitting ? 'Submitting...' : 'Submit documents'}
              onPress={handleSubmit}
              style={styles.submitButton}
              disabled={!isFormComplete() || isUploading || isSubmitting}
            />
          </>
        )}
      </View>

      {/* Document Type Modal */}
      <DocumentTypeSelector
        visible={showDocumentTypeModal}
        onClose={() => setShowDocumentTypeModal(false)}
        onSelect={(type) => setVerificationData((prev) => ({ ...prev, documentType: type }))}
        selectedType={verificationData.documentType}
        options={DOCUMENT_TYPES}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  headerTitle: {
    marginBottom: 12,
  },
  headerSubtitle: {
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionMainTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: theme.colors.text.primary,
  },
  card: {
    backgroundColor: `${theme.colors.primary}10`,
    borderRadius: 12,
    padding: 16,
  },
  cardTitle: {
    fontWeight: '600',
    marginBottom: 8,
    color: theme.colors.text.primary,
  },
  cardDescription: {
    lineHeight: 20,
  },
  documentTypeSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  requiredBadge: {
    backgroundColor: theme.colors.state.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  requiredText: {
    color: theme.colors.white,
    fontWeight: '600',
    fontSize: 10,
  },
  documentTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: 8,
    padding: 16,
    backgroundColor: theme.colors.background.primary,
  },
  documentTypeText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  documentTypeTextSelected: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  chevronIcon: {
    width: 20,
    height: 20,
    backgroundColor: `${theme.colors.primary}15`,
    borderRadius: 10,
  },
  uploadSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: theme.colors.text.primary,
  },
  uploadArea: {
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: theme.colors.background.secondary,
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    alignItems: 'center',
    padding: 32,
    gap: 8,
  },
  uploadText: {
    fontWeight: '500',
    marginTop: 8,
    color: theme.colors.text.primary,
  },
  uploadTextDisabled: {
    fontWeight: '500',
    marginTop: 8,
    color: theme.colors.text.tertiary,
  },
  uploadedPreview: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  checkmarkOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 4,
  },
  addressHint: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 16,
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 40,
  },
  uploadAreaDisabled: {
    opacity: 0.5,
    backgroundColor: theme.colors.background.tertiary,
  },
  statusBadge: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  statusPending: {
    backgroundColor: `${theme.colors.state.warning}15`,
    borderLeftColor: theme.colors.state.warning,
  },
  statusReviewing: {
    backgroundColor: `${theme.colors.primary}15`,
    borderLeftColor: theme.colors.primary,
  },
  statusVerified: {
    backgroundColor: `${theme.colors.state.success}15`,
    borderLeftColor: theme.colors.state.success,
  },
  statusRejected: {
    backgroundColor: `${theme.colors.state.error}15`,
    borderLeftColor: theme.colors.state.error,
  },
  statusText: {
    fontWeight: '600',
    marginBottom: 4,
    color: theme.colors.text.primary,
  },
  rejectionReasonText: {
    color: theme.colors.text.secondary,
    marginTop: 4,
  },
  documentHint: {
    marginTop: 8,
  },
  documentTypeDisplay: {
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: 8,
    padding: 16,
    backgroundColor: theme.colors.background.secondary,
  },
  documentTypeLabel: {
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  documentPreviewContainer: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: theme.colors.background.secondary,
  },
  documentPreviewContent: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.background.tertiary,
  },
  documentImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  documentPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  documentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.medium,
  },
  documentTitle: {
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
    alignItems: 'center',
  },
  editButtonText: {
    color: theme.colors.white,
    fontWeight: '600',
  },
});
