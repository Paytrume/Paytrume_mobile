import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Link2, User, LayoutDashboard, Clock3 } from 'lucide-react-native';
import { FloatingActionButton } from '../../components/ui/FloatingActionButton';
import { theme } from '../../theme';

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.text.tertiary,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarShowLabel: true,
        }}
      >
        <Tabs.Screen
          name='index'
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name='links'
          options={{
            title: 'Links',
            tabBarIcon: ({ color, size }) => <Link2 size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name='history'
          options={{
            title: 'History',
            tabBarIcon: ({ color, size }) => <Clock3 size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name='profile'
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
      </Tabs>

      {/* FAB only shows within tabs layout */}
      <FloatingActionButton />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    paddingTop: 8,
    paddingBottom: 8,
    height: 70,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});
