import { CheckCircle } from 'lucide-react-native';
import React, { useState } from 'react';

import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../../../components/typography/Text';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { SelectionModal } from '../../../components/ui/SelectionModal';
import { theme } from '../../../theme';
import { City, Country, State, UserProfile } from '../profile.types';

const mockCountries: Country[] = [
  { name: 'Afghanistan', code: 'AF' },
  { name: 'Albania', code: 'AL' },
  { name: 'Algeria', code: 'DZ' },
  { name: 'Andorra', code: 'AD' },
  { name: 'Angola', code: 'AO' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'United States', code: 'US' },
  { name: 'United Kingdom', code: 'GB' },
];

const mockStates: State[] = [
  { name: 'Abia', code: 'AB', countryCode: 'NG' },
  { name: 'Adamawa', code: 'AD', countryCode: 'NG' },
  { name: 'Akwa Ibom', code: 'AK', countryCode: 'NG' },
  { name: 'Anambra', code: 'AN', countryCode: 'NG' },
  { name: 'Bauchi', code: 'BA', countryCode: 'NG' },
  { name: 'Lagos', code: 'LA', countryCode: 'NG' },
];

const mockCities: City[] = [
  { name: 'Lagos Island', code: 'LI', stateCode: 'LA' },
  { name: 'Lekki', code: 'LE', stateCode: 'LA' },
  { name: 'Ikeja', code: 'IK', stateCode: 'LA' },
  { name: 'Oshodi', code: 'OS', stateCode: 'LA' },
  { name: 'Sangotedo', code: 'SA', stateCode: 'LA' },
  { name: 'Victoria Island', code: 'VI', stateCode: 'LA' },
];

