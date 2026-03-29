import { useRouter } from 'expo-router';
import { Building2, CheckCircle, ChevronRight, CreditCard, Edit2, Lock, LogOut, Shield, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import avatar from '../../../../assets/images/_image.png';
import { Text } from '../../../components/typography/Text';
import { theme } from '../../../theme';
import { UserProfile } from '../profile.types';

export const ProfileScreen: React.FC = () => {
  const router = useRouter();

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

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          // Clear auth state
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleVerifyKYC = () => {
    Alert.alert('KYC Verification', 'Starting verification process...');
  };

  const renderMenuItem = (icon: React.ReactNode, title: string, description: string, onPress: () => void, showChevron: boolean = true) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.menuIcon, styles.linkStatusIcon]}>{icon}</View>
      <View style={styles.menuContent}>
        <Text variant='body' style={styles.menuTitle}>
          {title}
        </Text>
        {description && (
          <Text variant='small' color={theme.colors.text.tertiary}>
            {description}
          </Text>
        )}
      </View>
      {showChevron && <ChevronRight size={20} color={theme.colors.primary} />}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text variant='h2' style={styles.profile}>
          Profile
        </Text>
        <View style={styles.avatarContainer}>
          <Image source={avatar} style={styles.avatar} />
          <TouchableOpacity style={styles.editAvatar} onPress={() => {}}>
            <Edit2 size={16} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
        <Text variant='h2' style={styles.userName}>
          {profile.fullName}
        </Text>
        <Text variant='body' color={theme.colors.raw.white}>
          {profile.email}
        </Text>
        <View style={styles.verifiedBadge}>
          <CheckCircle size={16} color={theme.colors.state.success} />
          <Text variant='small' color={theme.colors.state.success} style={styles.verifiedText}>
            VERIFIED PROVIDER
          </Text>
        </View>
      </View>

      {/* Personal Information Section */}
      <View style={styles.section}>
        <Text variant='h2' style={styles.sectionTitle}>
          Account
        </Text>

        {renderMenuItem(<User size={20} color={theme.colors.primary} />, 'Personal Information', 'Update your details and contact info', () => router.push('/(profile)/profile-edit'))}

        {renderMenuItem(<Shield size={20} color={theme.colors.primary} />, 'Verification', profile.kycStatus === 'verified' ? 'Identity verified' : 'Complete KYC to unlock features', handleVerifyKYC)}

        {renderMenuItem(<Building2 size={20} color={theme.colors.primary} />, 'Business profile', 'Manage your service offerings', () => {})}
      </View>

      {/* Finance & Security Section */}
      <View style={styles.section}>
        <Text variant='h2' style={styles.sectionTitle}>
          Finance & Security
        </Text>

        {renderMenuItem(<CreditCard size={20} color={theme.colors.primary} />, 'Payment Methods', 'Manage bank accounts for withdrawal', () => {})}

        {renderMenuItem(<Lock size={20} color={theme.colors.primary} />, 'Security Settings', 'Password, 2FA, and sessions', () => {})}
      </View>

      {/* Logout Button */}
      <View style={styles.section}>{renderMenuItem(<LogOut size={20} color={theme.colors.primary} />, 'Logout', '', handleLogout)}</View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    backgroundColor: theme.colors.primary,
    position: 'relative',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  editAvatar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.background.primary,
  },
  profile: {
    marginBottom: 60,
    color: theme.colors.raw.white,
  },
  userName: {
    marginBottom: 4,
    color: theme.colors.raw.white,
  },
  verifiedBadge: {
    flexDirection: 'row',
    gap: 6,
    borderColor: theme.colors.state.success,
    borderWidth: 0.5,
    backgroundColor: theme.colors.raw.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    position: 'absolute',
    bottom: -10,
    color: theme.colors.state.success,
    zIndex: 1000,
  },
  verifiedText: {
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
    borderColor: theme.colors.border.light,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: theme.colors.border.light,
  },
  menuIcon: {
    width: 40,
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
    gap: 4,
  },
  menuTitle: {
    fontWeight: '500',
  },
  bottomPadding: {
    height: 40,
  },
  editModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.background.primary,
    zIndex: 1000,
    paddingTop: 60,
  },
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
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
    padding: 16,
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
  linkStatusIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${theme.colors.primary}15`,
  },
});
