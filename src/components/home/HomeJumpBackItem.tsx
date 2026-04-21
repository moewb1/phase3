import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { HomeArtworkCollage } from './HomeArtworkCollage';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface HomeJumpBackItemProps {
  artworkUrls: string[];
  title: string;
  subtitle: string;
  onPress: () => void;
}

export function HomeJumpBackItem({
  artworkUrls,
  title,
  subtitle,
  onPress,
}: HomeJumpBackItemProps): React.JSX.Element {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <HomeArtworkCollage artworkUrls={artworkUrls} variant="compact" />
      <View style={styles.copyColumn}>
        <Text numberOfLines={2} style={styles.title}>
          {title}
        </Text>
        <Text numberOfLines={2} style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  copyColumn: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    marginTop: 2,
  },
});
