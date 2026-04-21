import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AppImage } from '../common/AppImage';
import { HOME_FALLBACK_ARTWORK_URL } from '../../utils/home';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';

interface HomePlaylistPreviewCardProps {
  title: string;
  subtitle: string;
  imageUrl?: string | null;
  onPress: () => void;
}

export function HomePlaylistPreviewCard({
  title,
  subtitle,
  imageUrl,
  onPress,
}: HomePlaylistPreviewCardProps): React.JSX.Element {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <AppImage
        source={{ uri: imageUrl ?? HOME_FALLBACK_ARTWORK_URL }}
        style={styles.cover}
      />
      <View style={styles.copyColumn}>
        <Text numberOfLines={3} style={styles.title}>
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
  card: {
    minWidth: 0,
    width: 138,
  },
  cover: {
    borderRadius: radius.md,
    height: 148,
    marginBottom: spacing.md,
    width: '100%',
  },
  copyColumn: {
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
    marginTop: spacing.xs,
  },
});
