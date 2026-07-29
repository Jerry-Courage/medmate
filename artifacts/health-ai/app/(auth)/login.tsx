import { useSignIn } from '@clerk/expo';
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

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { signIn, fetchStatus } = useSignIn();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const passwordRef = useRef<TextInput>(null);

  const topPad = Platform.OS === 'web' ? 52 : insets.top;
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
          navigate: ({ decorateUrl }) => { router.replace('/(tabs)'); },
        });
      }
    } catch (e: any) {
      setError(e?.errors?.[0]?.longMessage ?? e?.message ?? 'Sign in failed. Please try again.');
    }
  }

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
        <Text style={styles.headerTitle}>Welcome Back!</Text>
        <Text style={styles.headerSubtitle}>Sign in to continue with Medmate</Text>
      </LinearGradient>

      {/* Curve connector */}
      <View style={[styles.curve, { backgroundColor: colors.background }]}>
        <View style={[styles.curveInner, { backgroundColor: colors.card }]} />
      </View>

      {/* Form */}
      <KeyboardAwareScrollViewCompat
        style={[styles.scroll, { backgroundColor: colors.card }]}
        contentContainerStyle={[styles.formContent, { paddingBottom: bottomPad + 24 }]}
        bottomOffset={60}
      >
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>EMAIL</Text>

        <InputField
          icon="mail-outline"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          colors={colors}
        />

        <View style={styles.passwordHeader}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>PASSWORD</Text>
          <Pressable hitSlop={8}>
            <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot password?</Text>
          </Pressable>
        </View>

        <InputField
          icon="lock-closed-outline"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
          inputRef={passwordRef}
          colors={colors}
          rightElement={
            <Pressable onPress={() => setShowPassword(v => !v)} hitSlop={10}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
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

        <Pressable
          style={({ pressed }) => [styles.cta, { opacity: pressed || loading ? 0.85 : 1 }]}
          onPress={handleLogin}
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
                <Text style={styles.ctaText}>Sign In</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
              </>
            )}
          </LinearGradient>
        </Pressable>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>or</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        {/* Google sign-in placeholder (non-functional, UI only) */}
        <Pressable
          style={({ pressed }) => [
            styles.googleBtn,
            { borderColor: colors.border, opacity: pressed ? 0.7 : 1, backgroundColor: '#fff' },
          ]}
        >
          <Ionicons name="logo-google" size={20} color="#EA4335" />
          <Text style={[styles.googleBtnText, { color: colors.foreground }]}>Continue with Google</Text>
        </Pressable>

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

  curve: { height: 32, overflow: 'hidden' },
  curveInner: {
    height: 48, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    marginTop: -16,
  },

  scroll: { flex: 1 },
  formContent: { paddingHorizontal: 24, paddingTop: 8 },

  sectionLabel: {
    fontSize: 11, fontFamily: 'Inter_600SemiBold', letterSpacing: 1, marginBottom: 10, marginLeft: 2,
  },
  passwordHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10,
  },
  forgotText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },

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

  cta: { marginBottom: 20, marginTop: 4 },
  ctaGradient: {
    height: 54, borderRadius: 27, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#16A34A', shadowOpacity: 0.4, shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }, elevation: 6,
  },
  ctaText: {
    fontSize: 17, fontFamily: 'Inter_700Bold', color: '#fff', letterSpacing: 0.3,
  },

  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 13, fontFamily: 'Inter_400Regular', marginHorizontal: 12 },

  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    height: 52, borderRadius: 14, borderWidth: 1.5, marginBottom: 24,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  googleBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },

  switchRow: { flexDirection: 'row', justifyContent: 'center' },
  switchText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  switchLink: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
});
