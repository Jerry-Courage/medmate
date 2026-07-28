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
import { useCallback, useRef, useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const MOCK_READINGS = { bp: '120/80', hr: 72, spo2: 98, glucose: 95 };

// Tab bar is 64px tall (position: absolute)
const TAB_BAR_HEIGHT = 64;

// Proxy maps /api/* → API server, so the base is the root domain
const API_BASE = `https://${process.env.EXPO_PUBLIC_DOMAIN}`;

function genId() {
  return Date.now().toString() + Math.random().toString(36).slice(2, 9);
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: `Hi! I'm Medmate, your personal AI health assistant.\n\nYour latest readings:\n  Blood Pressure: ${MOCK_READINGS.bp} mmHg\n  Heart Rate: ${MOCK_READINGS.hr} bpm\n  SpO2: ${MOCK_READINGS.spo2}%\n  Glucose: ${MOCK_READINGS.glucose} mg/dL\n\nAll your readings look healthy today. How can I help you?`,
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
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom + TAB_BAR_HEIGHT;

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = { id: genId(), role: 'user', content: text, timestamp: new Date() };

    // Append user message and clear input immediately
    setMessages(prev => [userMsg, ...prev]);
    setInput('');
    setIsTyping(true);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    inputRef.current?.focus();

    try {
      // messages is newest-first (inverted FlatList). Reverse to oldest-first, then append new userMsg.
      const history = [...messages]
        .reverse()
        .concat([userMsg])
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();
      const reply: string = (data.reply ?? data.error ?? '').trim();

      // Only add a bubble if there is actual content
      if (reply) {
        const aiMsg: Message = { id: genId(), role: 'assistant', content: reply, timestamp: new Date() };
        setMessages(prev => [aiMsg, ...prev]);
      }
    } catch {
      const errMsg: Message = {
        id: genId(),
        role: 'assistant',
        content: 'I could not connect to the server. Please check your connection and try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [errMsg, ...prev]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, messages]);

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
              ? {
                  backgroundColor: colors.primary,
                  borderBottomRightRadius: 4,
                  shadowColor: colors.primary,
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 3 },
                  elevation: 4,
                }
              : {
                  backgroundColor: '#FFFFFF',
                  borderBottomLeftRadius: 4,
                  borderWidth: 1.5,
                  borderColor: colors.border,
                  shadowColor: '#000',
                  shadowOpacity: 0.06,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 2,
                },
          ]}
        >
          <Text style={[styles.bubbleText, { color: isUser ? '#FFFFFF' : colors.foreground }]}>
            {item.content}
          </Text>
          <Text style={[styles.timestamp, { color: isUser ? 'rgba(255,255,255,0.7)' : colors.mutedForeground }]}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* ── Header ── */}
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
              <Text style={styles.headerName}>Medmate AI</Text>
              <View style={styles.onlineRow}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>Online</Text>
              </View>
            </View>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.readingPill}>
              <Ionicons name="heart" size={11} color="#fff" />
              <Text style={styles.readingPillText}>{MOCK_READINGS.hr} bpm</Text>
            </View>
            <View style={styles.readingPill}>
              <Text style={styles.readingPillText}>{MOCK_READINGS.bp}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* ── Chat ── */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={0}>
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          inverted
          contentContainerStyle={styles.listContent}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            isTyping ? (
              <View style={[styles.msgRow, styles.msgRowAI, { marginBottom: 12 }]}>
                <View style={[styles.aiAvatar, { backgroundColor: colors.primaryLight }]}>
                  <MaterialCommunityIcons name="robot" size={16} color={colors.primaryDark} />
                </View>
                <View
                  style={[
                    styles.bubble,
                    { backgroundColor: '#FFFFFF', borderBottomLeftRadius: 4, borderWidth: 1.5, borderColor: colors.border },
                  ]}
                >
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

        {/* ── Input bar ── */}
        <View
          style={[
            styles.inputBar,
            { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: bottomPad },
          ]}
        >
          <View style={[styles.inputWrap, { backgroundColor: colors.muted, borderColor: colors.border }]}>
            <Ionicons name="medical" size={17} color={colors.primary} style={{ marginLeft: 4 }} />
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
            <Ionicons name="send" size={17} color={input.trim() ? '#fff' : colors.mutedForeground} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:         { flex: 1 },
  header:       { paddingHorizontal: 16, paddingBottom: 14 },
  headerInner:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerAvatar: { width: 40, height: 40, borderRadius: 20 },
  headerName:   { color: '#fff', fontSize: 16, fontFamily: 'Inter_700Bold' },
  onlineRow:    { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot:    { width: 7, height: 7, borderRadius: 4, backgroundColor: '#A7F3D0' },
  onlineText:   { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontFamily: 'Inter_400Regular' },
  headerRight:  { flexDirection: 'row', gap: 6 },
  readingPill:  {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  readingPillText: { color: '#fff', fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  listContent:  { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 10 },
  msgRow:       { flexDirection: 'row', marginBottom: 14, maxWidth: '85%' },
  msgRowUser:   { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  msgRowAI:     { alignSelf: 'flex-start' },
  aiAvatar:     {
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 8, alignSelf: 'flex-end',
  },
  bubble:       { borderRadius: 20, paddingHorizontal: 15, paddingVertical: 11, maxWidth: '100%' },
  bubbleText:   { fontSize: 14.5, fontFamily: 'Inter_400Regular', lineHeight: 21 },
  timestamp:    { fontSize: 10.5, fontFamily: 'Inter_400Regular', marginTop: 5, textAlign: 'right' },
  typingDots:   { flexDirection: 'row', gap: 5, paddingVertical: 4 },
  typingDot:    { width: 7, height: 7, borderRadius: 4 },
  inputBar:     {
    flexDirection: 'row', alignItems: 'flex-end',
    paddingHorizontal: 12, paddingTop: 10, borderTopWidth: 1, gap: 8,
  },
  inputWrap:    {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    borderRadius: 26, borderWidth: 1.5,
    paddingHorizontal: 14, paddingVertical: 10, minHeight: 50,
  },
  textInput:    { flex: 1, fontSize: 14.5, marginLeft: 8, maxHeight: 110 },
  sendBtn:      { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
});
