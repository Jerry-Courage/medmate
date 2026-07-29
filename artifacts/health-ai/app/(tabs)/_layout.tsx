import { useColors } from '@/hooks/useColors';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Redirect, Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@clerk/expo';
import { useEffect } from 'react';
import { setAuthTokenGetter } from '@workspace/api-client-react';

export default function TabLayout() {
  const colors = useColors();
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';
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
        tabBarActiveTintColor: '#16A34A',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: isIOS ? 'transparent' : '#FFFFFF',
          borderTopWidth: 0,
          elevation: 0,
          height: isWeb ? 84 : 70,
          paddingBottom: isWeb ? 20 : 10,
          paddingTop: 6,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -3 },
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFill} />
          ) : (
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: '#FFFFFF',
                  borderTopWidth: 1,
                  borderTopColor: '#F3F4F6',
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
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <MaterialCommunityIcons
                name={focused ? 'robot' : 'robot-outline'}
                size={22}
                color={focused ? '#16A34A' : '#9CA3AF'}
              />
              {focused && <Text style={styles.activeLabel}>Chat</Text>}
            </View>
          ),
        }}
      />

      {/* Dashboard */}
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <Ionicons
                name={focused ? 'stats-chart' : 'stats-chart-outline'}
                size={20}
                color={focused ? '#16A34A' : '#9CA3AF'}
              />
              {focused && <Text style={styles.activeLabel}>Health</Text>}
            </View>
          ),
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <Feather
                name="user"
                size={20}
                color={focused ? '#16A34A' : '#9CA3AF'}
              />
              {focused && <Text style={styles.activeLabel}>Profile</Text>}
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
  tabItemActive: {
    backgroundColor: '#DCFCE7',
  },
  activeLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#16A34A',
  },
});
