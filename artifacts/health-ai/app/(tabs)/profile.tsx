import { useClerk, useUser } from '@clerk/expo';
import { useColors } from '@/hooks/useColors';
import { useTheme } from '@/context/ThemeContext';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SETTINGS = [
  { id: 'notifications', label: 'Notifications',  icon: 'bell',        sub: 'Manage alerts & reminders' },
  { id: 'privacy',       label: 'Privacy & Data',  icon: 'shield',      sub: 'Control your health data'  },
  { id: 'devices',       label: 'IoT Devices',     icon: 'bluetooth',   sub: '3 devices connected'       },
  { id: 'reports',       label: 'Health Reports',  icon: 'bar-chart-2', sub: 'Download PDF reports'      },
  { id: 'help',          label: 'Help & Support',  icon: 'help-circle', sub: 'FAQs and contact us'       },
];

export default function ProfileScreen() {
  const colors = useColors();
  const { isDark, toggleTheme } = useTheme();
  const insets  = useSafeAreaInsets();
  const { signOut } = useClerk();
  const { user } = useUser();

  const topPad    = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const displayName = user?.fullName ?? user?.firstName ?? 'User';
  const displayEmail = user?.primaryEmailAddress?.emailAddress ?? '';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  async function handleSignOut() {
    await signOut();
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
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
          <View style={styles.avatarBadge}>
            <Ionicons name="checkmark-circle" size={22} color="#22C55E" />
          </View>
        </View>

        <Text style={styles.userName}>{displayName}</Text>
        <Text style={styles.userEmail}>{displayEmail}</Text>

        {/* Stats card */}
        <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.foreground }]}>94</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Health Score</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.foreground }]}>7</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Day Streak</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.foreground }]}>3</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Devices</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Appearance toggle ── */}
        <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: colors.primaryLight }]}>
              <Feather
                name={isDark ? 'moon' : 'sun'}
                size={17}
                color={colors.primaryDark}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: colors.foreground }]}>Dark Mode</Text>
              <Text style={[styles.settingSub, { color: colors.mutedForeground }]}>
                {isDark ? 'Dark theme active' : 'Light theme active'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: '#22C55E' }}
              thumbColor={isDark ? '#fff' : '#fff'}
              ios_backgroundColor={colors.border}
            />
          </View>
        </View>

        {/* ── Settings list ── */}
        <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
          {SETTINGS.map((s, idx) => (
            <View key={s.id}>
              <Pressable
                style={({ pressed }) => [
                  styles.settingRow,
                  pressed && { backgroundColor: colors.muted },
                ]}
              >
                <View style={[styles.settingIcon, { backgroundColor: colors.primaryLight }]}>
                  <Feather name={s.icon as any} size={17} color={colors.primaryDark} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.settingLabel, { color: colors.foreground }]}>{s.label}</Text>
                  <Text style={[styles.settingSub, { color: colors.mutedForeground }]}>{s.sub}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
              </Pressable>
              {idx < SETTINGS.length - 1 && (
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              )}
            </View>
          ))}
        </View>

        {/* ── Sign Out ── */}
        <Pressable
          style={({ pressed }) => [
            styles.signOutBtn,
            { backgroundColor: colors.card, borderColor: colors.destructive, opacity: pressed ? 0.75 : 1 },
          ]}
          onPress={handleSignOut}
        >
          <MaterialCommunityIcons name="logout" size={20} color={colors.destructive} />
          <Text style={[styles.signOutText, { color: colors.destructive }]}>Sign Out</Text>
        </Pressable>

        <Text style={[styles.version, { color: colors.mutedForeground }]}>Medmate v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header:       { alignItems: 'center', paddingHorizontal: 20, paddingBottom: 28 },
  avatarWrap:   { position: 'relative', marginBottom: 12 },
  avatar: {
    width: 88, height: 88, borderRadius: 44, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.14, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 5,
  },
  avatarText:  { fontSize: 30, fontFamily: 'Inter_700Bold' },
  avatarBadge: {
    position: 'absolute', bottom: 2, right: 2,
    backgroundColor: '#fff', borderRadius: 12, width: 24, height: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  userName:   { color: '#fff', fontSize: 21, fontFamily: 'Inter_700Bold', marginBottom: 3 },
  userEmail:  { color: 'rgba(255,255,255,0.82)', fontSize: 13, fontFamily: 'Inter_400Regular', marginBottom: 20 },
  statsCard: {
    flexDirection: 'row', borderRadius: 18, paddingVertical: 16, width: '100%',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  statItem:    { flex: 1, alignItems: 'center' },
  statValue:   { fontSize: 22, fontFamily: 'Inter_700Bold' },
  statLabel:   { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 3 },
  statDivider: { width: 1 },
  scroll:      { paddingHorizontal: 16, paddingTop: 20, gap: 16 },
  settingsCard: {
    borderRadius: 18, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  settingRow:  { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 15 },
  settingIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  settingLabel:{ fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  settingSub:  { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  divider:     { height: 1, marginLeft: 68 },
  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    borderWidth: 1.5, borderRadius: 16, paddingVertical: 15,
  },
  signOutText: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  version:     { textAlign: 'center', fontSize: 12, fontFamily: 'Inter_400Regular', marginBottom: 4 },
});
