import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';
import { spacing } from '../../theme/spacing';

interface SectionCardProps {
  title?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function SectionCard({
  title,
  children,
  style,
}: SectionCardProps): React.JSX.Element {
  return (
    <View style={[styles.card, style]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadows.card,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: spacing.lg,
  },
});