export default function ProfileEditForm() {
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    fullName: 'Alex Palmer',
    email: 'Alex.palmer@gmail.com',
    phoneNumber: '08166388263',
    avatar: require('../../../../assets/images/_image.png'),
    isVerified: true,
    kycStatus: 'verified',
    address: {
      country: 'Nigeria',
      streetAddress: '',
      state: '',
      city: '',
      postalCode: '',
    },
  });
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);

  const handleSaveChanges = () => {
    // API call to save profile
    Alert.alert('Success', 'Profile updated successfully');
  };

  return (
    <ScrollView style={styles.editForm} showsVerticalScrollIndicator={false}>
      <Text variant='body' style={styles.editSubtitle}>
        Update your details
      </Text>
      <Text variant='small' color={theme.colors.text.tertiary} style={styles.editHint}>
        Keep your personal information accurate to help us keep your account secure.
      </Text>

      <Text variant='body' style={styles.formSectionTitle}>
        BASIC DETAILS
      </Text>
      <View style={styles.section}>
        <Input label='Full Name' value={profile.fullName} onChangeText={(text) => setProfile({ ...profile, fullName: text })} placeholder='Enter your full name' />

        <Input
          label='Email Address'
          value={profile.email}
          onChangeText={(text) => setProfile({ ...profile, email: text })}
          placeholder='Enter your email'
          keyboardType='email-address'
          autoCapitalize='none'
        />
        <Text variant='small' color={theme.colors.text.tertiary} style={styles.fieldHint}>
          We&apos;ll use this email for receipts and important account alerts.
        </Text>

        <Input label='Phone Number' value={profile.phoneNumber} onChangeText={(text) => setProfile({ ...profile, phoneNumber: text })} placeholder='Enter your phone number' keyboardType='phone-pad' />
        <Text variant='small' color={theme.colors.text.tertiary} style={styles.fieldHint}>
          Used for verification codes and dispute updates.
        </Text>
      </View>

      <Text variant='body' style={styles.formSectionTitle}>
        ADDRESS & REGION
      </Text>
      <View style={styles.section}>
        <Text variant='body' style={styles.label}>
          Country or region
        </Text>
        <TouchableOpacity style={styles.selectInput} onPress={() => setShowCountryModal(true)}>
          <Text variant='body' color={profile.address?.country ? theme.colors.text.primary : theme.colors.text.tertiary}>
            {profile.address?.country || 'Select country'}
          </Text>
        </TouchableOpacity>

        <Input
          label='Street Address'
          value={profile.address?.streetAddress || ''}
          onChangeText={(text) =>
            setProfile({
              ...profile,
              address: { ...profile.address!, streetAddress: text },
            })
          }
          placeholder='Add your address'
        />

        <View style={styles.location}>
          <View style={styles.place}>
            <Text variant='body' style={styles.label}>
              State
            </Text>
            <TouchableOpacity style={styles.selectInput} onPress={() => setShowStateModal(true)}>
              <Text variant='body' color={profile.address?.state ? theme.colors.text.primary : theme.colors.text.tertiary}>
                {profile.address?.state || 'Select state'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.place}>
            <Text variant='body' style={styles.label}>
              City
            </Text>
            <TouchableOpacity style={styles.selectInput} onPress={() => setShowCityModal(true)}>
              <Text variant='body' color={profile.address?.city ? theme.colors.text.primary : theme.colors.text.tertiary}>
                {profile.address?.city || 'Select city'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Input
          label='Postal Code'
          value={profile.address?.postalCode || ''}
          onChangeText={(text) =>
            setProfile({
              ...profile,
              address: { ...profile.address!, postalCode: text },
            })
          }
          placeholder='Postal code'
          keyboardType='numeric'
        />
      </View>

      <View style={styles.kycSection}>
        <Text variant='body' style={styles.formSectionTitle}>
          COMPLIANCE
        </Text>
        <View style={styles.kycStatus}>
          <Text variant='body'>KYC status</Text>
          <View style={styles.kycBadge}>
            <CheckCircle size={14} color={theme.colors.state.success} />
            <Text variant='small' color={theme.colors.state.success}>
              Verified
            </Text>
          </View>
        </View>
        <Text variant='small' color={theme.colors.text.tertiary}>
          Passed
        </Text>
        <Text variant='small' color={theme.colors.text.tertiary} style={styles.kycHint}>
          We securely store your verified details to protect both you and your customers.
        </Text>
      </View>

      <Button title='Save changes' onPress={handleSaveChanges} style={styles.saveButton} />
      {/* Selection Modals */}
      <SelectionModal
        visible={showCountryModal}
        onClose={() => setShowCountryModal(false)}
        onSelect={(country) =>
          setProfile({
            ...profile,
            address: { ...profile.address!, country },
          })
        }
        title='Select your country of residence'
        options={mockCountries.map((c) => c.name)}
        selectedValue={profile.address?.country}
      />

      <SelectionModal
        visible={showStateModal}
        onClose={() => setShowStateModal(false)}
        onSelect={(state) =>
          setProfile({
            ...profile,
            address: { ...profile.address!, state },
          })
        }
        title='Select your state of residence'
        options={mockStates.map((s) => s.name)}
        selectedValue={profile.address?.state}
      />

      <SelectionModal
        visible={showCityModal}
        onClose={() => setShowCityModal(false)}
        onSelect={(city) =>
          setProfile({
            ...profile,
            address: { ...profile.address!, city },
          })
        }
        title='Select your city of residence'
        options={mockCities.map((c) => c.name)}
        selectedValue={profile.address?.city}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  editForm: {
    flex: 1,
    padding: 24,
  },
  editSubtitle: {
    marginBottom: 8,
  },
  editHint: {
    marginBottom: 24,
  },
  formSectionTitle: {
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 16,
  },
  selectInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: theme.colors.background.primary,
  },
  fieldHint: {
    marginTop: -12,
    marginBottom: 16,
  },
  kycSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  kycStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  kycBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  kycHint: {
    marginTop: 8,
  },
  saveButton: {
    marginTop: 32,
    marginBottom: 40,
  },
  section: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: `${theme.colors.primary}10`,
  },
  label: {
    marginBottom: 8,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  location: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  place: {
    flexDirection: 'column',
    flex: 1,
  },
});
