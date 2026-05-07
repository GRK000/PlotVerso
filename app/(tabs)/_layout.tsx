import { Tabs } from 'expo-router';
import { BookOpen, Heart, LibraryBig, User } from 'lucide-react-native';
import { useTheme } from '@/shared/theme/ThemeProvider';

export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, minHeight: 64 }
      }}
    >
      <Tabs.Screen name="discover" options={{ title: 'Descubrir', tabBarIcon: ({ color }) => <Heart size={22} color={color} /> }} />
      <Tabs.Screen name="library" options={{ title: 'Biblioteca', tabBarIcon: ({ color }) => <LibraryBig size={22} color={color} /> }} />
      <Tabs.Screen name="matches" options={{ title: 'Matches', tabBarIcon: ({ color }) => <BookOpen size={22} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil', tabBarIcon: ({ color }) => <User size={22} color={color} /> }} />
    </Tabs>
  );
}
