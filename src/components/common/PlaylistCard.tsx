import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AppImage } from './AppImage';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';
import { spacing } from '../../theme/spacing';

interface PlaylistCardProps {
  title: string;
  subtitle: string;
  artworkUrls: string[];
  onPress: () => void;
}

export function PlaylistCard({
  title,
  subtitle,
  artworkUrls,
  onPress,
}: PlaylistCardProps): React.JSX.Element {
  const collageItems = artworkUrls.slice(0, 4);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.copyColumn}>
        <Text numberOfLines={2} style={styles.title}>
          {title}
        </Text>
        <Text numberOfLines={2} style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>
      <View style={styles.collage}>
        {collageItems.map((artworkUrl, index) => (
          <AppImage
            key={`${artworkUrl}-${index}`}
            source={{ uri: artworkUrl }}
            style={styles.collageImage}
          />
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadows.card,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    flexDirection: 'row',
    gap: spacing.lg,
    padding: spacing.xl,
  },
  copyColumn: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 19,
  },
  collage: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    width: 132,
  },
  collageImage: {
    borderRadius: radius.sm,
    height: 60,
    width: 60,
  },
});
