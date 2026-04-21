import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MoreHorizontal } from 'lucide-react-native';
import { AppImage } from './AppImage';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';

interface SongListItemProps {
  artworkUrl?: string | null;
  title: string;
  subtitle: string;
  onPress?: () => void;
  onMorePress?: () => void;
  rightSlot?: React.ReactNode;
}

export function SongListItem({
  artworkUrl,
  title,
  subtitle,
  onPress,
  onMorePress,
  rightSlot,
}: SongListItemProps): React.JSX.Element {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <AppImage
        source={{
          uri:
            artworkUrl ??
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=300&q=80',
        }}
        style={styles.artwork}
      />
      <View style={styles.copyColumn}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <Text numberOfLines={1} style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>
      {rightSlot ?? (onMorePress ? (
        <Pressable style={styles.moreButton} onPress={onMorePress}>
          <MoreHorizontal color={colors.textMuted} size={18} strokeWidth={2.2} />
        </Pressable>
      ) : null)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 60,
  },
  artwork: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    height: 44,
    width: 44,
  },
  copyColumn: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  moreButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
});
