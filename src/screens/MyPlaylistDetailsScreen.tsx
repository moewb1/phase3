import React, { useMemo, useRef, useState } from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import DraggableFlatList, {
  type RenderItemParams,
  type DragEndParams,
} from 'react-native-draggable-flatlist';
import {
  CheckSquare,
  GripVertical,
  Music4,
  Pencil,
  Share2,
  Square,
} from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EditPlaylistSheet } from '../components/bottomSheets/EditPlaylistSheet';
import { SelectPlaylistSheet } from '../components/bottomSheets/SelectPlaylistSheet';
import { SongActionsSheet } from '../components/bottomSheets/SongActionsSheet';
import { AppImage } from '../components/common/AppImage';
import { AppButton } from '../components/common/AppButton';
import { AppIconButton } from '../components/common/AppIconButton';
import { AppScaffold } from '../components/common/AppScaffold';
import { ScreenScrollView } from '../components/common/ScreenScrollView';
import { SearchBarCard } from '../components/common/SearchBarCard';
import { SectionCard } from '../components/common/SectionCard';
import { SongListItem } from '../components/common/SongListItem';
import { SortMenu } from '../components/common/SortMenu';
import { strings } from '../localization/strings';
import { useAppStore } from '../store/AppStore';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import type { PlaylistDraftSong } from '../types/app';
import type { RootStackParamList } from '../types/navigation';

type MyPlaylistDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'MyPlaylistDetails'
>;

interface PlaylistSongsListProps {
  songs: PlaylistDraftSong[];
  onOpenSongActions: (song: PlaylistDraftSong) => void;
}

interface EmptySongsStateProps {
  title: string;
  copy: string;
}

interface EditablePlaylistSongRowProps {
  isActive: boolean;
  selected: boolean;
  song: PlaylistDraftSong;
  onDrag: () => void;
  onToggleSelection: (songId: string) => void;
}

interface PlaylistSongRowProps {
  song: PlaylistDraftSong;
  onOpenSongActions: (song: PlaylistDraftSong) => void;
}

