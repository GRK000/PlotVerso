import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { BookOpen, Heart, LibraryBig, User } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/shared/theme/ThemeProvider';

function TabButton({
  children,
  onPress,
  onLongPress,
  accessibilityState,
  accessibilityLabel,
  testID,
  style
}: BottomTabBarButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={accessibilityState}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      onPress={onPress}
      onLongPress={onLongPress}
      android_ripple={null}
      style={({ pressed }) => [
        style,
        tabStyles.buttonReset,
        PlatformWebNoOutline,
        { opacity: pressed ? 0.82 : 1 }
      ]}
    >
      {children}
    </Pressable>
  );
}

const PlatformWebNoOutline = { outlineStyle: 'none' } as ViewStyle;

function TabContent({
  focused,
  color,
  label,
  children
}: {
  focused: boolean;
  color: string;
  label: string;
  children: (color: string) => React.ReactNode;
}) {
  const { colors } = useTheme();
  const contentColor = focused ? color : colors.tabInactive;
  return (
    <View
      style={[
        tabStyles.pill,
        focused
          ? {
              backgroundColor: colors.surface3,
              borderColor: color,
              shadowColor: color,
              shadowOpacity: 0.24
            }
          : { borderColor: 'transparent' }
      ]}
    >
      {focused ? <View style={[tabStyles.indicator, { backgroundColor: color, shadowColor: color }]} /> : null}
      {children(contentColor)}
      <Text style={[tabStyles.label, { color: contentColor }]}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const tabStyle = {
    headerShown: false,
    tabBarShowLabel: false,
    tabBarInactiveTintColor: colors.tabInactive,
    tabBarActiveBackgroundColor: 'transparent',
    tabBarInactiveBackgroundColor: 'transparent',
    tabBarButton: (props: BottomTabBarButtonProps) => <TabButton {...props} />,
    tabBarItemStyle: { paddingVertical: 6 },
    tabBarStyle: {
      backgroundColor: colors.surfaceGlass,
      borderColor: colors.borderStrong,
      height: 64 + Math.max(insets.bottom, 6),
      paddingTop: 7,
      paddingBottom: Math.max(insets.bottom, 6),
      position: 'absolute' as const,
      left: 12,
      right: 12,
      bottom: 8,
      borderRadius: 24,
      borderWidth: 1,
      shadowColor: colors.glowPurple,
      shadowOpacity: 0.18,
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
            <TabContent focused={focused} color={colors.secondaryBright} label="Descubrir">
              {(iconColor) => <Heart size={22} color={iconColor} />}
            </TabContent>
          )
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Biblioteca',
          tabBarActiveTintColor: colors.accentBright,
          tabBarIcon: ({ focused }) => (
            <TabContent focused={focused} color={colors.accentBright} label="Biblioteca">
              {(iconColor) => <LibraryBig size={22} color={iconColor} />}
            </TabContent>
          )
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarActiveTintColor: colors.primaryBright,
          tabBarIcon: ({ focused }) => (
            <TabContent focused={focused} color={colors.primaryBright} label="Matches">
              {(iconColor) => <BookOpen size={22} color={iconColor} />}
            </TabContent>
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarActiveTintColor: colors.accentBright,
          tabBarIcon: ({ focused }) => (
            <TabContent focused={focused} color={colors.accentBright} label="Perfil">
              {(iconColor) => <User size={22} color={iconColor} />}
            </TabContent>
          )
        }}
      />
    </Tabs>
  );
}

const tabStyles = StyleSheet.create({
  buttonReset: { borderWidth: 0, backgroundColor: 'transparent' },
  pill: {
    minWidth: 74,
    height: 46,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 }
  },
  indicator: {
    position: 'absolute',
    top: -3,
    width: 24,
    height: 3,
    borderRadius: 999,
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 }
  },
  label: { fontSize: 10, lineHeight: 12, fontWeight: '700' }
});
