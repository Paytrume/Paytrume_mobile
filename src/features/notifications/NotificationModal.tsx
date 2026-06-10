import { Text } from '@/components/typography/Text';
import { Button } from '@/components/ui/Button';
import { useNotificationsStore } from '@/store/notifications.store';
import { theme } from '@/theme';
import { Bell, X } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Animated, Dimensions, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

const { height } = Dimensions.get('window');

export default function NotificationModal({ notification, onClose }: any) {
  const { readNotification } = useNotificationsStore();
  const slideAnim = new Animated.Value(height);

  useEffect(() => {
    if (notification && !notification.read) {
      readNotification(notification._id);
    }
  }, [notification]);

  useEffect(() => {
    if (notification) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 8,
        mass: 1,
        stiffness: 100,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [notification]);

  if (!notification) return null;

  const getNotificationTypeColor = (type: string) => {
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

  const notificationColor = getNotificationTypeColor(notification.type);

  return (
    <Modal visible={!!notification} transparent animationType='none'>
      <View style={styles.overlay}>
        {/* Dismiss area - tap to close */}
        <TouchableOpacity style={styles.dismissArea} onPress={onClose} activeOpacity={1} />

        {/* Modal Content */}
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header with close button */}
          <View style={styles.header}>
            <View style={[styles.iconBadge, { backgroundColor: notificationColor }]}>
              <Bell size={24} color='#fff' />
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text variant='h2' style={styles.title}>
              {notification.title}
            </Text>

            <Text style={styles.message}>{notification.body}</Text>

            {/* Timestamp */}
            <Text style={styles.timestamp}>{new Date(notification.createdAt).toLocaleString()}</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: theme.colors.background.primary,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    maxHeight: height * 0.75,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    marginBottom: 24,
  },
  title: {
    color: theme.colors.text.primary,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: '600',
  },
  message: {
    color: theme.colors.text.secondary,
    lineHeight: 22,
    marginBottom: 16,
    fontSize: 15,
  },
  timestamp: {
    color: theme.colors.text.tertiary,
    fontSize: 12,
    fontStyle: 'italic',
  },
  button: {
    borderRadius: 12,
  },
});
