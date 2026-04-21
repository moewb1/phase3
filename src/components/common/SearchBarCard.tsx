import React from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';
import { spacing } from '../../theme/spacing';

interface SearchBarCardProps extends TextInputProps {
  onSubmit?: () => void;
}

export function SearchBarCard({
  onSubmit,
  ...textInputProps
}: SearchBarCardProps): React.JSX.Element {
  return (
    <View style={styles.wrapper}>
      <TextInput
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        style={styles.input}
        onSubmitEditing={onSubmit}
        {...textInputProps}
      />
      <Pressable disabled={!onSubmit} style={styles.action} onPress={onSubmit}>
        <Search color={colors.textMuted} size={18} strokeWidth={2.25} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    ...shadows.card,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  input: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    minHeight: 44,
  },
  action: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
});
