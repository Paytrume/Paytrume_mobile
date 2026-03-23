import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Copy, Share2, Edit2, Trash2, RefreshCw, ChevronRight } from 'lucide-react-native';
import { Text } from '../../../components/typography/Text';
import { Button } from '../../../components/ui/Button';
import { theme } from '../../../theme';
import * as Clipboard from 'expo-clipboard';

type LinkStatus = 'active' | 'draft' | 'expired';

export interface LinkItem {
  id: string;
  title: string;
  amount: string;
  link: string;
  status: LinkStatus;
  createdAt: string;
  customerEmail?: string;
}

interface LinksListProps {
  initialLinks?: LinkItem[];
}

// Mock data
const mockLinks: LinkItem[] = [
  {
    id: '1',
    title: 'Web Design Services',
    amount: 'N850.00',
    link: 'secpay.app/l/wd850X2',
    status: 'active',
    createdAt: 'Oct 15, 2025',
  },
  {
    id: '2',
    title: 'Vintage Camera Lens',
    amount: 'N850.00',
    link: 'secpay.app/l/wd850X2',
    status: 'draft',
    createdAt: 'Oct 15, 2025',
  },
  {
    id: '3',
    title: 'Logo Design Pack',
    amount: 'N150.00',
    link: 'secpay.app/l/wd850X2',
    status: 'active',
    createdAt: 'Oct 15, 2025',
  },
  {
    id: '4',
    title: 'Custom Illustration',
    amount: 'N50,000.00',
    link: 'secpay.app/l/wd850X2',
    status: 'draft',
    createdAt: 'Oct 15, 2025',
  },
  {
    id: '5',
    title: 'Consulting Session',
    amount: 'N150,000.00',
    link: 'secpay.app/l/wd850X2',
    status: 'expired',
    createdAt: 'Oct 15, 2025',
  },
  {
    id: '6',
    title: 'Website design',
    amount: 'N200,000.00',
    link: 'secpay.app/l/wd850X2',
    status: 'expired',
    createdAt: 'Oct 15, 2025',
  },
];

