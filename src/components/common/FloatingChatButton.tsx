import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';

interface FloatingChatButtonProps {
  onPress: () => void;
}

export function FloatingChatButton({
  onPress,
}: FloatingChatButtonProps): React.JSX.Element {
  return (
    <View pointerEvents="box-none" style={styles.container}>
      <Pressable style={styles.button} onPress={onPress}>
        <MessageCircle color={colors.white} size={20} strokeWidth={2.3} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    bottom: 28,
    left: 18,
    position: 'absolute',
  },
  button: {
    ...shadows.overlay,
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
});
