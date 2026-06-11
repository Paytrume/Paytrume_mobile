// src/features/links/components/CreateLinkForm.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import MaskedTextInput from 'react-native-mask-input';
import { Text } from '../../../components/typography/Text';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { PhotoUploader } from '../../../components/ui/PhotoUploader';
import { theme } from '../../../theme';
import { createLinkSchema } from '../links.schema';
import { CreateLinkFormData, RecurringCategory, RecurringRate } from '../links.types';
import { useCreateLink } from '../useCreateLink';
import { RecurringCategorySelector, RecurringRateSelector } from './RecurringRateSelector';

export const CreateLinkForm: React.FC = () => {
  const [showRecurringSelector, setShowRecurringSelector] = useState(false);
  const [showRecurringCategorySelector, setShowRecurringCategorySelector] = useState(false);
  const { createLink, isLoading, uploadProgress } = useCreateLink();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreateLinkFormData>({
    resolver: zodResolver(createLinkSchema),
    mode: 'onBlur',
    defaultValues: {
      type: 'goods',
      name: '',
      cost: '',
      description: '',
      customerEmail: '',
      customerPhone: '',
      paymentType: 'one-time',
    },
  });

  const watchType = watch('type');
  const watchPaymentType = watch('paymentType');
  const watchRecurringRate = watch('recurringRate');
  const watchRecurringCategory = watch('recurringCategory');

  const onSubmit = async (data: CreateLinkFormData) => {
    await createLink(data);
  };

  const renderTypeToggle = () => (
    <View style={styles.typeToggle}>
      <TouchableOpacity style={[styles.typeButton, watchType === 'goods' && styles.typeButtonActive]} onPress={() => setValue('type', 'goods')}>
        <Text variant='body' color={watchType === 'goods' ? theme.colors.primary : theme.colors.text.secondary} style={watchType === 'goods' && styles.typeTextActive}>
          Product
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.typeButton, watchType === 'services' && styles.typeButtonActive]} onPress={() => setValue('type', 'services')}>
        <Text variant='body' color={watchType === 'services' ? theme.colors.primary : theme.colors.text.secondary} style={watchType === 'services' && styles.typeTextActive}>
          Services
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderPaymentTypeToggle = () => (
    <View style={styles.paymentTypeContainer}>
      <Text variant='body' style={styles.paymentTypeLabel}>
        Payment Type
      </Text>
      <View style={styles.paymentTypeToggle}>
        <TouchableOpacity style={[styles.paymentTypeButton, watchPaymentType === 'one-time' && styles.paymentTypeButtonActive]} onPress={() => setValue('paymentType', 'one-time')}>
          <Text variant='body' color={watchPaymentType === 'one-time' ? theme.colors.primary : theme.colors.text.secondary}>
            One time
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.paymentTypeButton, watchPaymentType === 'recurring' && styles.paymentTypeButtonActive]} onPress={() => setValue('paymentType', 'recurring')}>
          <Text variant='body' color={watchPaymentType === 'recurring' ? theme.colors.primary : theme.colors.text.secondary}>
            Recurring
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRecurringOptions = () => (
    <View style={styles.recurringOptions}>
      <TouchableOpacity style={styles.recurringButton} onPress={() => setShowRecurringSelector(true)}>
        <Text variant='body' color={theme.colors.text.secondary}>
          {watchRecurringRate ? `${watchRecurringRate}% of amount` : 'Select a payment rate'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderRecurringOptions2 = () => (
    <View style={styles.recurringOptions}>
      <TouchableOpacity style={styles.recurringButton} onPress={() => setShowRecurringCategorySelector(true)}>
        <Text variant='body' color={theme.colors.text.secondary}>
          {watchRecurringCategory ? `${watchRecurringCategory}` : 'Select a category'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  console.log(!isValid, isLoading, uploadProgress > 0);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {renderTypeToggle()}

        <Text variant='h2' style={styles.sectionTitle}>
          Enter the details of your {watchType}.
        </Text>

        <View style={styles.form}>
          <View style={styles.photoSection}>
            <Text variant='body' style={styles.photoLabel}>
              Cover Photo
            </Text>
            <Controller control={control} name='coverPhoto' render={({ field: { onChange } }) => <PhotoUploader onImageSelected={onChange} onImageRemoved={() => onChange(undefined)} />} />
          </View>
          
          <Controller
            control={control}
            name='name'
            render={({ field: { onChange, onBlur, value }, fieldState: { error, isTouched } }) => (
              <Input
                label={`${watchType === 'goods' ? 'Product' : 'Service'} Name`}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={watchType === 'goods' ? 'e.g. Gas burner, Used iPhone 13' : 'e.g. Logo Design, Plumbing'}
                error={error?.message}
                touched={isTouched}
              />
            )}
          />

          <Controller
            control={control}
            name='cost'
            render={({ field: { onChange, onBlur, value }, fieldState: { error, isTouched } }) => (
              <Input
                label='Cost (This should be the total amount)'
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder='₦ 0.00'
                keyboardType='numeric'
                error={error?.message}
                touched={isTouched}
              />
            )}
          />

          <Controller
            control={control}
            name='description'
            render={({ field: { onChange, onBlur, value }, fieldState: { error, isTouched } }) => (
              <Input
                label='Description (Optional)'
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder='Add any specifics about condition, terms, or what is included...'
                multiline
                numberOfLines={3}
                style={styles.textArea}
                error={error?.message}
                touched={isTouched}
              />
            )}
          />

          {watchType === 'services' && (
            <>
              {renderPaymentTypeToggle()}

              {watchPaymentType === 'recurring' && renderRecurringOptions2()}
              {watchPaymentType === 'recurring' && renderRecurringOptions()}
            </>
          )}

          <Controller
            control={control}
            name='customerEmail'
            render={({ field: { onChange, onBlur, value }, fieldState: { error, isTouched } }) => (
              <Input
                label='Customer Email Address'
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder='e.g. name@example.com'
                keyboardType='email-address'
                autoCapitalize='none'
                error={error?.message}
                touched={isTouched}
              />
            )}
          />

          <Controller
            control={control}
            name='customerPhone'
            render={({ field: { onChange, onBlur, value }, fieldState: { error, isTouched } }) => (
              <View style={styles.phoneInputContainer}>
                <Text variant='body' style={styles.phoneLabel}>
                  Customer Phone Number
                </Text>
                <View style={[styles.phoneInputWrapper, error && isTouched && styles.phoneInputError]}>
                  <MaskedTextInput
                    style={styles.phoneInput}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder='e.g. 1234567890'
                    placeholderTextColor={theme.colors.text.tertiary}
                    keyboardType='phone-pad'
                  />
                </View>
                {error && isTouched && (
                  <Text variant='small' color={theme.colors.state.error} style={styles.errorText}>
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />

          <View style={styles.infoBox}>
            <Text variant='body' style={styles.infoTitle}>
              Secure Hold & Dispute Rules
            </Text>
            <Text variant='small' color={theme.colors.text.secondary} style={styles.infoText}>
              A custom link would be created immediately for this {watchType}, and would be sent to your customer&apos;s email for payment.
            </Text>
          </View>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
              </View>
              <Text variant='small' color={theme.colors.text.secondary} style={styles.progressText}>
                Uploading image... {uploadProgress}%
              </Text>
            </View>
          )}

          <Button title='Generate Secure Link' onPress={handleSubmit(onSubmit)} style={styles.submitButton} disabled={!isValid || isLoading || uploadProgress > 0} loading={isLoading} />

          <Text variant='small' color={theme.colors.text.tertiary} style={styles.footerText}>
            Funds will be held safely in escrow
          </Text>
        </View>
      </ScrollView>

      <RecurringCategorySelector
        visible={showRecurringCategorySelector}
        onClose={() => setShowRecurringCategorySelector(false)}
        onSelect={(category) => setValue('recurringCategory', category.value as RecurringCategory)}
        selectedCategory={watchRecurringCategory}
      />
      <RecurringRateSelector
        visible={showRecurringSelector}
        onClose={() => setShowRecurringSelector(false)}
        onSelect={(rate) => setValue('recurringRate', rate.value as RecurringRate)}
        selectedRate={watchRecurringRate}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    marginBottom: 24,
  },
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  typeButtonActive: {
    backgroundColor: theme.colors.background.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  typeTextActive: {
    fontWeight: '600',
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 18,
  },
  form: {
    gap: 16,
  },
  textArea: {
    // minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  paymentTypeContainer: {
    marginBottom: 8,
  },
  paymentTypeLabel: {
    marginBottom: 8,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  paymentTypeToggle: {
    flexDirection: 'row',
    gap: 12,
  },
  paymentTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: 8,
    alignItems: 'center',
  },
  paymentTypeButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}05`,
  },
  recurringOptions: {
    marginBottom: 16,
  },
  recurringButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: 8,
  },
  phoneInputContainer: {
    marginBottom: 16,
  },
  phoneLabel: {
    marginBottom: 8,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  phoneInputWrapper: {
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: 8,
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  phoneInputError: {
    borderColor: theme.colors.state.error,
  },
  phoneInput: {
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  errorText: {
    marginTop: 4,
  },
  photoSection: {
    marginTop: 8,
  },
  photoLabel: {
    marginBottom: 8,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: `${theme.colors.primary}10`,
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  infoTitle: {
    fontWeight: '600',
    marginBottom: 8,
    color: theme.colors.primary,
  },
  infoText: {
    lineHeight: 20,
  },
  progressContainer: {
    marginVertical: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.border.medium,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  progressText: {
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 24,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 16,
  },
});
