import { Tabs } from 'expo-router';
import { BookOpen, Heart, LibraryBig, User } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/shared/theme/ThemeProvider';

function TabIcon({
  focused,
  color,
  children
}: {
  focused: boolean;
  color: string;
  children: (color: string) => React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View style={tabStyles.iconWrap}>
      {focused ? <View style={[tabStyles.indicator, { backgroundColor: color, shadowColor: color }]} /> : null}
      {children(focused ? color : colors.tabInactive)}
    </View>
  );
}

export default function TabsLayout() {
  const { colors } = useTheme();
  const tabStyle = {
    headerShown: false,
    tabBarInactiveTintColor: colors.tabInactive,
    tabBarLabelStyle: { fontSize: 12, fontWeight: '600' as const },
    tabBarItemStyle: { paddingTop: 8, paddingBottom: 7 },
    tabBarStyle: {
      backgroundColor: colors.surfaceGlass,
      borderTopColor: colors.borderStrong,
      minHeight: 62,
      position: 'absolute' as const,
      marginHorizontal: 12,
      marginBottom: 10,
      borderRadius: 24,
      borderWidth: 1,
      shadowColor: colors.glowPurple,
      shadowOpacity: 0.2,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8
    }
  };
  return (
    <Tabs screenOptions={tabStyle}>
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Descubrir',
          tabBarActiveTintColor: colors.secondaryBright,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} color={colors.secondaryBright}>{(color) => <Heart size={24} color={color} />}</TabIcon>
          )
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Biblioteca',
          tabBarActiveTintColor: colors.accentBright,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} color={colors.accentBright}>{(color) => <LibraryBig size={24} color={color} />}</TabIcon>
          )
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarActiveTintColor: colors.primaryBright,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} color={colors.primaryBright}>{(color) => <BookOpen size={24} color={color} />}</TabIcon>
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarActiveTintColor: colors.accentBright,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} color={colors.accentBright}>{(color) => <User size={24} color={color} />}</TabIcon>
          )
        }}
      />
    </Tabs>
  );
}

const tabStyles = StyleSheet.create({
  iconWrap: { minWidth: 42, height: 30, alignItems: 'center', justifyContent: 'center' },
  indicator: {
    position: 'absolute',
    top: -4,
    width: 26,
    height: 4,
    borderRadius: 999,
    shadowOpacity: 0.65,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 }
  }
});
