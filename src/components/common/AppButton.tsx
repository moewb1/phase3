import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';

interface AppButtonProps extends PressableProps {
  label: string;
  variant?: 'filled' | 'outlined' | 'ghost';
  style?: StyleProp<ViewStyle>;
}

export function AppButton({
  label,
  variant = 'filled',
  style,
  ...pressableProps
}: AppButtonProps): React.JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        variant === 'filled' && styles.filled,
        variant === 'outlined' && styles.outlined,
        variant === 'ghost' && styles.ghost,
        pressed && styles.pressed,
        style,
      ]}
      {...pressableProps}>
      <Text
        style={[
          styles.label,
          variant === 'filled' ? styles.labelFilled : styles.labelOutlined,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: radius.pill,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.xxl,
  },
  filled: {
    backgroundColor: colors.primary,
  },
  outlined: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 1.2,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.88,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
  },
  labelFilled: {
    color: colors.white,
  },
  labelOutlined: {
    color: colors.primary,
  },
});
