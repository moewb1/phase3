import React from 'react';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  CirclePlus,
  Gem,
  Radio,
  Share,
  UserRound,
} from 'lucide-react-native';
import { AppImage } from '../common/AppImage';
import { strings } from '../../localization/strings';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';

interface SongActionsSheetProps {
  sheetRef: React.RefObject<BottomSheetModal | null>;
  artworkUrl?: string | null;
  title?: string;
  subtitle?: string;
  onAddToPlaylist: () => void;
}

interface SongActionItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}

function SheetBackdrop(
  backdropProps: React.ComponentProps<typeof BottomSheetBackdrop>,
): React.JSX.Element {
  return (
    <BottomSheetBackdrop
      {...backdropProps}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={0.45}
    />
  );
}

export function SongActionsSheet({
  sheetRef,
  artworkUrl,
  title,
  subtitle,
  onAddToPlaylist,
}: SongActionsSheetProps): React.JSX.Element {
  const actions: SongActionItem[] = [
    {
      key: 'premium',
      icon: <Gem color={colors.black} size={18} strokeWidth={2.1} />,
      label: strings.songActions.premium,
    },
    {
      key: 'similar',
      icon: <Radio color={colors.black} size={18} strokeWidth={2.1} />,
      label: strings.songActions.similar,
    },
    {
      key: 'playlist',
      icon: <CirclePlus color={colors.black} size={18} strokeWidth={2.1} />,
      label: strings.common.actions.addToPlaylist,
      onPress: onAddToPlaylist,
    },
    {
      key: 'share',
      icon: <Share color={colors.black} size={18} strokeWidth={2.1} />,
      label: strings.common.actions.share,
    },
    {
      key: 'artist',
      icon: <UserRound color={colors.black} size={18} strokeWidth={2.1} />,
      label: strings.common.actions.viewArtist,
    },
  ] as const;

  return (
    <BottomSheetModal
      ref={sheetRef}
      backdropComponent={SheetBackdrop}
      backgroundStyle={styles.sheetBackground}
      handleComponent={null}
      snapPoints={['54%']}>
      <BottomSheetView style={styles.sheetContent}>
        <View style={styles.songRow}>
          <AppImage
            source={{
              uri:
                artworkUrl ??
                'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=300&q=80',
            }}
            style={styles.artwork}
          />
          <View style={styles.songCopy}>
            <Text numberOfLines={1} style={styles.songTitle}>
              {title ?? strings.common.entities.song}
            </Text>
            {subtitle ? (
              <Text numberOfLines={1} style={styles.songSubtitle}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.actionsList}>
          {actions.map(action => (
            <SheetAction
              key={action.key}
              icon={action.icon}
              label={action.label}
              onPress={action.onPress}
            />
          ))}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

interface SheetActionProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}

function SheetAction({ icon, label, onPress }: SheetActionProps): React.JSX.Element {
  return (
    <Pressable style={styles.actionRow} onPress={onPress}>
      {icon}
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  sheetContent: {
    paddingBottom: spacing.xl,
    paddingTop: spacing.xl,
  },
  songRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  artwork: {
    backgroundColor: colors.surfaceNeutral,
    borderRadius: radius.sm,
    height: 50,
    width: 50,
  },
  songCopy: {
    flex: 1,
  },
  songTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
  songSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    marginTop: 2,
  },
  divider: {
    backgroundColor: colors.footerDivider,
    height: 1,
    marginTop: spacing.lg,
    width: '100%',
  },
  actionsList: {
    paddingHorizontal: spacing.xl,
  },
  actionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 56,
  },
  actionLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
});
