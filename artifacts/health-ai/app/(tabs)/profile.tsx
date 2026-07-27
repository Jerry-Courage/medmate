import { useAuth } from '@/context/AuthContext';
import { useColors } from '@/hooks/useColors';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SETTINGS = [
  { id: 'notifications', label: 'Notifications', icon: 'bell', sub: 'Manage alerts & reminders' },
  { id: 'privacy', label: 'Privacy & Data', icon: 'shield', sub: 'Control your health data' },
  { id: 'devices', label: 'IoT Devices', icon: 'bluetooth', sub: '3 devices connected' },
  { id: 'reports', label: 'Health Reports', icon: 'bar-chart-2', sub: 'Download PDF reports' },
  { id: 'help', label: 'Help & Support', icon: 'help-circle', sub: 'FAQs and contact us' },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  async function handleLogout() {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await logout();
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={[styles.header, { paddingTop: topPad + 8 }]}
      >
        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <View style={[styles.avatar, { backgroundColor: '#fff' }]}>
            <Text style={[styles.avatarText, { color: colors.primaryDark }]}>{initials}</Text>
          </View>
          <View style={[styles.avatarBadge, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="checkmark-circle" size={16} color={colors.primaryDark} />
          </View>
        </View>
        <Text style={styles.userName}>{user?.name ?? 'User'}</Text>
        <Text style={styles.userPhone}>{user?.phone ?? ''}</Text>

        {/* Health score card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreValue, { color: colors.foreground }]}>94</Text>
            <Text style={[styles.scoreLabel, { color: colors.mutedForeground }]}>Health Score</Text>
          </View>
          <View style={[styles.scoreDivider, { backgroundColor: colors.border }]} />
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreValue, { color: colors.foreground }]}>7</Text>
            <Text style={[styles.scoreLabel, { color: colors.mutedForeground }]}>Day Streak</Text>
          </View>
          <View style={[styles.scoreDivider, { backgroundColor: colors.border }]} />
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreValue, { color: colors.foreground }]}>3</Text>
            <Text style={[styles.scoreLabel, { color: colors.mutedForeground }]}>Devices</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPad + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* AI Summary */}
        <View style={[styles.aiCard, { backgroundColor: colors.primaryLight, borderColor: colors.accent }]}>
          <MaterialCommunityIcons name="robot" size={20} color={colors.primaryDark} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.aiCardTitle, { color: colors.primaryDark }]}>AI Health Summary</Text>
            <Text style={[styles.aiCardText, { color: colors.primaryDark }]}>
              Your overall health score is excellent. All vitals are within normal ranges. Keep up your current lifestyle!
            </Text>
          </View>
        </View>

        {/* Settings */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Settings</Text>
        <View style={[styles.settingsList, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {SETTINGS.map((s, idx) => (
            <View key={s.id}>
              <Pressable
                style={({ pressed }) => [styles.settingRow, pressed && { backgroundColor: colors.muted }]}
              >
                <View style={[styles.settingIcon, { backgroundColor: colors.primaryLight }]}>
                  <Feather name={s.icon as any} size={16} color={colors.primaryDark} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.settingLabel, { color: colors.foreground }]}>{s.label}</Text>
                  <Text style={[styles.settingSub, { color: colors.mutedForeground }]}>{s.sub}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
              </Pressable>
              {idx < SETTINGS.length - 1 && (
                <View style={[styles.divider, { backgroundColor: colors.border, marginLeft: 56 }]} />
              )}
            </View>
          ))}
        </View>

        {/* Logout */}
        <Pressable
          style={({ pressed }) => [styles.logoutBtn, { borderColor: colors.destructive, opacity: pressed ? 0.75 : 1 }]}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={18} color={colors.destructive} />
          <Text style={[styles.logoutText, { color: colors.destructive }]}>Sign Out</Text>
        </Pressable>

        <Text style={[styles.version, { color: colors.mutedForeground }]}>HealthAI v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 24, alignItems: 'center' },
  avatarWrap: { position: 'relative', marginBottom: 10 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  avatarText: { fontSize: 28, fontFamily: 'Inter_700Bold' },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: { color: '#fff', fontSize: 20, fontFamily: 'Inter_700Bold', marginBottom: 2 },
  userPhone: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: 'Inter_400Regular', marginBottom: 16 },
  scoreCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    width: '100%',
  },
  scoreItem: { flex: 1, alignItems: 'center' },
  scoreValue: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  scoreLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  scoreDivider: { width: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20 },
  aiCard: {
    flexDirection: 'row',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  aiCardTitle: { fontSize: 13, fontFamily: 'Inter_700Bold', marginBottom: 4 },
  aiCardText: { fontSize: 12, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  sectionTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', marginBottom: 12 },
  settingsList: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 20 },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  settingIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  settingSub: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 1 },
  divider: { height: 1 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 16,
  },
  logoutText: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  version: { textAlign: 'center', fontSize: 12, fontFamily: 'Inter_400Regular' },
});
