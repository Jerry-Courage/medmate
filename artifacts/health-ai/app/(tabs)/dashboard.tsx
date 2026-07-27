import { useColors } from '@/hooks/useColors';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Reading {
  id: string;
  label: string;
  value: string;
  unit: string;
  icon: string;
  iconSet: 'ionicons' | 'material' | 'feather';
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  bg: string;
  iconColor: string;
}

const READINGS: Reading[] = [
  {
    id: '1', label: 'Blood Pressure', value: '120/80', unit: 'mmHg',
    icon: 'heart', iconSet: 'ionicons', status: 'normal', trend: 'stable',
    bg: '#FEE2E2', iconColor: '#F87171',
  },
  {
    id: '2', label: 'Heart Rate', value: '72', unit: 'bpm',
    icon: 'activity', iconSet: 'feather', status: 'normal', trend: 'down',
    bg: '#FEF9C3', iconColor: '#CA8A04',
  },
  {
    id: '3', label: 'SpO2', value: '98', unit: '%',
    icon: 'water', iconSet: 'ionicons', status: 'normal', trend: 'stable',
    bg: '#DBEAFE', iconColor: '#3B82F6',
  },
  {
    id: '4', label: 'Glucose', value: '95', unit: 'mg/dL',
    icon: 'flask', iconSet: 'ionicons', status: 'normal', trend: 'up',
    bg: '#FEF3C7', iconColor: '#D97706',
  },
  {
    id: '5', label: 'Temperature', value: '36.8', unit: '°C',
    icon: 'thermometer', iconSet: 'feather', status: 'normal', trend: 'stable',
    bg: '#DCFCE7', iconColor: '#16A34A',
  },
  {
    id: '6', label: 'Weight', value: '70', unit: 'kg',
    icon: 'scale-bathroom', iconSet: 'material', status: 'normal', trend: 'stable',
    bg: '#F3E8FF', iconColor: '#9333EA',
  },
  {
    id: '7', label: 'Height', value: '175', unit: 'cm',
    icon: 'human-male-height', iconSet: 'material', status: 'normal', trend: 'stable',
    bg: '#E0F2FE', iconColor: '#0284C7',
  },
];

const HISTORY = [
  { id: 'h1', date: 'Today, 8:30 AM',       label: 'Blood Pressure',  value: '120/80 mmHg',  status: 'normal'  as const },
  { id: 'h2', date: 'Today, 7:15 AM',       label: 'Heart Rate',      value: '72 bpm',        status: 'normal'  as const },
  { id: 'h3', date: 'Yesterday, 9:00 PM',   label: 'Blood Glucose',   value: '102 mg/dL',     status: 'warning' as const },
  { id: 'h4', date: 'Yesterday, 6:00 AM',   label: 'SpO2',            value: '97%',           status: 'normal'  as const },
  { id: 'h5', date: '2 days ago, 8:00 AM',  label: 'Blood Pressure',  value: '128/84 mmHg',   status: 'warning' as const },
];

const STATUS_COLORS = {
  normal: '#22C55E',
  warning: '#F59E0B',
  critical: '#EF4444',
};

const STATUS_BG = {
  normal: '#DCFCE7',
  warning: '#FEF3C7',
  critical: '#FEE2E2',
};

function ReadingIcon({ icon, iconSet, color }: { icon: string; iconSet: string; color: string }) {
  if (iconSet === 'feather')   return <Feather name={icon as any} size={22} color={color} />;
  if (iconSet === 'material')  return <MaterialCommunityIcons name={icon as any} size={22} color={color} />;
  return <Ionicons name={icon as any} size={22} color={color} />;
}

