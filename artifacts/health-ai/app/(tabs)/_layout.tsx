import { useColors } from '@/hooks/useColors';
import { useTheme } from '@/context/ThemeContext';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Redirect, Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@clerk/expo';
import { useEffect } from 'react';
import { setAuthTokenGetter } from '@workspace/api-client-react';

export default function TabLayout() {
  const colors = useColors();
  const { colorScheme } = useTheme();
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';
  const isDark = colorScheme === 'dark';
  const { isSignedIn, getToken } = useAuth();

  useEffect(() => {
    setAuthTokenGetter(() => getToken());
    return () => setAuthTokenGetter(null);
  }, [getToken]);

  if (!isSignedIn) return <Redirect href="/onboarding" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: isIOS ? 'transparent' : colors.background,
          borderTopWidth: 0,
          elevation: 0,
          height: isWeb ? 84 : 70,
          paddingBottom: isWeb ? 20 : 10,
          paddingTop: 6,
          shadowColor: '#000',
          shadowOpacity: isDark ? 0.3 : 0.06,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -3 },
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={90}
              tint={colors.tabBarBlurTint}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: colors.background,
                  borderTopWidth: 1,
                  borderTopColor: colors.border,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                },
              ]}
            />
          ),
      }}
    >
      {/* Chat */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.tabItem,
                focused && { backgroundColor: colors.primaryLight },
              ]}
            >
              <MaterialCommunityIcons
                name={focused ? 'robot' : 'robot-outline'}
                size={22}
                color={focused ? colors.primaryDark : colors.mutedForeground}
              />
              {focused && (
                <Text style={[styles.activeLabel, { color: colors.primaryDark }]}>
                  Chat
                </Text>
              )}
            </View>
          ),
        }}
      />

      {/* Dashboard */}
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.tabItem,
                focused && { backgroundColor: colors.primaryLight },
              ]}
            >
              <Ionicons
                name={focused ? 'stats-chart' : 'stats-chart-outline'}
                size={20}
                color={focused ? colors.primaryDark : colors.mutedForeground}
              />
              {focused && (
                <Text style={[styles.activeLabel, { color: colors.primaryDark }]}>
                  Health
                </Text>
              )}
            </View>
          ),
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.tabItem,
                focused && { backgroundColor: colors.primaryLight },
              ]}
            >
              <Feather
                name="user"
                size={20}
                color={focused ? colors.primaryDark : colors.mutedForeground}
              />
              {focused && (
                <Text style={[styles.activeLabel, { color: colors.primaryDark }]}>
                  Profile
                </Text>
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  activeLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
});
