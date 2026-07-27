import { useAuth } from '@/context/AuthContext';
import { useColors } from '@/hooks/useColors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRef, useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const MOCK_READINGS = {
  bp: '120/80',
  hr: 72,
  spo2: 98,
  glucose: 95,
};

const AI_RESPONSES = [
  `Based on your latest readings, your blood pressure is ${MOCK_READINGS.bp} mmHg — that's within the healthy range. Your heart rate at ${MOCK_READINGS.hr} bpm is also normal. Keep up the great work!`,
  `Your SpO2 is ${MOCK_READINGS.spo2}%, which is excellent oxygen saturation. I'd recommend maintaining your current activity level and hydration.`,
  `Looking at your glucose level of ${MOCK_READINGS.glucose} mg/dL — this is in the normal fasting range. I suggest monitoring it after meals as well for a more complete picture.`,
  `Great question! For someone with your current blood pressure reading, regular aerobic exercise (30 minutes, 5 days a week) and reducing sodium intake can help maintain healthy levels long-term.`,
  `I've noticed your readings have been consistent over the past week. This stability is a positive sign. Would you like me to generate a weekly health summary report?`,
  `Based on your IoT device data, your resting heart rate trend is healthy. Consider tracking your heart rate variability (HRV) for deeper insights into your recovery and stress levels.`,
];

let responseIndex = 0;

function genId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: `Hello! I'm HealthAI, your personal health assistant. I have access to your latest IoT device readings:\n\n🩺 Blood Pressure: ${MOCK_READINGS.bp} mmHg\n💓 Heart Rate: ${MOCK_READINGS.hr} bpm\n🫁 SpO2: ${MOCK_READINGS.spo2}%\n🩸 Glucose: ${MOCK_READINGS.glucose} mg/dL\n\nAll your readings look healthy today! How can I help you?`,
    timestamp: new Date(),
  },
];

export default function ChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  async function sendMessage() {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = { id: genId(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [userMsg, ...prev]);
    setInput('');
    setIsTyping(true);

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    inputRef.current?.focus();

    // Simulate AI response delay
    setTimeout(() => {
      const aiMsg: Message = {
        id: genId(),
        role: 'assistant',
        content: AI_RESPONSES[responseIndex % AI_RESPONSES.length],
        timestamp: new Date(),
      };
      responseIndex++;
      setMessages(prev => [aiMsg, ...prev]);
      setIsTyping(false);
    }, 1400);
  }

  function renderMessage({ item }: { item: Message }) {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowAI]}>
        {!isUser && (
          <View style={[styles.aiAvatar, { backgroundColor: colors.primaryLight }]}>
            <MaterialCommunityIcons name="robot" size={16} color={colors.primaryDark} />
          </View>
        )}
        <View
          style={[
            styles.bubble,
            isUser
              ? { backgroundColor: colors.primary, borderBottomRightRadius: 4 }
              : { backgroundColor: colors.card, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: colors.border },
          ]}
        >
          <Text
            style={[
              styles.bubbleText,
              { color: isUser ? colors.primaryForeground : colors.foreground },
            ]}
          >
            {item.content}
          </Text>
          <Text style={[styles.timestamp, { color: isUser ? 'rgba(255,255,255,0.65)' : colors.mutedForeground }]}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={[styles.header, { paddingTop: topPad + 8 }]}
      >
        <View style={styles.headerInner}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../../assets/images/ai-robot.png')}
              style={styles.headerAvatar}
              contentFit="contain"
            />
            <View>
              <Text style={styles.headerName}>HealthAI</Text>
              <View style={styles.onlineDot}>
                <View style={styles.onlineDotInner} />
                <Text style={styles.onlineText}>Online</Text>
              </View>
            </View>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.readingPill}>
              <Ionicons name="heart" size={12} color="#fff" />
              <Text style={styles.readingPillText}>{MOCK_READINGS.hr} bpm</Text>
            </View>
            <View style={styles.readingPill}>
              <Text style={styles.readingPillText}>{MOCK_READINGS.bp}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Chat */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={0}>
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          inverted
          contentContainerStyle={[styles.listContent, { paddingBottom: 16 }]}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            isTyping ? (
              <View style={[styles.msgRow, styles.msgRowAI]}>
                <View style={[styles.aiAvatar, { backgroundColor: colors.primaryLight }]}>
                  <MaterialCommunityIcons name="robot" size={16} color={colors.primaryDark} />
                </View>
                <View style={[styles.bubble, { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderBottomLeftRadius: 4 }]}>
                  <View style={styles.typingDots}>
                    <View style={[styles.typingDot, { backgroundColor: colors.mutedForeground }]} />
                    <View style={[styles.typingDot, { backgroundColor: colors.mutedForeground }]} />
                    <View style={[styles.typingDot, { backgroundColor: colors.mutedForeground }]} />
                  </View>
                </View>
              </View>
            ) : null
          }
        />

        {/* Input bar */}
        <View
          style={[
            styles.inputBar,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
              paddingBottom: bottomPad + 8,
            },
          ]}
        >
          <View style={[styles.inputWrap, { backgroundColor: colors.muted, borderColor: colors.border }]}>
            <Ionicons name="medical" size={18} color={colors.primary} style={{ marginLeft: 4 }} />
            <TextInput
              ref={inputRef}
              style={[styles.textInput, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}
              placeholder="Ask about your health..."
              placeholderTextColor={colors.mutedForeground}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
              blurOnSubmit={false}
            />
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.sendBtn,
              { backgroundColor: input.trim() ? colors.primary : colors.muted, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={sendMessage}
            disabled={!input.trim() || isTyping}
          >
            <Ionicons name="send" size={18} color={input.trim() ? '#fff' : colors.mutedForeground} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 16 },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerAvatar: { width: 40, height: 40, borderRadius: 20 },
  headerName: { color: '#fff', fontSize: 16, fontFamily: 'Inter_700Bold' },
  onlineDot: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  onlineDotInner: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#A7F3D0' },
  onlineText: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontFamily: 'Inter_400Regular' },
  headerRight: { flexDirection: 'row', gap: 6 },
  readingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  readingPillText: { color: '#fff', fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  listContent: { paddingHorizontal: 14, paddingTop: 14 },
  msgRow: { flexDirection: 'row', marginBottom: 12, maxWidth: '85%' },
  msgRowUser: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  msgRowAI: { alignSelf: 'flex-start' },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    alignSelf: 'flex-end',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '100%',
  },
  bubbleText: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 20 },
  timestamp: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 4, textAlign: 'right' },
  typingDots: { flexDirection: 'row', gap: 5, paddingVertical: 4 },
  typingDot: { width: 7, height: 7, borderRadius: 4 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    gap: 8,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 46,
  },
  textInput: { flex: 1, fontSize: 14, marginLeft: 8, maxHeight: 100 },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
