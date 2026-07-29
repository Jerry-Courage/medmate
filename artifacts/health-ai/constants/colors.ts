/**
 * Health AI — green medical theme (light + dark)
 */

const colors = {
  light: {
    text: '#111827',
    tint: '#22C55E',

    background: '#FFFFFF',
    foreground: '#111827',

    card: '#F9FAFB',
    cardForeground: '#111827',

    primary: '#22C55E',
    primaryForeground: '#FFFFFF',
    primaryDark: '#16A34A',
    primaryLight: '#DCFCE7',

    secondary: '#F3F4F6',
    secondaryForeground: '#374151',

    muted: '#F3F4F6',
    mutedForeground: '#6B7280',

    accent: '#DCFCE7',
    accentForeground: '#16A34A',

    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',

    border: '#E5E7EB',
    input: '#F3F4F6',
    inputForeground: '#111827',

    success: '#22C55E',
    warning: '#F59E0B',
    info: '#3B82F6',

    chatUser: '#22C55E',
    chatAI: '#FFFFFF',

    gradientStart: '#4ADE80',
    gradientEnd: '#16A34A',

    tabBarBlurTint: 'light' as const,
    statusBar: 'dark-content' as const,
  },

  dark: {
    text: '#F9FAFB',
    tint: '#4ADE80',

    background: '#0F172A',
    foreground: '#F1F5F9',

    card: '#1E293B',
    cardForeground: '#F1F5F9',

    primary: '#22C55E',
    primaryForeground: '#FFFFFF',
    primaryDark: '#4ADE80',
    primaryLight: '#14532D',

    secondary: '#1E293B',
    secondaryForeground: '#CBD5E1',

    muted: '#1E293B',
    mutedForeground: '#94A3B8',

    accent: '#14532D',
    accentForeground: '#4ADE80',

    destructive: '#F87171',
    destructiveForeground: '#FFFFFF',

    border: '#334155',
    input: '#1E293B',
    inputForeground: '#F1F5F9',

    success: '#4ADE80',
    warning: '#FCD34D',
    info: '#60A5FA',

    chatUser: '#22C55E',
    chatAI: '#1E293B',

    gradientStart: '#166534',
    gradientEnd: '#14532D',

    tabBarBlurTint: 'dark' as const,
    statusBar: 'light-content' as const,
  },

  radius: 14,
};

export default colors;
