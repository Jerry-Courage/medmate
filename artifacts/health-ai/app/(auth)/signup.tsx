import { useSignUp } from '@clerk/expo';
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

export default function SignupScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { signUp, fetchStatus } = useSignUp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  // Email verification step
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  const emailRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const loading = fetchStatus === 'fetching';

  async function handleSignup() {
    if (!name.trim() || !email.trim() || !password.trim() || !confirm.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setError('');

    try {
      const { error: signUpError } = await signUp.password({
        emailAddress: email.trim(),
        password,
        firstName: name.trim(),
      });
      if (signUpError) {
        setError(signUpError.message ?? 'Sign up failed. Please try again.');
        return;
      }
      // Send email verification code
      await signUp.verifications.sendEmailCode();
      setPendingVerification(true);
    } catch (e: any) {
      setError(e?.errors?.[0]?.longMessage ?? e?.message ?? 'Sign up failed. Please try again.');
    }
  }

  async function handleVerify() {
    if (!code.trim()) { setError('Please enter the verification code.'); return; }
    setError('');
    try {
      await signUp.verifications.verifyEmailCode({ code });
      if (signUp.status === 'complete') {
        await signUp.finalize({
          navigate: () => { router.replace('/(tabs)'); },
        });
      } else {
        setError('Verification incomplete. Please try again.');
      }
    } catch (e: any) {
      setError(e?.errors?.[0]?.longMessage ?? e?.message ?? 'Invalid code. Please try again.');
    }
  }

  // ── Verification screen ──────────────────────────────────────────────────
  if (pendingVerification) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          style={[styles.topBar, { paddingTop: topPad }]}
        >
          <Pressable style={styles.backBtn} onPress={() => setPendingVerification(false)}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>
        </LinearGradient>

        <KeyboardAwareScrollViewCompat
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 24 }]}
          bottomOffset={60}
        >
          <Text style={[styles.headline, { color: colors.foreground }]}>Verify Your{'\n'}Email.</Text>
          <Text style={[styles.subText, { color: colors.mutedForeground }]}>
            We sent a 6-digit code to{'\n'}{email}
          </Text>

          <Text style={[styles.label, { color: colors.mutedForeground }]}>Verification Code</Text>
          <View style={[styles.inputWrap, { backgroundColor: colors.muted, borderColor: colors.border }]}>
            <Ionicons name="shield-checkmark-outline" size={18} color={colors.mutedForeground} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}
              placeholder="Enter 6-digit code"
              placeholderTextColor={colors.mutedForeground}
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              returnKeyType="done"
              onSubmitEditing={handleVerify}
              autoFocus
            />
          </View>

          {error ? <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text> : null}

          <Pressable
            style={({ pressed }) => [styles.signUpBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={[styles.signUpBtnText, { color: colors.primaryForeground }]}>Verify & Continue  →</Text>
            )}
          </Pressable>

          <Pressable
            style={styles.resendRow}
            onPress={() => signUp.verifications.sendEmailCode()}
          >
            <Text style={[styles.resendText, { color: colors.primary }]}>Resend code</Text>
          </Pressable>
        </KeyboardAwareScrollViewCompat>
      </View>
    );
  }

  // ── Sign-up form ─────────────────────────────────────────────────────────
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={[styles.topBar, { paddingTop: topPad }]}
      >
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>
      </LinearGradient>

      <KeyboardAwareScrollViewCompat
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 24 }]}
        bottomOffset={60}
      >
        <Text style={[styles.headline, { color: colors.foreground }]}>Create Your{'\n'}Account.</Text>

        {/* Full Name */}
        <View style={[styles.inputWrap, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Ionicons name="person-outline" size={18} color={colors.mutedForeground} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}
            placeholder="Full Name"
            placeholderTextColor={colors.mutedForeground}
            value={name}
            onChangeText={setName}
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
            autoCapitalize="words"
          />
        </View>

        {/* Email */}
        <View style={[styles.inputWrap, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Ionicons name="mail-outline" size={18} color={colors.mutedForeground} style={styles.inputIcon} />
          <TextInput
            ref={emailRef}
            style={[styles.input, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}
            placeholder="Email Address"
            placeholderTextColor={colors.mutedForeground}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => passRef.current?.focus()}
          />
        </View>

        {/* Password */}
        <View style={[styles.inputWrap, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Ionicons name="lock-closed-outline" size={18} color={colors.mutedForeground} style={styles.inputIcon} />
          <TextInput
            ref={passRef}
            style={[styles.input, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}
            placeholder="Password"
            placeholderTextColor={colors.mutedForeground}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
            returnKeyType="next"
            onSubmitEditing={() => confirmRef.current?.focus()}
          />
          <Pressable onPress={() => setShowPass(v => !v)} hitSlop={8}>
            <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.mutedForeground} />
          </Pressable>
        </View>

        {/* Confirm Password */}
        <View style={[styles.inputWrap, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Ionicons name="lock-closed-outline" size={18} color={colors.mutedForeground} style={styles.inputIcon} />
          <TextInput
            ref={confirmRef}
            style={[styles.input, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}
            placeholder="Confirm Password"
            placeholderTextColor={colors.mutedForeground}
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry={!showConfirm}
            returnKeyType="done"
            onSubmitEditing={handleSignup}
          />
          <Pressable onPress={() => setShowConfirm(v => !v)} hitSlop={8}>
            <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.mutedForeground} />
          </Pressable>
        </View>

        <Text style={[styles.terms, { color: colors.mutedForeground }]}>
          By signing up, you agree to our{' '}
          <Text style={{ color: colors.primary }}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={{ color: colors.primary }}>Privacy Policy</Text>.
        </Text>

        {error ? <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text> : null}

        <Pressable
          style={({ pressed }) => [styles.signUpBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[styles.signUpBtnText, { color: colors.primaryForeground }]}>Sign Up  →</Text>
          )}
        </Pressable>

        {/* Required for Clerk bot protection */}
        <View nativeID="clerk-captcha" />

        <View style={styles.switchRow}>
          <Text style={[styles.switchText, { color: colors.mutedForeground }]}>Already have an account? </Text>
          <Pressable onPress={() => router.replace('/(auth)/login')}>
            <Text style={[styles.switchLink, { color: colors.primary }]}>Sign In</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: { paddingBottom: 16, paddingHorizontal: 16 },
  backBtn: { padding: 10, alignSelf: 'flex-start' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 28 },
  headline: { fontSize: 34, fontFamily: 'Inter_700Bold', lineHeight: 42, marginBottom: 10 },
  subText: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 20, marginBottom: 28 },
  label: { fontSize: 13, fontFamily: 'Inter_600SemiBold', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 14,
    borderWidth: 1, paddingHorizontal: 14, height: 52, marginBottom: 14,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, height: 52 },
  terms: { fontSize: 12, fontFamily: 'Inter_400Regular', lineHeight: 18, marginBottom: 20, marginTop: 4 },
  errorText: { fontSize: 13, textAlign: 'center', marginBottom: 12 },
  signUpBtn: {
    height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#22C55E', shadowOpacity: 0.35, shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }, elevation: 6, marginBottom: 20,
  },
  signUpBtnText: { fontSize: 17, fontFamily: 'Inter_700Bold', letterSpacing: 0.3 },
  resendRow: { alignItems: 'center', paddingVertical: 8 },
  resendText: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  switchRow: { flexDirection: 'row', justifyContent: 'center' },
  switchText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  switchLink: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
});