function TrendIcon({ trend, colors }: { trend: 'up' | 'down' | 'stable'; colors: any }) {
  if (trend === 'stable') return <Feather name="minus" size={14} color={colors.mutedForeground} />;
  if (trend === 'up')     return <Feather name="trending-up" size={14} color="#F59E0B" />;
  return <Feather name="trending-down" size={14} color="#22C55E" />;
}

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  // Split readings into pairs for 2-column layout
  const rows: Reading[][] = [];
  for (let i = 0; i < READINGS.length; i += 2) {
    rows.push(READINGS.slice(i, i + 2));
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* ── Header ── */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={[styles.header, { paddingTop: topPad + 8 }]}
      >
        <Text style={styles.headerTitle}>My Health</Text>
        <Text style={styles.headerSub}>Last synced: Today, 8:30 AM</Text>

        {/* AI Insight card */}
        <Pressable style={styles.insightCard} onPress={() => router.push('/(tabs)')}>
          <View style={styles.insightIconWrap}>
            <MaterialCommunityIcons name="robot" size={20} color="#16A34A" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.insightTitle}>AI Insight</Text>
            <Text style={styles.insightText} numberOfLines={2}>
              All your vitals look normal today. Keep it up and stay hydrated!
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </Pressable>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPad + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Latest Readings ── */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Latest Readings</Text>
        <View style={styles.grid}>
          {rows.map((row, rowIdx) => (
            <View key={rowIdx} style={styles.row}>
              {row.map(r => (
                <ReadingCard key={r.id} reading={r} colors={colors} />
              ))}
              {/* Spacer when row has only 1 card */}
              {row.length === 1 && <View style={styles.cardSpacer} />}
            </View>
          ))}
        </View>

        {/* ── Recent History ── */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent History</Text>
        <View style={[styles.historyList, { backgroundColor: colors.card }]}>
          {HISTORY.map((h, idx) => (
            <View key={h.id}>
              <View style={styles.historyRow}>
                <View style={[styles.historyDot, { backgroundColor: STATUS_COLORS[h.status] }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.historyLabel, { color: colors.foreground }]}>{h.label}</Text>
                  <Text style={[styles.historyDate, { color: colors.mutedForeground }]}>{h.date}</Text>
                </View>
                <View style={[styles.historyBadge, { backgroundColor: STATUS_BG[h.status] }]}>
                  <Text style={[styles.historyValue, { color: STATUS_COLORS[h.status] }]}>{h.value}</Text>
                </View>
              </View>
              {idx < HISTORY.length - 1 && (
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              )}
            </View>
          ))}
        </View>

        {/* ── Connected Devices ── */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Connected Devices</Text>
        <View style={[styles.deviceCard, { backgroundColor: colors.card }]}>
          {[
            { name: 'Blood Pressure Monitor', model: 'BPM-3000',       icon: 'heart-pulse',    status: 'connected' },
            { name: 'Smart Glucometer',        model: 'GlucoSmart X1',  icon: 'needle',         status: 'connected' },
            { name: 'Pulse Oximeter',          model: 'OxyCheck Pro',   icon: 'water-percent',  status: 'idle'      },
          ].map((device, idx) => (
            <View key={device.name}>
              <View style={styles.deviceRow}>
                <View style={[styles.deviceIcon, { backgroundColor: '#DCFCE7' }]}>
                  <MaterialCommunityIcons name={device.icon as any} size={18} color="#16A34A" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.deviceName, { color: colors.foreground }]}>{device.name}</Text>
                  <Text style={[styles.deviceModel, { color: colors.mutedForeground }]}>{device.model}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: device.status === 'connected' ? '#DCFCE7' : '#F3F4F6' },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: device.status === 'connected' ? '#22C55E' : '#9CA3AF' },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      { color: device.status === 'connected' ? '#16A34A' : '#6B7280' },
                    ]}
                  >
                    {device.status}
                  </Text>
                </View>
              </View>
              {idx < 2 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function ReadingCard({ reading, colors }: { reading: Reading; colors: any }) {
  return (
    <View style={[styles.readingCard, { backgroundColor: colors.card }]}>
      {/* Icon */}
      <View style={[styles.readingIconWrap, { backgroundColor: reading.bg }]}>
        <ReadingIcon icon={reading.icon} iconSet={reading.iconSet} color={reading.iconColor} />
      </View>

      {/* Value + unit */}
      <Text style={[styles.readingValue, { color: colors.foreground }]}>{reading.value}</Text>
      <Text style={[styles.readingUnit, { color: colors.mutedForeground }]}>{reading.unit}</Text>
      <Text style={[styles.readingLabel, { color: colors.mutedForeground }]} numberOfLines={1}>
        {reading.label}
      </Text>

      {/* Footer */}
      <View style={styles.readingFooter}>
        <View style={[styles.normalBadge, { backgroundColor: STATUS_BG[reading.status] }]}>
          <Text style={[styles.normalText, { color: STATUS_COLORS[reading.status] }]}>
            {reading.status}
          </Text>
        </View>
        <TrendIcon trend={reading.trend} colors={colors} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // ── Header ──
  header:         { paddingHorizontal: 20, paddingBottom: 24 },
  headerTitle:    { color: '#fff', fontSize: 26, fontFamily: 'Inter_700Bold' },
  headerSub:      { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2, marginBottom: 16 },
  insightCard:    {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 16, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  insightIconWrap: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center',
  },
  insightTitle: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#111827' },
  insightText:  { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#6B7280', lineHeight: 17, marginTop: 2 },

  // ── Scroll ──
  scrollContent: { paddingHorizontal: 16, paddingTop: 22 },
  sectionTitle:  { fontSize: 18, fontFamily: 'Inter_700Bold', marginBottom: 14 },

  // ── Grid ──
  grid: { marginBottom: 28 },
  row:  { flexDirection: 'row', gap: 12, marginBottom: 12 },

  // ── Reading card ──
  readingCard: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardSpacer: { flex: 1 },
  readingIconWrap: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  readingValue: { fontSize: 24, fontFamily: 'Inter_700Bold', lineHeight: 28 },
  readingUnit:  { fontSize: 11, fontFamily: 'Inter_400Regular', color: '#9CA3AF', marginTop: 2 },
  readingLabel: { fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 1, marginBottom: 12 },
  readingFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  normalBadge:   { borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3 },
  normalText:    { fontSize: 10, fontFamily: 'Inter_600SemiBold' },

  // ── History ──
  historyList:  { borderRadius: 18, overflow: 'hidden', marginBottom: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  historyRow:   { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 13 },
  historyDot:   { width: 9, height: 9, borderRadius: 5 },
  historyLabel: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  historyDate:  { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  historyBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  historyValue: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  divider:      { height: 1, marginLeft: 36 },

  // ── Devices ──
  deviceCard:  { borderRadius: 18, overflow: 'hidden', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  deviceRow:   { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  deviceIcon:  { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  deviceName:  { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  deviceModel: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 10, paddingHorizontal: 9, paddingVertical: 4 },
  statusDot:   { width: 6, height: 6, borderRadius: 3 },
  statusText:  { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
});
