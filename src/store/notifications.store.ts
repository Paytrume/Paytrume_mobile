import { create } from 'zustand';

import { getNotifications, getUnreadNotifications, markNotificationRead } from '@/services/api';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadNotifications: Notification[];
  unreadCount: number;
  loading: boolean;

  fetchNotifications: () => Promise<void>;
  fetchUnreadNotifications: () => Promise<void>;
  readNotification: (id: string) => Promise<void>;
}

export const useNotificationsStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadNotifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });

    try {
      const res = await getNotifications();

      set({
        notifications: res.data,
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

  fetchUnreadNotifications: async () => {
    try {
      const res = await getUnreadNotifications();

      set({
        unreadNotifications: res.data,
        unreadCount: res.data.length,
      });
    } catch {}
  },

  readNotification: async (id) => {
    try {
      await markNotificationRead(id);

      const notifications = get().notifications.map((item) => (item._id === id ? { ...item, read: true } : item));

      const unreadNotifications = get().unreadNotifications.filter((item) => item._id !== id);

      set({
        notifications,
        unreadNotifications,
        unreadCount: unreadNotifications.length,
      });
    } catch {}
  },
}));
