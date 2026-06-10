// src/app/(tabs)/index.tsx
import { useCustomersStore } from '@/store/customers.store';
import { useNotificationsStore } from '@/store/notifications.store';
import { useTransactionsStore } from '@/store/transactions.store';
import { useRouter } from 'expo-router';
import { Bell, CheckCircle, CircleQuestionMark, Clock4, Inbox, Plus, Share2, ShieldCheck } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Image, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { Extrapolate, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Text } from '../../components/typography/Text';
import { Screen } from '../../components/ui/Screen';
import SkeletonCard from '../../components/ui/SkeletonCard';
import SkeletonListItem from '../../components/ui/SkeletonListItem';
import { registerForPushNotifications } from '../../services/notification';
import { useAuthStore } from '../../store/auth.store';
import { useProductsStore } from '../../store/products.store';
import { theme } from '../../theme';

//images
import { registerDevice } from '@/services/api';
import empty from '../../../assets/images/empty.png';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CARD_SPACING = 16;
const CARD_HEIGHT = 160;

interface BalanceCard {
  id: string;
  title: string;
  amount: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}

const statusFilters = ['All', 'Awaiting Pay', 'In Escrow', 'Completed'];

// Create a separate component for the balance card
const BalanceCardItem: React.FC<{ item: BalanceCard; index: number; scrollX: any; onPress: () => void }> = ({ item, index, scrollX, onPress }) => {
  const inputRange = [(index - 1) * (CARD_WIDTH + CARD_SPACING), index * (CARD_WIDTH + CARD_SPACING), (index + 1) * (CARD_WIDTH + CARD_SPACING)];

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollX.value, inputRange, [0.9, 1, 0.9], Extrapolate.CLAMP);
    const opacity = interpolate(scrollX.value, inputRange, [0.7, 1, 0.7], Extrapolate.CLAMP);
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.card, animatedStyle, { borderColor: item.color }]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <View style={styles.cardHeader}>
          <Text variant='body' color={theme.colors.text.secondary} style={styles.cardTitle}>
            {item.title}
          </Text>
          <View style={[styles.cardIcon, { backgroundColor: `${item.color}15` }]}>{item.icon}</View>
        </View>
        <Text variant='h1' style={styles.cardAmount}>
          {item.amount}
        </Text>
        <Text variant='body' color={theme.colors.primary} style={styles.cardSubtitle}>
          {item.subtitle}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const NotificationBell = () => {
  const router = useRouter();

  const unreadCount = useNotificationsStore((state) => state.unreadCount);

  return (
    <TouchableOpacity
      onPress={() => router.push('/notifications')}
      style={{
        padding: 8,
      }}
    >
      <Bell size={24} />

      {unreadCount > 0 && (
        <View
          style={{
            position: 'absolute',
            right: 5,
            top: 5,
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: theme.colors.primary,
          }}
        />
      )}
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const scrollX = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const { user } = useAuthStore();
  const { products, fetchProducts, loadMoreProducts, isLoading, hasNextPage } = useProductsStore();
  const { userBalance, isLoading: balLoad, balanceCards } = useCustomersStore();
  const { fetchTransactions } = useTransactionsStore();
  const { fetchUnreadNotifications } = useNotificationsStore();
  const [activeFilter, setActiveFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Fetch products on mount
  useEffect(() => {
    const loadData = async () => {
      await fetchProducts(0);
      await userBalance();
      await registerToken();
      await fetchUnreadNotifications();
      setInitialLoad(false);
    };
    loadData();
  }, []);

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchProducts(0);
      await userBalance();
    } finally {
      setIsRefreshing(false);
    }
  };

  async function registerToken() {
    try {
      const token = await registerForPushNotifications();
      await registerDevice({ expoPushToken: token });
    } catch (err) {
      console.log(err);
    }
  }

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleScrollEndReached = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingOffset = 200; // Load more when user is 200px from bottom

    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingOffset) {
      if (hasNextPage && !isLoading) {
        loadMoreProducts();
      }
    }
  };

  const handleBalanceCardPress = useCallback(async () => {
    try {
      await fetchTransactions();
      router.push('/(wallet)/recent-transactions');
    } catch (error) {
      console.error('Error navigating to transactions:', error);
    }
  }, [fetchTransactions]);

  const renderBalanceCard = ({ item, index }: { item: BalanceCard; index: number }) => <BalanceCardItem item={item} index={index} scrollX={scrollX} onPress={handleBalanceCardPress} />;

  const renderActionButton = (icon: React.ReactNode, title: string, onPress: () => void) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <View style={styles.actionIcon}>{icon}</View>
      <Text variant='small' style={styles.actionText}>
        {title}
      </Text>
    </TouchableOpacity>
  );

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
          ₦{parseInt(item.amount).toLocaleString()}
        </Text>
        <Text variant='small' style={[styles.linkStatus, { color: getStatusColor(item.status, 'text') }]}>
          {getStatusText(item.status)}
        </Text>
      </View>
    </TouchableOpacity>
  );
  console.log(products, 'products');
  return (
    <Screen style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEndReached}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text variant='body' color={theme.colors.text.secondary}>
              Welcome back,
            </Text>
            <Text variant='h2' style={styles.userName}>
              {user?.includes('undefined') ? 'Buddy 😁' : user}
            </Text>
          </View>
          <NotificationBell />
        </View>

        {/* Balance Cards Carousel */}
        {balLoad ? (
          <View style={styles.skeletonCarouselContainer}>
            <SkeletonCard width={CARD_WIDTH} height={CARD_HEIGHT} borderRadius={16} />
          </View>
        ) : (
          <Animated.FlatList
            data={balanceCards}
            renderItem={renderBalanceCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + CARD_SPACING}
            decelerationRate='fast'
            contentContainerStyle={styles.carouselContainer}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
          />
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {renderActionButton(<Plus size={24} color={theme.colors.primary} />, 'Create Link', () => router.push('/create-link'))}
          {renderActionButton(<Inbox size={24} color={theme.colors.primary} />, 'Receive Item', () => router.push('/receive-item'))}
          {renderActionButton(<Share2 size={24} color={theme.colors.primary} />, 'Share Links', () => router.push('/all-links'))}
          {renderActionButton(<CircleQuestionMark size={24} color={theme.colors.primary} />, 'Support', () => {})}
        </View>

        {/* Recent Links Header */}
        <View style={styles.recentLinksHeader}>
          <Text variant='h2'>Recent Links</Text>
          {products.length > 10 && (
            <TouchableOpacity>
              <Text variant='body' color={theme.colors.primary}>
                View All
              </Text>
            </TouchableOpacity>
          )}
        </View>

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
          {initialLoad && isLoading ? (
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
          )}
        </View>

        {/* Loading indicator for pagination */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text variant='small' color={theme.colors.text.secondary}>
              Loading more...
            </Text>
          </View>
        )}

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  userName: {
    marginTop: 4,
  },
  searchButton: {
    padding: 8,
  },
  carouselContainer: {
    paddingLeft: 24,
    gap: CARD_SPACING,
    paddingRight: 48,
    marginBottom: 32,
  },
  skeletonCarouselContainer: {
    paddingLeft: 24,
    gap: CARD_SPACING,
    paddingRight: 48,
    marginBottom: 32,
    justifyContent: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: theme.colors.background.primary,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardSubtitle: {
    fontWeight: '500',
  },
  cardAmount: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: `${theme.colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    color: theme.colors.text.secondary,
  },
  recentLinksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
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
  bottomPadding: {
    height: 24,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  image: {
    width: width * 0.3,
    height: width * 0.3,
  },
  loadingContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
