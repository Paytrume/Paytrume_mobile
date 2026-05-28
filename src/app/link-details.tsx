import ImageSkeleton from '@/components/ui/ImageSkeleton';
import { useAuthStore } from '@/store/auth.store';
import { useProductsStore } from '@/store/products.store';
import * as Clipboard from 'expo-clipboard';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, CircleCheck, Copy, Mail, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../components/typography/Text';
import { Button } from '../components/ui/Button';
import { theme } from '../theme';
import { formatDateTime, formatDateTime2 } from '@/utils/string';

// image mocks

export default function LinkDetailsScreen() {
  const { isSeller } = useAuthStore();
  const { removeProduct } = useProductsStore();
  const router = useRouter();
  const { link } = useLocalSearchParams();
  const parsedLink = link ? JSON.parse(link as string) : null;
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showResendLinkModal, setShowResendLinkModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({});

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

  const handleDeleteProduct = () => {
    Alert.alert('Delete product', `Are you sure you want to delete "${parsedLink.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            // API call to delete link
            await removeProduct(parsedLink._id);
            Alert.alert('Deleted', 'Link has been deleted');
          } catch (error) {
            Alert.alert('Error', 'Failed to delete product');
          }
        },
      },
    ]);
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
            Your payment link has been sent to `${parsedLink.buyer_email}`
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

  useEffect(() => {
    console.log(parsedLink);
  }, []);

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
          headerRight: () =>
            isSeller(parsedLink.seller_email) && (
              <View style={styles.headerActions}>
                <TouchableOpacity onPress={handleDeleteProduct} style={styles.headerButton}>
                  <Trash2 size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
            ),
        }}
      />

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title and Amount */}
        <View style={styles.headerSection}>
          <Text variant='body' style={styles.title}>
            {parsedLink.title}
          </Text>
          <Text variant='body' style={styles.amount}>
            {parseInt(parsedLink.amount).toLocaleString()}
          </Text>
        </View>

        {/* Description */}
        <Text variant='body' color={theme.colors.text.secondary} style={styles.description}>
          {parsedLink.description}
        </Text>

        {/* Date and Customer */}
        <View style={styles.infoSection}>
          <View style={styles.infoContent}>
            <Text variant='small' color={theme.colors.text.tertiary}>
              Date created
            </Text>
            <Text variant='body' style={styles.infoValue}>
              {formatDateTime2(parsedLink.createdAt).date}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoContent}>
            <Text variant='small' color={theme.colors.text.tertiary}>
              Customer email
            </Text>
            <Text variant='body' style={styles.infoValue}>
              {parsedLink.buyer_email}
            </Text>
          </View>
        </View>

        {Array.isArray(parsedLink.product_images) && parsedLink.product_images.length > 0 ? (
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
            {parsedLink.product_images.map((item: string, index: number) => (
              <View style={styles.imageContainer} key={index}>
                {/* Absolute positioned skeleton */}
                {loadingStates[index] !== false && (
                  <View style={StyleSheet.absoluteFillObject}>
                    <ImageSkeleton width='100%' height='100%' />
                  </View>
                )}
                <Image source={{ uri: item }} style={styles.sliderImage} resizeMode='contain' onLoadEnd={() => setLoadingStates((prev) => ({ ...prev, [index]: false }))} />
              </View>
            ))}
          </ScrollView>
        ) : parsedLink.product_images ? (
          <View style={styles.imageContainer}>
            {imgLoading && (
              <View style={StyleSheet.absoluteFillObject}>
                <ImageSkeleton width='100%' height={200} />
              </View>
            )}
            <Image source={{ uri: parsedLink.product_images }} style={styles.singleImage} resizeMode='contain' onLoadEnd={() => setImgLoading(false)} />
          </View>
        ) : null}

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
              {parsedLink.payment_link}
            </Text>
            <TouchableOpacity onPress={() => handleCopy(parsedLink.payment_link, 'link')} style={styles.copyButton}>
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
              {parsedLink._id}
            </Text>
            <TouchableOpacity onPress={() => handleCopy(parsedLink._id, 'code')} style={styles.copyButton}>
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
    width: '100%',
    // aspectRatio: 1, // 👈 makes it square
    borderRadius: 12,
    overflow: 'hidden',
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
    paddingTop: 20,
  },
  sliderImage: {
    width: 300,
    height: 200,
    marginRight: 12,
    borderRadius: 10,
  },

  singleImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
});
