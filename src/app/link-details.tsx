// src/app/link-details.tsx
import * as Clipboard from 'expo-clipboard';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, CircleCheck, Copy, Mail, Share2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../components/typography/Text';
import { Button } from '../components/ui/Button';
import { theme } from '../theme';

// image mocks
import kettle from '../../assets/images/kettle.png';

export default function LinkDetailsScreen() {
  const router = useRouter();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showResendLinkModal, setShowResendLinkModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);

  // Mock data
  const linkData = {
    title: 'Web Design Services',
    amount: '₱15,000.00',
    description: 'This is a description of what the work for the logo design job would entail.',
    dateCreated: '25th Oct, 2025',
    customerEmail: 'examplecustomer@email.com',
    paymentLink: 'https://pay.app/escrow/ry73kd',
    productCode: '2he72fdb',
    status: 'ACTIVE',
  };

  const handleCopy = async (text: string, type: 'link' | 'code') => {
    await Clipboard.setStringAsync(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleShare = () => {
    router.push('/share-link');
  };

  const handleResendLink = () => {
    setShowResendLinkModal(true);
  };

  const handleCloseResendLink = () => {
    setShowResendLinkModal(false);
  };

  const handleTrack = () => {
    setShowTrackModal(true);
  };

  const handleCloseTrack = () => {
    setShowTrackModal(true);
  };

  const renderSuccessResendLinkModal = () => (
    <Modal visible={showResendLinkModal} transparent animationType='slide' onRequestClose={handleCloseResendLink}>
      <Pressable style={styles.modalOverlay} onPress={handleCloseResendLink}>
        <View style={styles.resendModal}>
          <View style={[styles.successIconContainer, { backgroundColor: `${theme.colors.state.success}15` }]}>
            <CircleCheck size={50} color={theme.colors.primary} />
          </View>
          <Text variant='h2' style={styles.resendTitle}>
            Product link sent!
          </Text>
          <Text variant='body' color={theme.colors.text.secondary} style={styles.resendMessage}>
            Your payment link has been sent to chukwuvidera@gmail.com{' '}
          </Text>
        </View>
      </Pressable>
    </Modal>
  );

  const renderTrackDeliveryModal = () => (
    <Modal visible={showTrackModal} transparent animationType='slide' onRequestClose={handleCloseTrack}>
      <Pressable style={styles.modalOverlay} onPress={handleCloseTrack}>
        <View style={styles.resendModal}>
          <Text variant='h2' style={styles.resendTitle}>
            Track delivery of product
          </Text>
          <View style={styles.trackList}>
            <Text variant='small' color={theme.colors.text.secondary} style={styles.resendMessage}>
              Product link created and shared
            </Text>
            <Text variant='small' style={styles.resendMessage}>
              COMPLETE
            </Text>
          </View>
          <View style={styles.trackList}>
            <Text variant='small' color={theme.colors.text.secondary} style={styles.resendMessage}>
              Picked up by courier
            </Text>
            <Text variant='small' style={styles.resendMessage}>
              COMPLETE
            </Text>
          </View>
          <View style={styles.trackList}>
            <Text variant='small' color={theme.colors.text.secondary} style={styles.resendMessage}>
              In transit to destination
            </Text>
            <Text variant='small' style={styles.resendMessage}>
              COMPLETE
            </Text>
          </View>
          <View style={styles.trackList}>
            <Text variant='small' color={theme.colors.text.secondary} style={styles.resendMessage}>
              Product Delivered
            </Text>
            <Text variant='small' style={styles.resendMessage}>
              COMPLETE
            </Text>
          </View>
        </View>
      </Pressable>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Link details',
          headerTintColor: theme.colors.primary,
          headerStyle: styles.headBg,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ChevronLeft size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
                <Share2 size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title and Amount */}
        <View style={styles.headerSection}>
          <Text variant='body' style={styles.title}>
            {linkData.title}
          </Text>
          <Text variant='body' style={styles.amount}>
            {linkData.amount}
          </Text>
        </View>

        {/* Description */}
        <Text variant='body' color={theme.colors.text.secondary} style={styles.description}>
          {linkData.description}
        </Text>

        {/* Date and Customer */}
        <View style={styles.infoSection}>
          <View style={styles.infoContent}>
            <Text variant='small' color={theme.colors.text.tertiary}>
              Date created
            </Text>
            <Text variant='body' style={styles.infoValue}>
              {linkData.dateCreated}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoContent}>
            <Text variant='small' color={theme.colors.text.tertiary}>
              Customer email
            </Text>
            <Text variant='body' style={styles.infoValue}>
              {linkData.customerEmail}
            </Text>
          </View>
        </View>

        <View style={styles.imageContainer}>
          <Image source={kettle} resizeMode='contain' />
        </View>
        {/* Payment Link Section */}
        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text variant='body' style={styles.label}>
              Secure Payment Link
            </Text>
            <View style={styles.statusBadge}>
              <Text variant='small' style={styles.statusText}>
                ACTIVE
              </Text>
            </View>
          </View>

          <View style={styles.copyRow}>
            <Text variant='body' style={styles.linkText} numberOfLines={1}>
              {linkData.paymentLink}
            </Text>
            <TouchableOpacity onPress={() => handleCopy(linkData.paymentLink, 'link')} style={styles.copyButton}>
              <Copy size={20} color={theme.colors.primary} />
              <Text variant='small' color={copiedLink ? theme.colors.state.success : theme.colors.primary}>
                {copiedLink ? 'Copied!' : 'Copy'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Product Code Section */}
        <View style={styles.section}>
          <Text variant='body' style={styles.label}>
            Product code
          </Text>
          <View style={styles.copyRow}>
            <Text variant='body' style={styles.codeText}>
              {linkData.productCode}
            </Text>
            <TouchableOpacity onPress={() => handleCopy(linkData.productCode, 'code')} style={styles.copyButton}>
              <Copy size={20} color={theme.colors.primary} />
              <Text variant='small' color={copiedCode ? theme.colors.state.success : theme.colors.primary}>
                {copiedCode ? 'Copied!' : 'Copy'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Done Button - Fixed at bottom */}
      <View style={styles.footer}>
        <Button title='Resend link' onPress={handleResendLink} textColor={theme.colors.primary} style={styles.resend} icon={Mail} />
        <Button title='Track delivery' onPress={handleTrack} style={styles.doneButton} />
      </View>

      {renderSuccessResendLinkModal()}
      {renderTrackDeliveryModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 100,
    paddingTop: 20,
  },
  headerSection: {
    marginBottom: 24,
    fontWeight: '700',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
  },
  amount: {
    color: theme.colors.primary,
  },
  description: {
    lineHeight: 24,
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.primary,
    marginVertical: 5,
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
  infoContent: {
    flex: 1,
    gap: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoValue: {
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: theme.colors.text.secondary,
  },
  statusBadge: {
    backgroundColor: `${theme.colors.state.success}15`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: theme.colors.state.success,
    fontWeight: '600',
  },
  copyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: theme.colors.border.light,
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
  },
  linkText: {
    flex: 1,
    marginRight: 12,
  },
  codeText: {
    flex: 1,
    fontFamily: 'monospace',
  },
  copyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: theme.colors.background.secondary,
    borderColor: theme.colors.border.light,
    borderWidth: 1,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 4,
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
    flexDirection: 'row',
    gap: 4,
  },
  resend: {
    flex: 1,
    marginRight: 5,
    backgroundColor: theme.colors.background.primary,
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
  doneButton: {
    flex: 1,
    marginLeft: 5,
  },
  bottomPadding: {
    height: 40,
  },
  imageContainer: {
    marginBottom: 24,
  },
  headBg: { backgroundColor: `${theme.colors.primary}15` },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    // alignItems: 'stretch',
  },
  resendModal: {
    backgroundColor: theme.colors.background.modal,
    borderRadius: 20,
    padding: 24,
    // marginHorizontal: 24,
    alignItems: 'center',
    // width: '100%',
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
  resendTitle: {
    marginBottom: 40,
    textAlign: 'center',
  },
  resendMessage: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  successIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    // marginTop: 10,
    marginBottom: 24,
    padding: 16,
  },
  trackList: {
    borderColor: theme.colors.primary,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 20
  },
});