export const LinksList: React.FC<LinksListProps> = ({ initialLinks }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'active' | 'draft' | 'expired'>('active');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [links] = useState<LinkItem[]>(initialLinks || mockLinks);

  // Filter links based on active tab
  const filteredLinks = links.filter((link) => {
    if (activeTab === 'active') return link.status === 'active';
    if (activeTab === 'draft') return link.status === 'draft';
    return link.status === 'expired';
  });

  const handleCopyLink = async (link: string, id: string) => {
    await Clipboard.setStringAsync(`https://${link}`);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleShareLink = (link: LinkItem) => {
    router.push({
      pathname: '/share-link',
      params: { id: link.id },
    });
  };

  const handleEditLink = (link: LinkItem) => {
    router.push({
      pathname: '/create-link',
      params: { id: link.id, edit: 'true' },
    });
  };

  const handleDeleteLink = (link: LinkItem) => {
    Alert.alert('Delete Link', `Are you sure you want to delete "${link.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          // API call to delete link
          Alert.alert('Deleted', 'Link has been deleted');
        },
      },
    ]);
  };

  const handleRenewLink = (link: LinkItem) => {
    Alert.alert('Renew Link', `Renew "${link.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Renew',
        onPress: () => {
          // API call to renew link
          Alert.alert('Success', 'Link has been renewed');
        },
      },
    ]);
  };

  const handleViewDetails = (link: LinkItem) => {
    router.push({
      pathname: '/link-details',
      params: { id: link.id },
    });
  };

  const getStatusColor = (status: LinkStatus) => {
    switch (status) {
      case 'active':
        return theme.colors.primary;
      case 'draft':
        return '#F59E0B';
      case 'expired':
        return theme.colors.text.tertiary;
    }
  };

  const getStatusText = (status: LinkStatus) => {
    return status.toUpperCase();
  };

  const renderLinkCard = (link: LinkItem) => {
    const isCopied = copiedLink === link.id;

    return (
      <View key={link.id} style={styles.linkCard}>
        {/* Card Header - Clickable to view details */}
        <TouchableOpacity style={styles.cardHeader} onPress={() => handleViewDetails(link)} activeOpacity={0.7}>
          <View style={styles.cardTitleRow}>
            <Text variant='body' style={styles.linkTitle}>
              {link.title}
            </Text>
            <ChevronRight size={20} color={theme.colors.text.tertiary} />
          </View>
          <Text variant='h2' style={styles.linkAmount}>
            {link.amount}
          </Text>
          <Text variant='small' color={theme.colors.text.tertiary} style={styles.linkDate}>
            Created {link.createdAt}
          </Text>
        </TouchableOpacity>

        {/* Link URL */}
        <View style={styles.linkRow}>
          <Text variant='small' style={styles.linkUrl} numberOfLines={1}>
            {link.link}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(link.status)}15` }]}>
            <Text variant='small' style={[styles.statusText, { color: getStatusColor(link.status) }]}>
              {getStatusText(link.status)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {link.status === 'active' && (
            <>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleCopyLink(link.link, link.id)}>
                <Copy size={16} color={theme.colors.text.secondary} />
                <Text variant='small' style={styles.actionText}>
                  {isCopied ? 'Copied!' : 'Copy Link'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleShareLink(link)}>
                <Share2 size={16} color={theme.colors.text.secondary} />
                <Text variant='small' style={styles.actionText}>
                  Share Link
                </Text>
              </TouchableOpacity>
            </>
          )}

          {link.status === 'draft' && (
            <>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleEditLink(link)}>
                <Edit2 size={16} color={theme.colors.text.secondary} />
                <Text variant='small' style={styles.actionText}>
                  Edit Link
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleShareLink(link)}>
                <Share2 size={16} color={theme.colors.text.secondary} />
                <Text variant='small' style={styles.actionText}>
                  Share Link
                </Text>
              </TouchableOpacity>
            </>
          )}

          {link.status === 'expired' && (
            <>
              <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => handleDeleteLink(link)}>
                <Trash2 size={16} color={theme.colors.state.error} />
                <Text variant='small' style={[styles.actionText, { color: theme.colors.state.error }]}>
                  Delete
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleRenewLink(link)}>
                <RefreshCw size={16} color={theme.colors.primary} />
                <Text variant='small' style={[styles.actionText, { color: theme.colors.primary }]}>
                  Renew Link
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tab, activeTab === 'active' && styles.tabActive]} onPress={() => setActiveTab('active')}>
          <Text variant='body' color={activeTab === 'active' ? theme.colors.primary : theme.colors.text.secondary} style={activeTab === 'active' && styles.tabTextActive}>
            Active links
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tab, activeTab === 'draft' && styles.tabActive]} onPress={() => setActiveTab('draft')}>
          <Text variant='body' color={activeTab === 'draft' ? theme.colors.primary : theme.colors.text.secondary} style={activeTab === 'draft' && styles.tabTextActive}>
            Drafts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tab, activeTab === 'expired' && styles.tabActive]} onPress={() => setActiveTab('expired')}>
          <Text variant='body' color={activeTab === 'expired' ? theme.colors.primary : theme.colors.text.secondary} style={activeTab === 'expired' && styles.tabTextActive}>
            Expired
          </Text>
        </TouchableOpacity>
      </View>

      {/* Links List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.linksList}>
          {filteredLinks.length > 0 ? (
            filteredLinks.map(renderLinkCard)
          ) : (
            <View style={styles.emptyState}>
              <Text variant='body' color={theme.colors.text.secondary}>
                No {activeTab} links found
              </Text>
              <Button title='Create a link' onPress={() => router.push('/create-link')} style={styles.emptyButton} />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: `${theme.colors.primary}10`,
  },
  tabTextActive: {
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
  },
  linksList: {
    padding: 24,
  },
  linkCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  linkTitle: {
    fontWeight: '500',
    flex: 1,
  },
  linkAmount: {
    marginBottom: 4,
  },
  linkDate: {
    marginBottom: 4,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  linkUrl: {
    flex: 1,
    marginRight: 8,
    color: theme.colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontWeight: '600',
    fontSize: 11,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: theme.colors.background.primary,
    borderRadius: 8,
    gap: 6,
  },
  actionText: {
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: `${theme.colors.state.error}10`,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 16,
  },
  emptyButton: {
    width: 'auto',
    paddingHorizontal: 24,
  },
});