export function MyPlaylistDetailsScreen({
  navigation,
  route,
}: MyPlaylistDetailsScreenProps): React.JSX.Element {
  const {
    selectedChannel,
    playlistDrafts,
    addSongToPlaylist,
    createPlaylist,
    deleteSongsFromPlaylist,
    reorderPlaylistSongs,
    updatePlaylistText,
  } = useAppStore();
  const playlist = playlistDrafts.find(item => item.id === route.params.playlistId);
  const [searchValue, setSearchValue] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('date');
  const [editing, setEditing] = useState(false);
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);
  const [selectedSong, setSelectedSong] = useState<PlaylistDraftSong | null>(null);
  const [playlistEditorToken, setPlaylistEditorToken] = useState(0);
  const songSheetRef = useRef<BottomSheetModal>(null);
  const playlistSheetRef = useRef<BottomSheetModal>(null);
  const playlistEditorSheetRef = useRef<BottomSheetModal>(null);

  const displaySongs = useMemo(() => {
    if (!playlist) {
      return [];
    }

    if (editing) {
      return playlist.songs;
    }

    const filteredSongs = playlist.songs.filter(song => {
      if (!searchValue.trim()) {
        return true;
      }

      const query = searchValue.toLowerCase();
      return (
        song.title.toLowerCase().includes(query) ||
        song.artistName.toLowerCase().includes(query)
      );
    });

    return [...filteredSongs].sort((leftSong, rightSong) => {
      if (sortBy === 'name') {
        return leftSong.title.localeCompare(rightSong.title);
      }

      return 0;
    });
  }, [editing, playlist, searchValue, sortBy]);

  function handleToggleSongSelection(songId: string) {
    setSelectedSongIds(currentIds =>
      currentIds.includes(songId)
        ? currentIds.filter(id => id !== songId)
        : [...currentIds, songId],
    );
  }

  function handleStartEditing() {
    setEditing(true);
  }

  function handleSaveEditing() {
    setEditing(false);
    setSelectedSongIds([]);
  }

  function handleDeleteSelectedSongs() {
    if (!playlist) {
      return;
    }

    deleteSongsFromPlaylist(playlist.id, selectedSongIds);
    setSelectedSongIds([]);
  }

  function handleOpenSongActions(song: PlaylistDraftSong) {
    setSelectedSong(song);
    songSheetRef.current?.present();
  }

  function handleOpenPlaylistPicker() {
    playlistSheetRef.current?.present();
  }

  function handleSelectPlaylist(playlistId: string) {
    if (!selectedSong) {
      return;
    }

    songSheetRef.current?.dismiss();
    addSongToPlaylist(playlistId, selectedSong);
    navigation.navigate('MyPlaylistDetails', { playlistId });
  }

  function handleCreatePlaylistForSelectedSong() {
    if (!selectedSong) {
      return;
    }

    const playlistId = createPlaylist(strings.common.playlist.newName);
    handleSelectPlaylist(playlistId);
  }

  function handleOpenPlaylistEditor() {
    setPlaylistEditorToken(currentToken => currentToken + 1);
    playlistEditorSheetRef.current?.present();
  }

  function handleSavePlaylistDetails(values: {
    description: string;
    name: string;
  }) {
    if (!playlist) {
      return;
    }

    updatePlaylistText(playlist.id, {
      description: values.description || playlist.description,
      name: values.name || playlist.name,
    });
  }

  function handleSharePlaylist() {
    if (!playlist) {
      return;
    }

    Share.share({
      message: strings.common.share.playlist(playlist.name, playlist.description),
    }).catch(() => undefined);
  }

  function handleDragEnd({ data }: DragEndParams<PlaylistDraftSong>) {
    if (!playlist) {
      return;
    }

    reorderPlaylistSongs(playlist.id, data);
  }

  const renderEditableSong = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<PlaylistDraftSong>): React.JSX.Element => (
    <EditablePlaylistSongRow
      isActive={isActive}
      selected={selectedSongIds.includes(item.id)}
      song={item}
      onDrag={drag}
      onToggleSelection={handleToggleSongSelection}
    />
  );

  if (!playlist) {
    return (
      <AppScaffold navigation={navigation}>
        <ScreenScrollView contentContainerStyle={styles.missingContent}>
          <View style={styles.missingWrap}>
            <Text style={styles.missingTitle}>{strings.myPlaylistDetails.missing}</Text>
          </View>
        </ScreenScrollView>
      </AppScaffold>
    );
  }

  const privacyLabel = playlist.isPrivate
    ? strings.common.playlist.private
    : strings.common.playlist.public;

  return (
    <AppScaffold navigation={navigation}>
      <ScreenScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          {playlist.artworkUrls[0] ? (
            <AppImage source={{ uri: playlist.artworkUrls[0] }} style={styles.heroArtwork} />
          ) : (
            <View style={styles.heroArtworkPlaceholder}>
              <Music4 color={colors.primary} size={40} strokeWidth={2} />
            </View>
          )}
          <Text style={styles.heroTitle}>{playlist.name}</Text>
          <Text style={styles.heroMeta}>
            {strings.myPlaylistDetails.hero.meta(
              selectedChannel.title,
              playlist.songs.length,
              privacyLabel,
            )}
          </Text>
          <Text style={styles.heroCopy}>{playlist.description}</Text>
          <View style={styles.heroActions}>
            <AppIconButton onPress={handleOpenPlaylistEditor}>
              <Pencil color={colors.white} size={18} strokeWidth={2.4} />
            </AppIconButton>
            <AppIconButton onPress={handleSharePlaylist}>
              <Share2 color={colors.white} size={18} strokeWidth={2.4} />
            </AppIconButton>
          </View>
        </View>
        <View style={styles.sortRow}>
          <SortMenu value={sortBy} onChange={setSortBy} />
        </View>
        <SectionCard>
          <View style={styles.searchRow}>
            <View style={styles.searchFill}>
              <SearchBarCard
                placeholder={strings.common.actions.search}
                value={searchValue}
                onChangeText={setSearchValue}
              />
            </View>
            {!editing ? (
              <AppIconButton
                filled={false}
                style={styles.inlineEditButton}
                onPress={handleStartEditing}>
                <Pencil color={colors.text} size={18} strokeWidth={2.2} />
              </AppIconButton>
            ) : null}
          </View>
          {editing ? (
            <>
              <View style={styles.bulkActions}>
                <AppButton
                  label={strings.common.actions.delete}
                  variant="outlined"
                  onPress={handleDeleteSelectedSongs}
                />
                <AppButton
                  label={strings.common.actions.save}
                  onPress={handleSaveEditing}
                />
              </View>
              <DraggableFlatList
                activationDistance={12}
                data={playlist.songs}
                keyExtractor={item => item.id}
                renderItem={renderEditableSong}
                scrollEnabled={false}
                onDragEnd={handleDragEnd}
              />
              {playlist.songs.length === 0 ? (
                <EmptySongsState
                  copy={strings.myPlaylistDetails.emptyPlaylist.copy}
                  title={strings.myPlaylistDetails.emptyPlaylist.title}
                />
              ) : null}
            </>
          ) : (
            <>
              <PlaylistSongsList
                songs={displaySongs}
                onOpenSongActions={handleOpenSongActions}
              />
              {displaySongs.length === 0 ? (
                <EmptySongsState
                  copy={strings.myPlaylistDetails.emptySearch.copy}
                  title={strings.myPlaylistDetails.emptySearch.title}
                />
              ) : null}
            </>
          )}
        </SectionCard>
      </ScreenScrollView>
      <SongActionsSheet
        artworkUrl={selectedSong?.artworkUrl}
        sheetRef={songSheetRef}
        subtitle={selectedSong?.artistName}
        title={selectedSong?.title}
        onAddToPlaylist={handleOpenPlaylistPicker}
      />
      <SelectPlaylistSheet
        playlists={playlistDrafts}
        sheetRef={playlistSheetRef}
        onCreatePlaylist={handleCreatePlaylistForSelectedSong}
        onSelectPlaylist={handleSelectPlaylist}
      />
      <EditPlaylistSheet
        initialDescription={playlist.description}
        initialName={playlist.name}
        openToken={playlistEditorToken}
        sheetRef={playlistEditorSheetRef}
        onSave={handleSavePlaylistDetails}
      />
    </AppScaffold>
  );
}

