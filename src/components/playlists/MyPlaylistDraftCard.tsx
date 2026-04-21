import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Music4 } from 'lucide-react-native';
import { AppImage } from '../common/AppImage';
import { strings } from '../../localization/strings';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';
import { spacing } from '../../theme/spacing';

interface MyPlaylistDraftCardProps {
  imageUrl?: string;
  title: string;
  songCount: number;
  isPrivate: boolean;
  onPress: () => void;
}

export function MyPlaylistDraftCard({
  imageUrl,
  title,
  songCount,
  isPrivate,
  onPress,
}: MyPlaylistDraftCardProps): React.JSX.Element {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.visualRow}>
        <View style={styles.imageWrap}>
          {imageUrl ? (
            <AppImage source={{ uri: imageUrl }} style={styles.image} />
          ) : (
            <View style={styles.fallbackArtwork}>
              <Music4 color={colors.primary} size={28} strokeWidth={2.2} />
            </View>
          )}
        </View>
        <View style={styles.divider} />
        <View style={styles.visualSpacer} />
      </View>
      <View style={styles.copyBlock}>
        <Text numberOfLines={2} style={styles.title}>
          {title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.songCount}>{strings.common.playlist.songCount(songCount)}</Text>
          <View style={styles.privacyRow}>
            <View style={[styles.privacyDot, !isPrivate && styles.publicDot]} />
            <Text style={[styles.privacyLabel, !isPrivate && styles.publicLabel]}>
              {isPrivate
                ? strings.common.playlist.private
                : strings.common.playlist.public}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadows.card,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    minHeight: 228,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  visualRow: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 126,
  },
  imageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 128,
  },
  image: {
    borderRadius: radius.md,
    height: 112,
    width: 112,
  },
  fallbackArtwork: {
    alignItems: 'center',
    backgroundColor: colors.surfaceNeutral,
    borderRadius: radius.md,
    height: 112,
    justifyContent: 'center',
    width: 112,
  },
  divider: {
    backgroundColor: colors.footerDivider,
    height: 92,
    marginHorizontal: spacing.md,
    width: 1,
  },
  visualSpacer: {
    flex: 1,
  },
  copyBlock: {
    marginTop: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.xs,
  },
  songCount: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
  privacyRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  privacyDot: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    height: 6,
    width: 6,
  },
  publicDot: {
    backgroundColor: colors.textSecondary,
  },
  privacyLabel: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
  publicLabel: {
    color: colors.textSecondary,
  },
});
