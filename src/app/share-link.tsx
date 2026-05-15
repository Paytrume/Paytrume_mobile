// src/app/share-link.tsx
import * as Clipboard from 'expo-clipboard';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, CircleCheck, Copy, Image, Lock } from 'lucide-react-native';
import React from 'react';
import { Alert, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../components/typography/Text';
import { Button } from '../components/ui/Button';
import { theme } from '../theme';

export default function ShareLinkScreen() {
  const router = useRouter();
  const { link } = useLocalSearchParams();

  const [copiedLink, setCopiedLink] = React.useState(false);
  const [copiedCode, setCopiedCode] = React.useState(false);

  const parsedLink = JSON.parse(link as string)
  // Mock data
  const linkData = {
    customerEmail: parsedLink.buyer_email,
    paymentLink: parsedLink.payment_link,
    productCode: parsedLink._id,
    projectTitle: parsedLink.title,
    amount: parsedLink.amount,
    status: 'Escrow',
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
    // Share link via native share
    Alert.alert('Share', 'Share via...');
  };

  const handleDone = () => {
    router.back(); // Go back to previous screen
  };

  const handleViewDetails = () => {
    router.push({
      pathname: '/link-details',
      params: { link },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Share link',
          headerTintColor: theme.colors.primary,
          headerStyle: styles.headBg,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ChevronLeft size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.content}>
        {/* Success Icon */}
        <View style={[styles.successIconContainer, { backgroundColor: `${theme.colors.state.success}15` }]}>
          <CircleCheck size={50} color={theme.colors.primary} />
        </View>

        {/* Success Message */}
        <Text variant='h2' style={styles.successTitle}>
          Link Ready!
        </Text>
        <Text variant='body' color={theme.colors.text.secondary} style={styles.successMessage}>
          Your payment link has been created and shared to {parsedLink.buyer_email}
        </Text>

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

        {/* Project Card - Clickable to view details */}
        <TouchableOpacity style={styles.projectCard} onPress={handleViewDetails}>
          <View style={styles.imageContainer}>
            <Image size={20} color={theme.colors.mediumGray} />
          </View>
          <View style={styles.projectInfo}>
            <Text variant='body' style={styles.projectTitle}>
              {linkData.projectTitle}
            </Text>
            <Text variant='small' color={theme.colors.text.tertiary}>
              {parseInt(linkData.amount).toLocaleString()}
            </Text>
          </View>
          <View style={styles.projectStatusContainer}>
            <Lock size={15} color={theme.colors.gray900} />
            <Text variant='small' style={styles.projectStatus}>
              {linkData.status}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Done Button */}
        <Button title='Done' onPress={handleDone} style={styles.doneButton} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    flex: 1,
    padding: 24,
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
  successTitle: {
    textAlign: 'center',
    marginBottom: 12,
  },
  successMessage: {
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
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
  projectCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  projectInfo: {
    gap: 4,
  },
  projectTitle: {
    fontWeight: '500',
  },
  projectStatus: {
    color: theme.colors.text.primary,
    fontWeight: '700',
  },
  doneButton: {
    marginTop: 'auto',
  },
  imageContainer: {
    backgroundColor: theme.colors.background.secondary,
    padding: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.background.secondary,
    padding: 10,
    borderRadius: 10,
  },
  headBg: { backgroundColor: `${theme.colors.primary}15` },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
});
