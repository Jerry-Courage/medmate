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
import { useAuth } from '@clerk/expo';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const MOCK_READINGS = { bp: '120/80', hr: 72, spo2: 98, glucose: 95 };

const TAB_BAR_HEIGHT = 64;
const API_BASE = `https://${process.env.EXPO_PUBLIC_DOMAIN}`;

function genId() {
  return Date.now().toString() + Math.random().toString(36).slice(2, 9);
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning! 👋';
  if (hour < 17) return 'Good afternoon! 👋';
  return 'Good evening! 👋';
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: `Hi! I'm Medmate, your AI health assistant.\n\nYour IoT devices aren't connected yet, but I'm here to chat, answer health questions, and help you understand your wellbeing.\n\nHow can I help you today?`,
    timestamp: new Date(),
  },
];

export default function ChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const topPad = Platform.OS === 'web' ? 0 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom + TAB_BAR_HEIGHT;

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = { id: genId(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [userMsg, ...prev]);
    setInput('');
    setIsTyping(true);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    inputRef.current?.focus();

    try {
      const history = [...messages]
        .reverse()
        .concat([userMsg])
        .map(m => ({ role: m.role, content: m.content }));

      const token = await getToken();
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();
      const reply: string = (data.reply ?? data.error ?? '').trim();

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
          <View style={styles.aiAvatar}>
            <MaterialCommunityIcons name="robot" size={16} color="#FFFFFF" />
          </View>
        )}
        {isUser ? (
          <LinearGradient
            colors={['#22C55E', '#16A34A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.bubble, styles.userBubble]}
          >
            <Text style={styles.userBubbleText}>{item.content}</Text>
            <Text style={styles.userTimestamp}>
              {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </LinearGradient>
        ) : (
          <View style={[styles.bubble, styles.aiBubble, { backgroundColor: colors.chatAI }]}>
            <Text style={[styles.aiBubbleText, { color: colors.foreground }]}>{item.content}</Text>
            <Text style={[styles.aiTimestamp, { color: colors.mutedForeground }]}>
              {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* ── Gradient Header ── */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.4, y: 1 }}
        style={[styles.header, { paddingTop: topPad + 14 }]}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.headerTitle}>Medmate AI</Text>
          </View>
          <View style={styles.headerAvatar}>
            <Image
              source={require('../../assets/images/ai-robot.png')}
              style={styles.avatarImg}
              contentFit="contain"
            />
          </View>
        </View>

        {/* Vital pills */}
        <View style={styles.pillsRow}>
          <View style={styles.pill}>
            <Ionicons name="heart" size={13} color="#fff" />
            <Text style={styles.pillText}>{MOCK_READINGS.hr} bpm</Text>
          </View>
          <View style={styles.pill}>
            <Ionicons name="pulse" size={13} color="#fff" />
            <Text style={styles.pillText}>{MOCK_READINGS.bp} mmHg</Text>
          </View>
        </View>

        {/* Curved bottom edge matching screen background */}
        <View style={[styles.headerCurve, { backgroundColor: colors.background }]} />
      </LinearGradient>

      {/* ── Chat + Input ── */}
      <KeyboardAvoidingView
        style={[styles.body, { backgroundColor: colors.background }]}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          inverted
          contentContainerStyle={[styles.listContent, { paddingBottom: 10 }]}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            isTyping ? (
              <View style={[styles.msgRow, styles.msgRowAI, { marginBottom: 12 }]}>
                <View style={styles.aiAvatar}>
                  <MaterialCommunityIcons name="robot" size={16} color="#FFFFFF" />
                </View>
                <View style={[styles.bubble, styles.aiBubble, { backgroundColor: colors.chatAI }]}>
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

        {/* ── Input Bar ── */}
        <View
          style={[
            styles.inputBar,
            {
              paddingBottom: bottomPad,
              backgroundColor: colors.background,
              borderTopColor: colors.border,
            },
          ]}
        >
          {/* Attachment */}
          <Pressable style={styles.attachBtn}>
            <Ionicons name="attach" size={22} color={colors.mutedForeground} />
          </Pressable>

          {/* Text input */}
          <View
            style={[
              styles.inputWrap,
              { backgroundColor: colors.input, borderColor: colors.border },
            ]}
          >
            <TextInput
              ref={inputRef}
              style={{
                flex: 1,
                fontSize: 14.5,
                maxHeight: 110,
                fontFamily: 'Inter_400Regular',
                color: colors.inputForeground,
              }}
              placeholder="Ask Medmate..."
              placeholderTextColor={colors.mutedForeground}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
              blurOnSubmit={false}
            />
            <Ionicons name="mic-outline" size={18} color={colors.mutedForeground} style={styles.micIcon} />
          </View>

          {/* Send button */}
          <Pressable
            style={({ pressed }) => [
              styles.sendBtn,
              { opacity: pressed ? 0.85 : 1 },
              !input.trim() && styles.sendBtnDisabled,
            ]}
            onPress={sendMessage}
            disabled={!input.trim() || isTyping}
          >
            <Ionicons name="send" size={16} color="#fff" style={{ marginLeft: 2 }} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // ── Header ──
  header: {
    paddingHorizontal: 20,
    paddingBottom: 0,
    zIndex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  greeting: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginBottom: 4,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.5,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: 32, height: 32 },

  pillsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  pillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },

  // Curved edge at bottom of header matching screen bg
  headerCurve: {
    height: 28,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginHorizontal: -20,
  },

  // ── Body ──
  body: { flex: 1 },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },

  // ── Messages ──
  msgRow: { flexDirection: 'row', marginBottom: 16, maxWidth: '86%' },
  msgRowUser: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  msgRowAI: { alignSelf: 'flex-start' },

  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    alignSelf: 'flex-end',
    shadowColor: '#22C55E',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },

  bubble: { borderRadius: 20, maxWidth: '100%' },

  aiBubble: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  aiBubbleText: {
    fontSize: 14.5,
    fontFamily: 'Inter_400Regular',
    lineHeight: 21,
  },
  aiTimestamp: {
    fontSize: 10.5,
    fontFamily: 'Inter_400Regular',
    marginTop: 5,
  },

  userBubble: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomRightRadius: 6,
  },
  userBubbleText: {
    fontSize: 14.5,
    fontFamily: 'Inter_400Regular',
    color: '#FFFFFF',
    lineHeight: 21,
  },
  userTimestamp: {
    fontSize: 10.5,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.7)',
    marginTop: 5,
    textAlign: 'right',
  },

  typingDots: { flexDirection: 'row', gap: 5, paddingVertical: 4 },
  typingDot: { width: 7, height: 7, borderRadius: 4 },

  // ── Input Bar ──
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
    gap: 8,
  },
  attachBtn: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 46,
  },
  textInput: {
    flex: 1,
    fontSize: 14.5,
    maxHeight: 110,
  },
  micIcon: { marginLeft: 8 },
  sendBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22C55E',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  sendBtnDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
    elevation: 0,
  },
});
