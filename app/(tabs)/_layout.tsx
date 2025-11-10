import { Tabs } from 'expo-router';
import { Bookmark, BookOpen, Store, Bot, Home, Sparkles, User } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = Dimensions.get('window');
  
  // Calculate proper bottom spacing for Android navigation
  const getTabBarHeight = () => {
    if (Platform.OS === 'ios') {
      return 80 + insets.bottom;
    }
    
    // For Android, ensure enough space above navigation buttons
    const baseHeight = 65;
    const bottomPadding = Math.max(insets.bottom, 12);
    return baseHeight + bottomPadding;
  };
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: 'rgba(0,0,0,0.08)',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          // Dynamic height with proper safe area handling
          height: getTabBarHeight(),
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : Math.max(insets.bottom, 12),
          paddingTop: 8,
          // Ensure proper positioning
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
          marginBottom: Platform.OS === 'android' ? 6 : 0,
        },
        tabBarItemStyle: {
          paddingVertical: Platform.OS === 'android' ? 6 : 4,
          paddingHorizontal: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ size, color }) => (
            <Sparkles size={size * 0.9} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ size, color }) => (
            <Bookmark size={size * 0.9} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: 'AI Vet',
          tabBarIcon: ({ size, color }) => (
            <Bot size={size * 1.1} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ size, color }) => (
            <BookOpen size={size * 0.9} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shops"
        options={{
          title: 'Shops',
          tabBarIcon: ({ size, color }) => (
            <Store size={size * 0.9} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          href: null, // Hide from tab bar, accessible via upper right button
          tabBarIcon: ({ size, color }) => (
            <User size={size * 0.9} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}