import { Stack, useRouter } from 'expo-router';
import { Calendar, CheckCircle, Clock4, Search, ShieldCheck } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { Dimensions, Image, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

import { Text } from '../../components/typography/Text';
import { useProductsStore } from '../../store/products.store';
import { theme } from '../../theme';
import SkeletonListItem from '../../components/ui/SkeletonListItem';

//images
import empty from '../../../assets/images/empty.png';
import { Input } from '../../components/ui/Input';
import { SegmentedControl } from '../../components/ui/SegmentedControl';

const { width } = Dimensions.get('window');

interface RecentLink {
  id: string;
  title: string;
  description: string;
  amount: string;
  status: 'in_escrow' | 'awaiting_pay' | 'completed';
  date?: string;
}

export default function HistoryScreen() {
  const router = useRouter();
  const scrollX = useSharedValue(0);

  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState('As a seller');
  const [showHistoryModel, setShowHistoryModal] = useState(false);
  
  const {
    products,
    isLoading,
    hasNextPage,
    loadMoreProducts,
    fetchProducts,
    buyerProducts,
    buyerIsLoading,
    buyerHasNextPage,
    loadMoreBuyerProducts,
    fetchBuyerProducts,
  } = useProductsStore();

  const statusFilters = ['All', 'Awaiting Pay', 'In Escrow', 'Completed'];

  const getStatusColor = (status: string, tag: string) => {
    switch (status) {
      case 'in_escrow':
        return tag === 'background' ? theme.colors.primaryWithOpacity['15'] : theme.colors.primary;
      case 'awaiting_pay':
        return tag === 'background' ? theme.colors.state.warningWithOpacity['15'] : theme.colors.state.warning;
      case 'completed':
        return tag === 'background' ? theme.colors.state.successWithOpacity['15'] : theme.colors.state.success;
      default:
        return tag === 'background' ? theme.colors.state.warningWithOpacity['15'] : theme.colors.state.warning;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_escrow':
        return 'IN ESCROW';
      case 'awaiting_pay':
        return 'AWAITING PAY';
      case 'completed':
        return 'COMPLETED';
      default:
        return status.toUpperCase();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_escrow':
        return <ShieldCheck size={20} color={theme.colors.primary} />;
      case 'awaiting_pay':
        return <Clock4 size={20} color={theme.colors.state.warning} />;
      case 'completed':
        return <CheckCircle size={20} color={theme.colors.state.success} />;
      default:
        return <Clock4 size={20} color={theme.colors.state.warning} />;
    }
  };

  const handleHistory = () => {
    setShowHistoryModal(true);
  };

  const handCloseleHistory = () => {
    setShowHistoryModal(false);
  };

  const handleScrollEndReached = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingOffset = 200; // Load more when user is 200px from bottom

    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingOffset) {
      if (mode === 'As a seller') {
        if (hasNextPage && !isLoading) {
          loadMoreProducts();
        }
      } else {
        if (buyerHasNextPage && !buyerIsLoading) {
          loadMoreBuyerProducts();
        }
      }
    }
  };

  const renderRecentLink = ({ item }: { item: any }, onPress: () => void) => (
    <TouchableOpacity style={styles.linkItem} onPress={onPress}>
      <View style={styles.linkLeft}>
        <View style={[styles.linkStatusIcon, { backgroundColor: getStatusColor(item.status, 'background') }]}>{getStatusIcon(item.status)}</View>
        <View style={styles.linkInfo}>
          <Text variant='body' style={styles.linkTitle}>
            {item.title}
          </Text>
          <Text variant='small' color={theme.colors.text.tertiary}>
            {item.description}
          </Text>
        </View>
      </View>
      <View style={styles.linkRight}>
        <Text variant='body' style={styles.linkAmount}>
          {parseInt(item.amount).toLocaleString()}
        </Text>
        <Text variant='small' style={[styles.linkStatus, { color: getStatusColor(item.status, 'text') }]}>
          {getStatusText(item.status)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderTrackDeliveryModal = () => (
    <Modal visible={showHistoryModel} transparent animationType='slide' onRequestClose={handCloseleHistory}>
      <Pressable style={styles.modalOverlay} onPress={handCloseleHistory}>
        <View style={styles.historyModal}>
          <Text variant='h2' style={styles.historyTitle}>
            Transaction history
          </Text>
          <Text variant='small' color={theme.colors.primary} style={styles.historyFilterItem}>
            Last 7 days
          </Text>
          <Text variant='small' color={theme.colors.primary} style={styles.historyFilterItem}>
            Last 1 month
          </Text>
          <Text variant='small' color={theme.colors.primary} style={styles.historyFilterItem}>
            Last 3 months
          </Text>
          <Text variant='small' color={theme.colors.primary} style={styles.historyFilterItem}>
            Last 6 months
          </Text>
          <Text variant='small' color={theme.colors.primary} style={styles.historyFilterItem}>
            Last 1 year
          </Text>
        </View>
      </Pressable>
    </Modal>
  );

  useEffect(() => {
    if (mode === 'As a seller') {
      fetchProducts(0);
    } else {
      fetchBuyerProducts(0);
    }
  }, [mode, fetchProducts, fetchBuyerProducts]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'History',
          headerTintColor: theme.colors.primary,
          headerStyle: styles.headBg,
          headerRight: () => (
            <TouchableOpacity onPress={handleHistory} style={styles.headerButton}>
              <Calendar size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.filter}>
        <SegmentedControl options={['As a seller', 'As a buyer']} value={mode} onChange={setMode} />
        <Input label='' placeholder='Search transactions, names...' style={styles.search} value={search} onChangeText={setSearch} leftIcon={Search} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} onMomentumScrollEnd={handleScrollEndReached}>
        {/* Status Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer} contentContainerStyle={styles.filtersContent}>
          {statusFilters.map((filter) => (
            <TouchableOpacity key={filter} style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]} onPress={() => setActiveFilter(filter)}>
              <Text variant='small' color={activeFilter === filter ? theme.colors.primary : theme.colors.text.secondary} style={activeFilter === filter && styles.filterTextActive}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recent Links List */}
        <View style={styles.linksList}>
          {mode === 'As a seller' ? (
            // Seller products
            isLoading && products.length === 0 ? (
              // Show skeleton loaders during initial load
              <>
                <SkeletonListItem />
                <SkeletonListItem />
                <SkeletonListItem />
              </>
            ) : products.length > 0 ? (
              // Show products when available
              products.map((link) => (
                <View key={link._id}>
                  {renderRecentLink({ item: link }, () =>
                    router.push({
                      pathname: '/share-link',
                      params: { link: JSON.stringify(link) },
                    }),
                  )}
                </View>
              ))
            ) : (
              // Show empty state only after loading is complete
              <View style={styles.imageContainer}>
                <Image source={empty} style={styles.image} resizeMode='contain' />
                <Text variant='small' color={theme.colors.text.secondary} style={{ marginTop: 16 }}>
                  Nothing here yet.
                </Text>
              </View>
            )
          ) : (
            // Buyer products
            buyerIsLoading && buyerProducts.length === 0 ? (
              // Show skeleton loaders during initial load
              <>
                <SkeletonListItem />
                <SkeletonListItem />
                <SkeletonListItem />
              </>
            ) : buyerProducts.length > 0 ? (
              // Show products when available
              buyerProducts.map((link) => (
                <View key={link._id}>
                  {renderRecentLink({ item: link }, () =>
                    router.push({
                      pathname: '/share-link',
                      params: { link: JSON.stringify(link) },
                    }),
                  )}
                </View>
              ))
            ) : (
              // Show empty state only after loading is complete
              <View style={styles.imageContainer}>
                <Image source={empty} style={styles.image} resizeMode='contain' />
                <Text variant='small' color={theme.colors.text.secondary} style={{ marginTop: 16 }}>
                  Nothing here yet.
                </Text>
              </View>
            )
          )}
        </View>

        {/* Loading indicator for pagination */}
        {(isLoading || buyerIsLoading) && (
          <View style={styles.loadingContainer}>
            <Text variant='small' color={theme.colors.text.secondary}>
              Loading more...
            </Text>
          </View>
        )}

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
      {renderTrackDeliveryModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filtersContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.background.secondary,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: `${theme.colors.primary}15`,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  filterTextActive: {
    fontWeight: '600',
  },
  linksList: {
    paddingHorizontal: 24,
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: 10,
    marginBottom: 12,
  },
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  linkStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  linkStatusIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkInfo: {
    flex: 1,
  },
  linkTitle: {
    fontWeight: '500',
    marginBottom: 4,
  },
  linkRight: {
    alignItems: 'flex-end',
  },
  linkAmount: {
    fontWeight: '600',
    marginBottom: 4,
  },
  linkStatus: {
    fontSize: 11,
    fontWeight: '600',
  },
  imageContainer: {
    marginTop: 120,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  image: {
    width: width * 0.3,
    height: width * 0.3,
  },
  bottomPadding: {
    height: 24,
  },
  headBg: { backgroundColor: `${theme.colors.primary}15` },
  filter: {
    paddingHorizontal: 20,
  },
  search: {
    backgroundColor: `${theme.colors.primary}15`,
    // marginBottom: 1,
  },
  headerButton: {
    padding: 8,
    marginRight: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    // alignItems: 'stretch',
  },
  historyModal: {
    backgroundColor: theme.colors.background.modal,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  historyTitle: {
    marginBottom: 40,
    textAlign: 'center',
  },
  historyFilterItem: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.primary,
    width: '100%',
    paddingBottom: 20,
  },
  loadingContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
