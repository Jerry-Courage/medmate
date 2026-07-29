import { useSignIn } from '@clerk/expo';
import { useColors } from '@/hooks/useColors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { signIn, fetchStatus } = useSignIn();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const passwordRef = useRef<TextInput>(null);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const loading = fetchStatus === 'fetching';

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    try {
      const { error: signInError } = await signIn.password({
        emailAddress: email.trim(),
        password,
      });
      if (signInError) {
        setError(signInError.message ?? 'Sign in failed. Please try again.');
        return;
      }
      if (signIn.status === 'complete') {
        await signIn.finalize({
          navigate: ({ decorateUrl }) => {
            router.replace('/(tabs)');
          },
        });
      }
    } catch (e: any) {
      setError(e?.errors?.[0]?.longMessage ?? e?.message ?? 'Sign in failed. Please try again.');
    }
  }

  return (
    <View style={styles.root}>
      {/* Green header */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>
        <View style={styles.logoCircle}>
          <Ionicons name="add" size={32} color={colors.gradientEnd} />
        </View>
        <Text style={styles.headerTitle}>Welcome Back!</Text>
      </LinearGradient>

      {/* Body */}
      <KeyboardAwareScrollViewCompat
        style={[styles.body, { backgroundColor: colors.background }]}
        contentContainerStyle={[styles.bodyContent, { paddingBottom: bottomPad + 24 }]}
        bottomOffset={60}
      >
        {/* Email */}
        <Text style={[styles.label, { color: colors.mutedForeground }]}>Email</Text>
        <View style={[styles.inputWrap, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Ionicons name="mail-outline" size={18} color={colors.mutedForeground} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}
            placeholder="Enter your email"
            placeholderTextColor={colors.mutedForeground}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
        </View>

        {/* Password */}
        <Text style={[styles.label, { color: colors.mutedForeground }]}>Password</Text>
        <View style={[styles.inputWrap, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Ionicons name="lock-closed-outline" size={18} color={colors.mutedForeground} style={styles.inputIcon} />
          <TextInput
            ref={passwordRef}
            style={[styles.input, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}
            placeholder="Password"
            placeholderTextColor={colors.mutedForeground}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />
          <Pressable onPress={() => setShowPassword(v => !v)} hitSlop={8}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={colors.mutedForeground}
            />
          </Pressable>
        </View>

        {error ? <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text> : null}

        {/* Sign In button */}
        <Pressable
          style={({ pressed }) => [styles.signInBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[styles.signInBtnText, { color: colors.primaryForeground }]}>Sign In  →</Text>
          )}
        </Pressable>

        {/* Sign up link */}
        <View style={styles.switchRow}>
          <Text style={[styles.switchText, { color: colors.mutedForeground }]}>Don't have an account? </Text>
          <Pressable onPress={() => router.replace('/(auth)/signup')}>
            <Text style={[styles.switchLink, { color: colors.primary }]}>Sign Up</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 24, paddingBottom: 36,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32, alignItems: 'center',
  },
  backBtn: { position: 'absolute', left: 20, top: 0, padding: 10, marginTop: 16 },
  logoCircle: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  headerTitle: { fontSize: 26, fontFamily: 'Inter_700Bold', color: '#fff' },
  body: { flex: 1 },
  bodyContent: { paddingHorizontal: 24, paddingTop: 28 },
  label: {
    fontSize: 13, fontFamily: 'Inter_600SemiBold', marginBottom: 6,
    marginLeft: 2, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 14,
    borderWidth: 1, paddingHorizontal: 14, height: 52, marginBottom: 18,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, height: 52 },
  errorText: { fontSize: 13, fontFamily: 'Inter_400Regular', marginBottom: 12, textAlign: 'center' },
  signInBtn: {
    height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#22C55E', shadowOpacity: 0.35, shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }, elevation: 6, marginBottom: 24,
  },
  signInBtnText: { fontSize: 17, fontFamily: 'Inter_700Bold', letterSpacing: 0.3 },
  switchRow: { flexDirection: 'row', justifyContent: 'center' },
  switchText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  switchLink: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
});
