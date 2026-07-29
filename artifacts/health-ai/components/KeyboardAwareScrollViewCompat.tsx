import { KeyboardAvoidingView, Platform, ScrollView, ScrollViewProps } from 'react-native';

type Props = ScrollViewProps & {
  bottomOffset?: number; // ignored on native (was KeyboardAwareScrollView-specific), kept for API compat
};

export function KeyboardAwareScrollViewCompat({
  children,
  keyboardShouldPersistTaps = 'handled',
  bottomOffset: _bottomOffset,
  ...props
}: Props) {
  if (Platform.OS === 'web') {
    return (
      <ScrollView keyboardShouldPersistTaps={keyboardShouldPersistTaps} {...props}>
        {children}
      </ScrollView>
    );
  }

  // Use KeyboardAvoidingView + ScrollView instead of KeyboardAwareScrollView from
  // react-native-keyboard-controller, which causes focus to drop on iOS and loops
  // through inputs on Android due to its auto-scroll behaviour.
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        showsVerticalScrollIndicator={false}
        {...props}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
