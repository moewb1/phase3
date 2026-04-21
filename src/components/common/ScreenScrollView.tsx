import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '../../theme/spacing';
import { ThematicFooter } from '../footer/ThematicFooter';

interface ScreenScrollViewProps {
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  showsVerticalScrollIndicator?: boolean;
}

export function ScreenScrollView({
  children,
  contentContainerStyle,
  showsVerticalScrollIndicator = false,
}: ScreenScrollViewProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const footerWrapStyle = useMemo(
    () => [styles.footerWrap, { paddingBottom: insets.bottom }],
    [insets.bottom],
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}>
      <View style={contentContainerStyle}>{children}</View>
      <View style={footerWrapStyle}>
        <ThematicFooter />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  footerWrap: {
    marginTop: spacing.xl,
  },
});
