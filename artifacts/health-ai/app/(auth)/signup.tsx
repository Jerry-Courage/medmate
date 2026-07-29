import { useSignUp } from '@clerk/expo';
import { useColors } from '@/hooks/useColors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
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

function InputField({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  returnKeyType,
  onSubmitEditing,
  inputRef,
  rightElement,
  colors,
  autoFocus,
}: any) {
  const [focused, setFocused] = useState(false);
  return (
    <View
      style={[
        styles.inputWrap,
        {
          backgroundColor: colors.card,
          borderColor: focused ? colors.primary : colors.border,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={18}
        color={focused ? colors.primary : colors.mutedForeground}
        style={styles.inputIcon}
      />
      <TextInput
        ref={inputRef}
        style={{
          flex: 1,
          fontSize: 15,
          height: 54,
          color: colors.foreground,
          fontFamily: 'Inter_400Regular',
        }}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize ?? 'none'}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoFocus={autoFocus}
      />
      {rightElement}
    </View>
  );
}

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

  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  const emailRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const topPad = Platform.OS === 'web' ? 52 : insets.top;
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
      });
      if (signUpError) {
        setError(signUpError.message ?? 'Sign up failed. Please try again.');
        return;
      }
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
        await signUp.finalize({ navigate: () => { router.replace('/(tabs)'); } });
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
          style={[styles.header, { paddingTop: topPad + 12 }]}
        >
          <Pressable style={styles.backBtn} onPress={() => setPendingVerification(false)}>
            <View style={styles.backBtnCircle}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </View>
          </Pressable>
          <View style={styles.headerBrand}>
            <View style={styles.iconRing}>
              <Ionicons name="shield-checkmark" size={28} color={colors.gradientEnd} />
            </View>
          </View>
          <Text style={styles.headerTitle}>Check Your Email</Text>
          <Text style={styles.headerSubtitle}>A 6-digit code was sent to</Text>
          <Text style={[styles.headerSubtitle, { fontFamily: 'Inter_600SemiBold' }]}>{email}</Text>
        </LinearGradient>

        <View style={styles.curve} />

        <KeyboardAwareScrollViewCompat
          style={styles.scroll}
          contentContainerStyle={[styles.formContent, { paddingBottom: bottomPad + 24 }]}
          bottomOffset={60}
        >
          <InputField
            icon="keypad-outline"
            placeholder="Enter 6-digit code"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            returnKeyType="done"
            onSubmitEditing={handleVerify}
            colors={colors}
            autoFocus
          />

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={15} color={colors.destructive} />
              <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
            </View>
          ) : null}

          <Pressable
            style={({ pressed }) => [styles.cta, { opacity: pressed || loading ? 0.85 : 1 }]}
            onPress={handleVerify}
            disabled={loading}
          >
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.ctaText}>Verify & Continue</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
                </>
              )}
            </LinearGradient>
          </Pressable>

          <Pressable
            style={styles.resendRow}
            onPress={() => signUp.verifications.sendEmailCode()}
          >
            <Text style={[styles.resendText, { color: colors.mutedForeground }]}>
              Didn't receive it?{' '}
              <Text style={{ color: colors.primary, fontFamily: 'Inter_600SemiBold' }}>Resend code</Text>
            </Text>
          </Pressable>
        </KeyboardAwareScrollViewCompat>
      </View>
    );
  }

  // ── Sign-up form ─────────────────────────────────────────────────────────
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={[styles.header, { paddingTop: topPad + 12 }]}
      >
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <View style={styles.backBtnCircle}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </View>
        </Pressable>
        <View style={styles.headerBrand}>
          <View style={styles.iconRing}>
            <Image
              source={require('@/assets/images/ai-robot.png')}
              style={{ width: 34, height: 34 }}
              contentFit="contain"
            />
          </View>
        </View>
        <Text style={styles.headerTitle}>Create Account</Text>
        <Text style={styles.headerSubtitle}>Your health journey starts here</Text>
      </LinearGradient>

      {/* Curve connector */}
      <View style={[styles.curve, { backgroundColor: colors.background }]}>
        <View style={[styles.curveInner, { backgroundColor: colors.card }]} />
      </View>

      <KeyboardAwareScrollViewCompat
        style={[styles.scroll, { backgroundColor: colors.card }]}
        contentContainerStyle={[styles.formContent, { paddingBottom: bottomPad + 24 }]}
        bottomOffset={60}
      >
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>YOUR INFORMATION</Text>

        <InputField
          icon="person-outline"
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          autoCapitalize="words"
          colors={colors}
        />

        <InputField
          icon="mail-outline"
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          returnKeyType="next"
          onSubmitEditing={() => passRef.current?.focus()}
          inputRef={emailRef}
          colors={colors}
        />

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground, marginTop: 8 }]}>PASSWORD</Text>

        <InputField
          icon="lock-closed-outline"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPass}
          returnKeyType="next"
          onSubmitEditing={() => confirmRef.current?.focus()}
          inputRef={passRef}
          colors={colors}
          rightElement={
            <Pressable onPress={() => setShowPass(v => !v)} hitSlop={10}>
              <Ionicons
                name={showPass ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={colors.mutedForeground}
              />
            </Pressable>
          }
        />

        <InputField
          icon="lock-closed-outline"
          placeholder="Confirm Password"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry={!showConfirm}
          returnKeyType="done"
          onSubmitEditing={handleSignup}
          inputRef={confirmRef}
          colors={colors}
          rightElement={
            <Pressable onPress={() => setShowConfirm(v => !v)} hitSlop={10}>
              <Ionicons
                name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={colors.mutedForeground}
              />
            </Pressable>
          }
        />

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={15} color={colors.destructive} />
            <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
          </View>
        ) : null}

        <Text style={[styles.terms, { color: colors.mutedForeground }]}>
          By signing up, you agree to our{' '}
          <Text style={{ color: colors.primary }}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={{ color: colors.primary }}>Privacy Policy</Text>.
        </Text>

        <Pressable
          style={({ pressed }) => [styles.cta, { opacity: pressed || loading ? 0.85 : 1 }]}
          onPress={handleSignup}
          disabled={loading}
        >
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.ctaText}>Create Account</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
              </>
            )}
          </LinearGradient>
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

  header: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: 'center',
  },
  backBtn: { position: 'absolute', left: 16, top: 16 },
  backBtnCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerBrand: { marginBottom: 14 },
  iconRing: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  headerTitle: {
    fontSize: 24, fontFamily: 'Inter_700Bold', color: '#fff', marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.85)',
  },

  // Curved connector between header and white body
  curve: { height: 32, overflow: 'hidden' },
  curveInner: {
    height: 48, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    marginTop: -16,
  },

  scroll: { flex: 1 },
  formContent: { paddingHorizontal: 24, paddingTop: 8 },

  sectionLabel: {
    fontSize: 11, fontFamily: 'Inter_600SemiBold', letterSpacing: 1,
    marginBottom: 10, marginLeft: 2,
  },

  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 14, borderWidth: 1.5,
    paddingHorizontal: 14, height: 54, marginBottom: 12,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, height: 54 },

  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FEF2F2', borderRadius: 10, padding: 10, marginBottom: 12,
  },
  errorText: { fontSize: 13, fontFamily: 'Inter_400Regular', flex: 1 },

  terms: {
    fontSize: 12, fontFamily: 'Inter_400Regular', lineHeight: 18,
    textAlign: 'center', marginBottom: 18, marginTop: 4,
  },

  cta: { marginBottom: 20 },
  ctaGradient: {
    height: 54, borderRadius: 27, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#16A34A', shadowOpacity: 0.4, shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }, elevation: 6,
  },
  ctaText: {
    fontSize: 17, fontFamily: 'Inter_700Bold', color: '#fff', letterSpacing: 0.3,
  },

  resendRow: { alignItems: 'center', paddingVertical: 8 },
  resendText: { fontSize: 14, fontFamily: 'Inter_400Regular' },

  switchRow: { flexDirection: 'row', justifyContent: 'center', paddingTop: 4 },
  switchText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  switchLink: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
});
