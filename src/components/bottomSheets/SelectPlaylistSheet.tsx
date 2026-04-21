import React from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Music4, Plus } from 'lucide-react-native';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { strings } from '../../localization/strings';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import type { PlaylistDraft } from '../../types/app';
import { AppButton } from '../common/AppButton';
import { AppImage } from '../common/AppImage';

interface SelectPlaylistSheetProps {
  playlists: PlaylistDraft[];
  sheetRef: React.RefObject<BottomSheetModal | null>;
  onCreatePlaylist: () => void;
  onSelectPlaylist: (playlistId: string) => void;
}

interface PlaylistOptionRowProps {
  playlist: PlaylistDraft;
  onPress: (playlistId: string) => void;
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

export function SelectPlaylistSheet({
  playlists,
  sheetRef,
  onCreatePlaylist,
  onSelectPlaylist,
}: SelectPlaylistSheetProps): React.JSX.Element {
  function handleCreatePlaylist() {
    sheetRef.current?.dismiss();
    onCreatePlaylist();
  }

  function handleSelectPlaylist(playlistId: string) {
    sheetRef.current?.dismiss();
    onSelectPlaylist(playlistId);
  }

  return (
    <BottomSheetModal
      ref={sheetRef}
      backdropComponent={SheetBackdrop}
      backgroundStyle={styles.sheetBackground}
      enablePanDownToClose
      snapPoints={['66%']}>
      <BottomSheetScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{strings.playlistPicker.title}</Text>
        <Text style={styles.subtitle}>{strings.playlistPicker.subtitle}</Text>
        <AppButton
          label={strings.playlistPicker.createNew}
          style={styles.createButton}
          variant="outlined"
          onPress={handleCreatePlaylist}
        />
        {playlists.length > 0 ? (
          <View style={styles.list}>
            {playlists.map(playlist => (
              <PlaylistOptionRow
                key={playlist.id}
                playlist={playlist}
                onPress={handleSelectPlaylist}
              />
            ))}
          </View>
        ) : (
          <BottomSheetView style={styles.emptyState}>
            <Text style={styles.emptyTitle}>{strings.playlistPicker.emptyTitle}</Text>
            <Text style={styles.emptyCopy}>{strings.playlistPicker.emptyCopy}</Text>
          </BottomSheetView>
        )}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}

function PlaylistOptionRow({
  playlist,
  onPress,
}: PlaylistOptionRowProps): React.JSX.Element {
  const privacyLabel = playlist.isPrivate
    ? strings.common.playlist.private
    : strings.common.playlist.public;

  function handlePress() {
    onPress(playlist.id);
  }

  return (
    <Pressable style={styles.optionRow} onPress={handlePress}>
      {playlist.artworkUrls[0] ? (
        <AppImage source={{ uri: playlist.artworkUrls[0] }} style={styles.artwork} />
      ) : (
        <View style={styles.artworkFallback}>
          <Music4 color={colors.primary} size={22} strokeWidth={2.1} />
        </View>
      )}
      <View style={styles.optionCopy}>
        <Text numberOfLines={1} style={styles.optionTitle}>
          {playlist.name}
        </Text>
        <Text numberOfLines={1} style={styles.optionMeta}>
          {strings.playlistPicker.meta(playlist.songs.length, privacyLabel)}
        </Text>
      </View>
      <View style={styles.plusWrap}>
        <Plus color={colors.primary} size={18} strokeWidth={2.3} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    marginTop: spacing.sm,
  },
  createButton: {
    marginTop: spacing.lg,
  },
  list: {
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  optionRow: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  artwork: {
    backgroundColor: colors.surfaceNeutral,
    borderRadius: radius.md,
    height: 56,
    width: 56,
  },
  artworkFallback: {
    alignItems: 'center',
    backgroundColor: colors.surfaceNeutral,
    borderRadius: radius.md,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  optionCopy: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  optionMeta: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 19,
  },
  plusWrap: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    gap: spacing.sm,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyCopy: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    textAlign: 'center',
  },
});
