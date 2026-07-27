import { useAuth } from '@/context/AuthContext';
import { useColors } from '@/hooks/useColors';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
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
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const phoneRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  async function handleSignup() {
    if (!name.trim() || !phone.trim() || !password.trim() || !confirm.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await signup(name.trim(), phone.trim(), password);
      router.replace('/(tabs)');
    } catch {
      setError('Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Minimal green top bar */}
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

        <InputField
          icon="person-outline"
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          returnKeyType="next"
          onSubmitEditing={() => phoneRef.current?.focus()}
          colors={colors}
        />

        <InputField
          ref={phoneRef}
          icon="call-outline"
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          returnKeyType="next"
          onSubmitEditing={() => passRef.current?.focus()}
          colors={colors}
        />

        <InputField
          ref={passRef}
          icon="lock-closed-outline"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPass}
          returnKeyType="next"
          onSubmitEditing={() => confirmRef.current?.focus()}
          onToggleSecure={() => setShowPass(v => !v)}
          showSecure={showPass}
          colors={colors}
        />

        <InputField
          ref={confirmRef}
          icon="lock-closed-outline"
          placeholder="Confirm Password"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry={!showConfirm}
          returnKeyType="done"
          onSubmitEditing={handleSignup}
          onToggleSecure={() => setShowConfirm(v => !v)}
          showSecure={showConfirm}
          colors={colors}
        />

        <Text style={[styles.terms, { color: colors.mutedForeground }]}>
          By signing up, you agree to our{' '}
          <Text style={{ color: colors.primary }}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={{ color: colors.primary }}>Privacy Policy</Text>.
        </Text>

        {error ? <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text> : null}

        {/* Sign Up button */}
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

        {/* Divider */}
        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>or continue with</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        {/* Social buttons */}
        <View style={styles.socialRow}>
          {[{ icon: 'logo-apple', bg: '#000' }, { icon: 'logo-google', bg: '#DB4437' }, { icon: 'logo-facebook', bg: '#1877F2' }].map(s => (
            <Pressable key={s.icon} style={({ pressed }) => [styles.socialBtn, { backgroundColor: s.bg, opacity: pressed ? 0.8 : 1 }]}>
              <Ionicons name={s.icon as any} size={22} color="#fff" />
            </Pressable>
          ))}
        </View>

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

function InputField({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  returnKeyType,
  onSubmitEditing,
  secureTextEntry,
  onToggleSecure,
  showSecure,
  colors,
  ref,
}: any) {
  return (
    <View style={[styles.inputWrap, { backgroundColor: colors.muted, borderColor: colors.border }]}>
      <Ionicons name={icon} size={18} color={colors.mutedForeground} style={styles.inputIcon} />
      <TextInput
        ref={ref}
        style={[styles.input, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType ?? 'default'}
        returnKeyType={returnKeyType ?? 'done'}
        onSubmitEditing={onSubmitEditing}
        secureTextEntry={secureTextEntry ?? false}
        autoCapitalize={keyboardType === 'phone-pad' || secureTextEntry ? 'none' : 'words'}
      />
      {onToggleSecure && (
        <Pressable onPress={onToggleSecure} hitSlop={8}>
          <Ionicons name={showSecure ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.mutedForeground} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backBtn: { padding: 10, alignSelf: 'flex-start' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 28 },
  headline: {
    fontSize: 34,
    fontFamily: 'Inter_700Bold',
    lineHeight: 42,
    marginBottom: 28,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 14,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, height: 52 },
  terms: { fontSize: 12, fontFamily: 'Inter_400Regular', lineHeight: 18, marginBottom: 20, marginTop: 4 },
  errorText: { fontSize: 13, textAlign: 'center', marginBottom: 12 },
  signUpBtn: {
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22C55E',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  signUpBtnText: { fontSize: 17, fontFamily: 'Inter_700Bold', letterSpacing: 0.3 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 22, gap: 12 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 24 },
  socialBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  switchRow: { flexDirection: 'row', justifyContent: 'center' },
  switchText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  switchLink: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
});
