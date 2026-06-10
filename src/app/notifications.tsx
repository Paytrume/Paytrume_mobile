import { Text } from '@/components/typography/Text';
import NotificationModal from '@/features/notifications/NotificationModal';
import { useNotificationsStore } from '@/store/notifications.store';
import { theme } from '@/theme';
import { Stack, useRouter } from 'expo-router';
import { Bell, CheckCircle2, ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, unreadNotifications, fetchNotifications, fetchUnreadNotifications } = useNotificationsStore();

  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const [selected, setSelected] = useState<any>();

  useEffect(() => {
    fetchNotifications();
    fetchUnreadNotifications();
  }, [fetchNotifications, fetchUnreadNotifications]);

  const data = tab === 'all' ? notifications : unreadNotifications;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return theme.colors.state.success;
      case 'error':
        return theme.colors.state.error;
      case 'warning':
        return theme.colors.state.warning;
      default:
        return theme.colors.primary;
    }
  };

  const renderNotificationCard = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => setSelected(item)}
      activeOpacity={0.7}
      style={[
        styles.notificationCard,
        {
          backgroundColor: item.read ? theme.colors.background.primary : theme.colors.primaryWithOpacity['10'],
          borderColor: item.read ? theme.colors.border.light : getNotificationIcon(item.type),
          borderLeftWidth: 4,
        },
      ]}
    >
      {/* Icon Badge */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: getNotificationIcon(item.type),
          },
        ]}
      >
        <Bell size={18} color='#fff' />
      </View>

      {/* Content */}
      <View style={styles.cardContent}>
        <View style={styles.titleRow}>
          <Text variant='h3' style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          {!item.read && <View style={styles.unreadBadge} />}
        </View>

        <Text style={styles.cardMessage} numberOfLines={2}>
          {item.body}
        </Text>

        <Text style={styles.timestamp}>
          {new Date(item.createdAt).toLocaleDateString()} • {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>

      {/* Right indicator */}
      {item.read && <CheckCircle2 size={16} color={theme.colors.state.success} style={styles.readIndicator} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Notifications',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
          headerTintColor: theme.colors.primary,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ChevronLeft size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setTab('unread')}
            style={[
              styles.tab,
              tab === 'unread' && {
                borderBottomColor: theme.colors.primary,
                borderBottomWidth: 3,
              },
            ]}
          >
            <View style={styles.unreadTabContent}>
              <Text
                variant='body'
                style={[
                  styles.tabText,
                  {
                    color: tab === 'unread' ? theme.colors.primary : theme.colors.text.tertiary,
                    fontWeight: tab === 'unread' ? '600' : '500',
                  },
                ]}
              >
                Unread
              </Text>
              {unreadNotifications.length > 0 && (
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{unreadNotifications.length}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab('all')}
            style={[
              styles.tab,
              tab === 'all' && {
                borderBottomColor: theme.colors.primary,
                borderBottomWidth: 3,
              },
            ]}
          >
            <Text
              variant='body'
              style={[
                styles.tabText,
                {
                  color: tab === 'all' ? theme.colors.primary : theme.colors.text.tertiary,
                  fontWeight: tab === 'all' ? '600' : '500',
                },
              ]}
            >
              All ({notifications.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notification List */}
        {data.length > 0 ? (
          data.map((item) => <View key={item._id}>{renderNotificationCard({ item })}</View>)
        ) : (
          <View style={styles.emptyState}>
            <Bell size={48} color={theme.colors.border.medium} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>No {tab === 'unread' ? 'unread' : ''} notifications</Text>
            <Text style={styles.emptySubtitle}>You&apos;re all caught up! Check back later.</Text>
          </View>
        )}
      </ScrollView>
      {/* Notification Modal */}
      <NotificationModal notification={selected} onClose={() => setSelected(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  headerButton: {
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomColor: theme.colors.border.light,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.background.primary,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
  },
  unreadTabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 14,
    // marginHorizontal: 10,
    margin: 6,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginLeft: 8,
  },
  cardMessage: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  timestamp: {
    fontSize: 11,
    color: theme.colors.text.tertiary,
  },
  readIndicator: {
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.3,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 100,
    // paddingTop: 20,
  },
});
