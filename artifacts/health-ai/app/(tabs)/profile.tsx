import { useAuth } from '@/context/AuthContext';
import { useColors } from '@/hooks/useColors';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SETTINGS = [
  { id: 'notifications', label: 'Notifications',  icon: 'bell',       sub: 'Manage alerts & reminders' },
  { id: 'privacy',       label: 'Privacy & Data', icon: 'shield',     sub: 'Control your health data'  },
  { id: 'devices',       label: 'IoT Devices',    icon: 'bluetooth',  sub: '3 devices connected'       },
  { id: 'reports',       label: 'Health Reports', icon: 'bar-chart-2',sub: 'Download PDF reports'      },
  { id: 'help',          label: 'Help & Support', icon: 'help-circle',sub: 'FAQs and contact us'       },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets  = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const topPad    = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  async function handleLogout() {
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    await logout();
  }

  return (
    <View style={[styles.root, { backgroundColor: '#F2F3F7' }]}>
      {/* ── Green header ── */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={[styles.header, { paddingTop: topPad + 12 }]}
      >
        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={[styles.avatarText, { color: '#22C55E' }]}>{initials}</Text>
          </View>
          {/* Verified badge */}
          <View style={styles.avatarBadge}>
            <Ionicons name="checkmark-circle" size={22} color="#22C55E" />
          </View>
        </View>

        <Text style={styles.userName}>{user?.name ?? 'User'}</Text>
        <Text style={styles.userPhone}>{user?.phone ?? user?.email ?? ''}</Text>

        {/* Stats card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>94</Text>
            <Text style={styles.statLabel}>Health Score</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>7</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Devices</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Settings list ── */}
        <View style={styles.settingsCard}>
          {SETTINGS.map((s, idx) => (
            <View key={s.id}>
              <Pressable
                style={({ pressed }) => [styles.settingRow, pressed && { backgroundColor: '#F9FAFB' }]}
              >
                <View style={styles.settingIcon}>
                  <Feather name={s.icon as any} size={17} color="#22C55E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingLabel}>{s.label}</Text>
                  <Text style={styles.settingSub}>{s.sub}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#C4C4C4" />
              </Pressable>
              {idx < SETTINGS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* ── Sign Out ── */}
        <Pressable
          style={({ pressed }) => [styles.signOutBtn, { opacity: pressed ? 0.75 : 1 }]}
          onPress={handleLogout}
        >
          <MaterialCommunityIcons name="logout" size={20} color="#EF4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>

        <Text style={styles.version}>Medmate v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // ── Header ──
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  avatarWrap:  { position: 'relative', marginBottom: 12 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  avatarText:  { fontSize: 30, fontFamily: 'Inter_700Bold' },
  avatarBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName:    { color: '#fff', fontSize: 21, fontFamily: 'Inter_700Bold', marginBottom: 3 },
  userPhone:   { color: 'rgba(255,255,255,0.82)', fontSize: 13, fontFamily: 'Inter_400Regular', marginBottom: 20 },

  // ── Stats card ──
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  statItem:    { flex: 1, alignItems: 'center' },
  statValue:   { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#111827' },
  statLabel:   { fontSize: 11, fontFamily: 'Inter_400Regular', color: '#6B7280', marginTop: 3 },
  statDivider: { width: 1, backgroundColor: '#E5E7EB' },

  // ── Scroll content ──
  scroll: { paddingHorizontal: 16, paddingTop: 20 },

  // ── Settings ──
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#111827' },
  settingSub:   { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#9CA3AF', marginTop: 2 },
  divider:      { height: 1, backgroundColor: '#F3F4F6', marginLeft: 68 },

  // ── Sign Out ──
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    borderRadius: 16,
    paddingVertical: 15,
    backgroundColor: '#fff',
    marginBottom: 18,
  },
  signOutText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#EF4444' },

  version: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#9CA3AF',
    marginBottom: 4,
  },
});
