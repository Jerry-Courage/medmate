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
}

const READINGS: Reading[] = [
  { id: '1', label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: 'heart', iconSet: 'ionicons', status: 'normal', trend: 'stable', bg: '#FEE2E2' },
  { id: '2', label: 'Heart Rate', value: '72', unit: 'bpm', icon: 'pulse', iconSet: 'ionicons', status: 'normal', trend: 'down', bg: '#FEF9C3' },
  { id: '3', label: 'SpO2', value: '98', unit: '%', icon: 'water', iconSet: 'ionicons', status: 'normal', trend: 'stable', bg: '#DBEAFE' },
  { id: '4', label: 'Glucose', value: '95', unit: 'mg/dL', icon: 'flask', iconSet: 'ionicons', status: 'normal', trend: 'up', bg: '#FDE68A' },
  { id: '5', label: 'Temperature', value: '36.8', unit: '°C', icon: 'thermometer', iconSet: 'feather', status: 'normal', trend: 'stable', bg: '#DCFCE7' },
  { id: '6', label: 'Weight', value: '70', unit: 'kg', icon: 'scale-bathroom', iconSet: 'material', status: 'normal', trend: 'stable', bg: '#F3E8FF' },
];

const HISTORY = [
  { id: 'h1', date: 'Today, 8:30 AM', label: 'Blood Pressure', value: '120/80 mmHg', status: 'normal' as const },
  { id: 'h2', date: 'Today, 7:15 AM', label: 'Heart Rate', value: '72 bpm', status: 'normal' as const },
  { id: 'h3', date: 'Yesterday, 9:00 PM', label: 'Blood Glucose', value: '102 mg/dL', status: 'warning' as const },
  { id: 'h4', date: 'Yesterday, 6:00 AM', label: 'SpO2', value: '97%', status: 'normal' as const },
  { id: 'h5', date: '2 days ago, 8:00 AM', label: 'Blood Pressure', value: '128/84 mmHg', status: 'warning' as const },
];

const STATUS_COLORS = {
  normal: '#22C55E',
  warning: '#F59E0B',
  critical: '#EF4444',
};

function ReadingIcon({ icon, iconSet, color }: { icon: string; iconSet: string; color: string }) {
  if (iconSet === 'feather') return <Feather name={icon as any} size={20} color={color} />;
  if (iconSet === 'material') return <MaterialCommunityIcons name={icon as any} size={20} color={color} />;
  return <Ionicons name={icon as any} size={20} color={color} />;
}

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={[styles.header, { paddingTop: topPad + 8 }]}
      >
        <Text style={styles.headerTitle}>My Health</Text>
        <Text style={styles.headerSub}>Last synced: Today, 8:30 AM</Text>

        {/* AI Insight card */}
        <Pressable
          style={styles.insightCard}
          onPress={() => router.push('/(tabs)')}
        >
          <MaterialCommunityIcons name="robot" size={22} color={colors.primaryDark} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.insightTitle, { color: colors.foreground }]}>AI Insight</Text>
            <Text style={[styles.insightText, { color: colors.mutedForeground }]} numberOfLines={2}>
              All your vitals look normal today. Keep it up and stay hydrated!
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
        </Pressable>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPad + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Section: Latest Readings */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Latest Readings</Text>
        <View style={styles.grid}>
          {READINGS.map(r => (
            <ReadingCard key={r.id} reading={r} colors={colors} />
          ))}
        </View>

        {/* Section: History */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent History</Text>
        <View style={[styles.historyList, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {HISTORY.map((h, idx) => (
            <View key={h.id}>
              <View style={styles.historyRow}>
                <View
                  style={[styles.historyDot, { backgroundColor: STATUS_COLORS[h.status] }]}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.historyLabel, { color: colors.foreground }]}>{h.label}</Text>
                  <Text style={[styles.historyDate, { color: colors.mutedForeground }]}>{h.date}</Text>
                </View>
                <Text style={[styles.historyValue, { color: STATUS_COLORS[h.status] }]}>{h.value}</Text>
              </View>
              {idx < HISTORY.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
            </View>
          ))}
        </View>

        {/* Connected Devices */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Connected Devices</Text>
        <View style={[styles.deviceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { name: 'Blood Pressure Monitor', model: 'BPM-3000', icon: 'heart-pulse', status: 'connected' },
            { name: 'Smart Glucometer', model: 'GlucoSmart X1', icon: 'needle', status: 'connected' },
            { name: 'Pulse Oximeter', model: 'OxyCheck Pro', icon: 'water-percent', status: 'idle' },
          ].map((device, idx) => (
            <View key={device.name}>
              <View style={styles.deviceRow}>
                <View style={[styles.deviceIcon, { backgroundColor: colors.primaryLight }]}>
                  <MaterialCommunityIcons name={device.icon as any} size={18} color={colors.primaryDark} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.deviceName, { color: colors.foreground }]}>{device.name}</Text>
                  <Text style={[styles.deviceModel, { color: colors.mutedForeground }]}>{device.model}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: device.status === 'connected' ? '#DCFCE7' : colors.muted }]}>
                  <Text style={[styles.statusText, { color: device.status === 'connected' ? colors.primaryDark : colors.mutedForeground }]}>
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
  const trendIcon = reading.trend === 'up' ? 'trending-up' : reading.trend === 'down' ? 'trending-down' : 'minus';
  const trendColor = reading.trend === 'stable' ? colors.mutedForeground : reading.trend === 'up' ? '#F59E0B' : '#22C55E';

  return (
    <View style={[styles.readingCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.readingIconWrap, { backgroundColor: reading.bg }]}>
        <ReadingIcon icon={reading.icon} iconSet={reading.iconSet} color={STATUS_COLORS[reading.status]} />
      </View>
      <Text style={[styles.readingValue, { color: colors.foreground }]}>{reading.value}</Text>
      <Text style={[styles.readingUnit, { color: colors.mutedForeground }]}>{reading.unit}</Text>
      <Text style={[styles.readingLabel, { color: colors.mutedForeground }]} numberOfLines={1}>{reading.label}</Text>
      <View style={styles.readingFooter}>
        <View style={[styles.normalBadge, { backgroundColor: reading.status === 'normal' ? '#DCFCE7' : '#FEF3C7' }]}>
          <Text style={[styles.normalText, { color: STATUS_COLORS[reading.status] }]}>{reading.status}</Text>
        </View>
        <Feather name={trendIcon} size={12} color={trendColor} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 20 },
  headerTitle: { color: '#fff', fontSize: 24, fontFamily: 'Inter_700Bold' },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2, marginBottom: 14 },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
  },
  insightTitle: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  insightText: { fontSize: 12, fontFamily: 'Inter_400Regular', lineHeight: 16, marginTop: 2 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20 },
  sectionTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  readingCard: {
    width: '47%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  readingIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  readingValue: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  readingUnit: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 1, marginBottom: 2 },
  readingLabel: { fontSize: 12, fontFamily: 'Inter_500Medium', marginBottom: 8 },
  readingFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  normalBadge: { borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  normalText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  historyList: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 28 },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12 },
  historyDot: { width: 10, height: 10, borderRadius: 5 },
  historyLabel: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  historyDate: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  historyValue: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  divider: { height: 1, marginLeft: 34 },
  deviceCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 16 },
  deviceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  deviceIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  deviceName: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  deviceModel: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
});
