import React from 'react';
import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';

interface AppIconButtonProps extends PressableProps {
  children: React.ReactNode;
  filled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function AppIconButton({
  children,
  filled = true,
  style,
  ...pressableProps
}: AppIconButtonProps): React.JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        filled ? styles.filled : styles.outlined,
        pressed && styles.pressed,
        style,
      ]}
      {...pressableProps}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: radius.pill,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  filled: {
    backgroundColor: colors.primary,
  },
  outlined: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.84,
  },
});
