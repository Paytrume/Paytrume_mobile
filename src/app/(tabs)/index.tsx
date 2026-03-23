// src/app/(tabs)/index.tsx
import { useRouter } from 'expo-router';
import { ArrowUpRight, Bell, CheckCircle, CircleQuestionMark, Clock4, Inbox, Plus, Share2, ShieldCheck, Wallet } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { Extrapolate, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Text } from '../../components/typography/Text';
import { Screen } from '../../components/ui/Screen';
import { theme } from '../../theme';

//images
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

interface RecentLink {
  id: string;
  title: string;
  description: string;
  amount: string;
  status: 'in_escrow' | 'awaiting_pay' | 'completed';
  date?: string;
}

const balanceCards: BalanceCard[] = [
  {
    id: '1',
    title: 'Available to Withdraw',
    amount: '$2,450.00',
    subtitle: 'Withdraw funds →',
    icon: <Wallet size={24} color={theme.colors.primary} />,
    color: theme.colors.primary,
  },
  {
    id: '2',
    title: 'Securely in Ethereum',
    amount: '$1,200',
    subtitle: 'Awaiting delivery',
    icon: <ArrowUpRight size={24} color='#10B981' />,
    color: '#10B981',
  },
  {
    id: '3',
    title: 'Total Earnings',
    amount: '$3,650',
    subtitle: 'All time',
    icon: <Wallet size={24} color='#8B5CF6' />,
    color: '#8B5CF6',
  },
];

const recentLinks: RecentLink[] = [
  {
    id: '1',
    title: 'Web Design Service...',
    description: 'Link sent to mark@exam...',
    amount: 'N85,000.00',
    status: 'in_escrow',
  },
  {
    id: '2',
    title: 'Vintage Camera...',
    description: 'Link shared via What...',
    amount: 'N350,000.50',
    status: 'awaiting_pay',
  },
  {
    id: '3',
    title: 'Logo Design Pack',
    description: 'Completed on Oct 12',
    amount: 'N15,000.00',
    status: 'completed',
  },
];

const statusFilters = ['All', 'Awaiting Pay', 'In Escrow', 'Completed'];

// Create a separate component for the balance card
const BalanceCardItem: React.FC<{ item: BalanceCard; index: number; scrollX: any }> = ({ item, index, scrollX }) => {
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
      <View style={styles.cardHeader}>
        <Text variant='body' color={theme.colors.text.secondary} style={styles.cardTitle}>
          {item.title}
        </Text>
        <View style={[styles.cardIcon, { backgroundColor: `${item.color}15` }]}>{item.icon}</View>
      </View>
      <Text variant='h1' style={styles.cardAmount}>
        {item.amount}
      </Text>
      <TouchableOpacity>
        <Text variant='body' color={theme.colors.primary} style={styles.cardSubtitle}>
          {item.subtitle}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const scrollX = useSharedValue(0);
  const [activeFilter, setActiveFilter] = useState('All');

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const renderBalanceCard = ({ item, index }: { item: BalanceCard; index: number }) => <BalanceCardItem item={item} index={index} scrollX={scrollX} />;

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
        return status;
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

  const renderRecentLink = ({ item }: { item: RecentLink }, onPress: () => void) => (
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
          {item.amount}
        </Text>
        <Text variant='small' style={[styles.linkStatus, { color: getStatusColor(item.status, 'text') }]}>
          {getStatusText(item.status)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Screen style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text variant='body' color={theme.colors.text.secondary}>
              Welcome back,
            </Text>
            <Text variant='h2' style={styles.userName}>
              Alex Palmer
            </Text>
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Bell size={24} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Balance Cards Carousel */}
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
          <TouchableOpacity>
            <Text variant='body' color={theme.colors.primary}>
              View All
            </Text>
          </TouchableOpacity>
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
          {recentLinks.length > 0 ? (
            recentLinks.map((link) => <View key={link.id}>{renderRecentLink({ item: link }, () => router.push('/share-link'))}</View>)
          ) : (
            <View style={styles.imageContainer}>
              <Image source={empty} style={styles.image} resizeMode='contain' />
              <Text variant='small' color={theme.colors.text.secondary} style={{ marginTop: 16 }}>
                Nothing here yet.
              </Text>
            </View>
          )}
        </View>

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
});