function PlaylistSongsList({
  songs,
  onOpenSongActions,
}: PlaylistSongsListProps): React.JSX.Element {
  return (
    <View style={styles.listColumn}>
      {songs.map(song => (
        <PlaylistSongRow
          key={song.id}
          song={song}
          onOpenSongActions={onOpenSongActions}
        />
      ))}
    </View>
  );
}

function EmptySongsState({ title, copy }: EmptySongsStateProps): React.JSX.Element {
  return (
    <View style={styles.emptySongsState}>
      <Text style={styles.emptySongsTitle}>{title}</Text>
      <Text style={styles.emptySongsCopy}>{copy}</Text>
    </View>
  );
}

function EditablePlaylistSongRow({
  isActive,
  selected,
  song,
  onDrag,
  onToggleSelection,
}: EditablePlaylistSongRowProps): React.JSX.Element {
  function handleToggleSelection() {
    onToggleSelection(song.id);
  }

  return (
    <Pressable
      style={[styles.editableRow, isActive && styles.editableRowActive]}
      onLongPress={onDrag}
      onPress={handleToggleSelection}>
      <Pressable onPress={handleToggleSelection}>
        {selected ? (
          <CheckSquare color={colors.primary} size={20} strokeWidth={2.3} />
        ) : (
          <Square color={colors.primary} size={20} strokeWidth={2.3} />
        )}
      </Pressable>
      <AppImage source={{ uri: song.artworkUrl }} style={styles.songArtwork} />
      <View style={styles.songCopyColumn}>
        <Text style={styles.songTitle}>{song.title}</Text>
        <Text style={styles.songSubtitle}>{song.artistName}</Text>
      </View>
      <GripVertical color={colors.textMuted} size={20} strokeWidth={2.2} />
    </Pressable>
  );
}

function PlaylistSongRow({
  song,
  onOpenSongActions,
}: PlaylistSongRowProps): React.JSX.Element {
  function handleOpenSongActions() {
    onOpenSongActions(song);
  }

  return (
    <SongListItem
      artworkUrl={song.artworkUrl}
      subtitle={song.artistName}
      title={song.title}
      onMorePress={handleOpenSongActions}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xl,
  },
  missingContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  missingWrap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  missingTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  heroCard: {
    backgroundColor: colors.accent,
    borderRadius: radius.xl,
    overflow: 'hidden',
    padding: spacing.xxl,
  },
  heroArtwork: {
    borderRadius: radius.lg,
    height: 220,
    marginBottom: spacing.xl,
    width: '100%',
  },
  heroArtworkPlaceholder: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    height: 220,
    justifyContent: 'center',
    marginBottom: spacing.xl,
    width: '100%',
  },
  heroTitle: {
    color: colors.text,
    fontSize: 33,
    fontWeight: '900',
    lineHeight: 38,
  },
  heroMeta: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: spacing.md,
  },
  heroCopy: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    marginTop: spacing.md,
  },
  heroActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  sortRow: {
    alignItems: 'flex-end',
  },
  searchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  searchFill: {
    flex: 1,
  },
  inlineEditButton: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.surfaceMuted,
  },
  bulkActions: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'flex-end',
    marginVertical: spacing.xl,
  },
  listColumn: {
    gap: spacing.lg,
    marginTop: spacing.xl,
  },
  emptySongsState: {
    alignItems: 'center',
    backgroundColor: colors.surfaceNeutral,
    borderRadius: radius.lg,
    gap: spacing.sm,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  emptySongsTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptySongsCopy: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    textAlign: 'center',
  },
  editableRow: {
    alignItems: 'center',
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 56,
    paddingVertical: spacing.sm,
  },
  editableRowActive: {
    opacity: 0.82,
  },
  songArtwork: {
    borderRadius: radius.sm,
    height: 44,
    width: 44,
  },
  songCopyColumn: {
    flex: 1,
  },
  songTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  songSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
});
