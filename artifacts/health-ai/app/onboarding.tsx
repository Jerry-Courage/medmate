import { useColors } from '@/hooks/useColors';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.3, y: 1 }}
      style={[styles.container, { paddingTop: topPad }]}
    >
      {/* Decorative circles */}
      <View style={[styles.circleTopRight, { borderColor: 'rgba(255,255,255,0.15)' }]} />
      <View style={[styles.circleBottomLeft, { borderColor: 'rgba(255,255,255,0.1)' }]} />

      {/* Robot image */}
      <View style={styles.robotContainer}>
        <Image
          source={require('../assets/images/ai-robot.png')}
          style={styles.robotImage}
          resizeMode="contain"
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.headline}>Your Health,{'\n'}Powered by AI</Text>
        <Text style={styles.subtitle}>
          Your personal AI health assistant connected to your IoT devices — predictions, insights, and care at your fingertips.
        </Text>

        {/* Dots */}
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* Buttons */}
        <View style={[styles.buttonRow, { paddingBottom: bottomPad + 16 }]}>
          <Pressable
            style={({ pressed }) => [styles.btnOutline, pressed && { opacity: 0.75 }]}
            onPress={() => router.push('/(auth)/signup')}
          >
            <Text style={styles.btnOutlineText}>Get Started</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.btnSolid, pressed && { opacity: 0.75 }]}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.btnSolidText}>Sign In</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  circleTopRight: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 40,
  },
  circleBottomLeft: {
    position: 'absolute',
    bottom: 120,
    left: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 40,
  },
  robotContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  robotImage: {
    width: 260,
    height: 260,
  },
  content: {
    paddingHorizontal: 28,
  },
  headline: {
    fontSize: 38,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    lineHeight: 46,
    marginBottom: 14,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 22,
    marginBottom: 28,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    width: 22,
    backgroundColor: '#FFFFFF',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  btnOutline: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutlineText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  btnSolid: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSolidText: {
    color: '#16A34A',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
});
