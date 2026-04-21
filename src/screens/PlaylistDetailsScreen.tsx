import React, { useEffect, useRef, useState } from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Share2 } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SelectPlaylistSheet } from '../components/bottomSheets/SelectPlaylistSheet';
import { SongActionsSheet } from '../components/bottomSheets/SongActionsSheet';
import { AppImage } from '../components/common/AppImage';
import { AppButton } from '../components/common/AppButton';
import { AppIconButton } from '../components/common/AppIconButton';
import { AppScaffold } from '../components/common/AppScaffold';
import { Loader } from '../components/common/Loader';
import { PlaylistCard } from '../components/common/PlaylistCard';
import { ScreenScrollView } from '../components/common/ScreenScrollView';
import { SearchBarCard } from '../components/common/SearchBarCard';
import { SectionCard } from '../components/common/SectionCard';
import { SongListItem } from '../components/common/SongListItem';
import { SortMenu } from '../components/common/SortMenu';
import { TagChip } from '../components/common/TagChip';
import { APP_CONFIG } from '../config/appConfig';
import { strings } from '../localization/strings';
import {
  getMoreToExplore,
  getProjectDetails,
  getProjectSongs,
} from '../services/projects/projectsService';
import { useAppStore } from '../store/AppStore';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import type { ApiProject, ApiSong } from '../types/api';
import type { RootStackParamList } from '../types/navigation';
import { formatCreatorSubtitle, sortSongsByOption } from '../utils/format';
import { mapApiSongToDraftSong } from '../utils/mappers';

type PlaylistDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PlaylistDetails'
>;

interface PlaylistSongsSectionProps {
  songs: ApiSong[];
  canLoadMore: boolean;
  onLoadMore: () => void;
  onOpenSongActions: (song: ApiSong) => void;
}

interface RelatedProjectsSectionProps {
  currentProject: ApiProject;
  projects: ApiProject[];
  onOpenProject: (projectId: number) => void;
}

interface PlaylistSongRowProps {
  song: ApiSong;
  onOpenSongActions: (song: ApiSong) => void;
}

interface RelatedProjectCardProps {
  currentProject: ApiProject;
  project: ApiProject;
  onOpenProject: (projectId: number) => void;
}

export function PlaylistDetailsScreen({
  navigation,
  route,
}: PlaylistDetailsScreenProps): React.JSX.Element {
  const { session, playlistDrafts, addSongToPlaylist, createPlaylist } = useAppStore();
  const [searchValue, setSearchValue] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('date');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<ApiProject | null>(null);
  const [songs, setSongs] = useState<ApiSong[]>([]);
  const [offset, setOffset] = useState(0);
  const [totalSongs, setTotalSongs] = useState(0);
  const [relatedProjects, setRelatedProjects] = useState<ApiProject[]>([]);
  const [selectedSong, setSelectedSong] = useState<ApiSong | null>(null);
  const [saved, setSaved] = useState(false);
  const songSheetRef = useRef<BottomSheetModal>(null);
  const playlistSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProject() {
      try {
        const [projectDetails, songsResponse, relatedResponse] = await Promise.all([
          getProjectDetails(session.authToken, route.params.projectId),
          getProjectSongs(session.authToken, route.params.projectId, {
            limit: APP_CONFIG.requestPageSize,
            offset: 0,
          }),
          getMoreToExplore(session.authToken, route.params.projectId),
        ]);

        if (!mounted) {
          return;
        }

        setProject(projectDetails);
        setSongs(songsResponse.items);
        setOffset(songsResponse.offset + songsResponse.current_count);
        setTotalSongs(songsResponse.total);
        setRelatedProjects(relatedResponse.items.slice(0, 2));
        setLoading(false);
      } catch (loadError) {
        if (!mounted) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : strings.playlistDetails.error);
        setLoading(false);
      }
    }

    loadProject();

    return () => {
      mounted = false;
    };
  }, [route.params.projectId, session.authToken]);

  async function handleLoadMoreSongs() {
    if (!project || songs.length >= totalSongs) {
      return;
    }

    const nextResponse = await getProjectSongs(session.authToken, project.id, {
      limit: APP_CONFIG.requestPageSize,
      offset,
    });
    setSongs(currentSongs => [...currentSongs, ...nextResponse.items]);
    setOffset(nextResponse.offset + nextResponse.current_count);
  }

  function handleOpenSongActions(song: ApiSong) {
    setSelectedSong(song);
    songSheetRef.current?.present();
  }

  function handleToggleSaved() {
    setSaved(currentSaved => !currentSaved);
  }

  function handleSharePlaylist() {
    if (!project) {
      return;
    }

    Share.share({
      message: strings.common.share.playlist(
        project.name,
        formatCreatorSubtitle(project),
      ),
    }).catch(() => undefined);
  }

  function handleOpenPlaylistPicker() {
    playlistSheetRef.current?.present();
  }

  function handleSelectPlaylist(playlistId: string) {
    if (!selectedSong) {
      return;
    }

    songSheetRef.current?.dismiss();
    addSongToPlaylist(playlistId, mapApiSongToDraftSong(selectedSong));
    navigation.navigate('MyPlaylistDetails', { playlistId });
  }

  function handleCreatePlaylistForSelectedSong() {
    if (!selectedSong) {
      return;
    }

    const playlistId = createPlaylist(strings.common.playlist.newName);
    handleSelectPlaylist(playlistId);
  }

  function handleOpenProject(projectId: number) {
    navigation.push('PlaylistDetails', { projectId });
  }

  function handleLoadMoreSongsPress() {
    handleLoadMoreSongs().catch(() => undefined);
  }

  const visibleSongs = sortSongsByOption(
    songs.filter(song => {
      if (!searchValue.trim()) {
        return true;
      }

      const query = searchValue.toLowerCase();
      return (
        song.name.toLowerCase().includes(query) ||
        song.artist_name.toLowerCase().includes(query)
      );
    }),
    sortBy,
  );

  return (
    <AppScaffold navigation={navigation}>
      <ScreenScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {loading ? <Loader /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {!loading && project ? (
          <>
            <View style={styles.heroCard}>
              <AppImage
                source={{ uri: project.art_file_url ?? project.thumbnail_art_file_url ?? '' }}
                style={styles.heroArtwork}
              />
              <Text style={styles.heroEyebrow}>{strings.playlistDetails.eyebrow}</Text>
              <Text style={styles.heroTitle}>
                {route.params.titleOverride ?? project.name}
              </Text>
              <Text style={styles.heroMeta}>
                {strings.playlistDetails.heroMeta(
                  project.user.profile_name ?? strings.playlistDetails.defaultOwner,
                  project.project_songs_count,
                )}
              </Text>
              <Text style={styles.heroCopy}>
                {project.description ?? strings.playlistDetails.defaultDescription}
              </Text>
              <View style={styles.tagRow}>
                {project.themes.slice(0, 3).map(theme => (
                  <TagChip key={theme.id} label={theme.name} />
                ))}
              </View>
              <View style={styles.heroActions}>
                <AppButton
                  label={
                    saved
                      ? strings.playlistDetails.saved
                      : strings.playlistDetails.savePlaylist
                  }
                  onPress={handleToggleSaved}
                />
                <AppIconButton onPress={handleSharePlaylist}>
                  <Share2 color={colors.white} size={18} strokeWidth={2.3} />
                </AppIconButton>
              </View>
            </View>
            <View style={styles.sortRow}>
              <SortMenu value={sortBy} onChange={setSortBy} />
            </View>
            <SectionCard>
              <SearchBarCard
                placeholder={strings.common.actions.search}
                value={searchValue}
                onChangeText={setSearchValue}
              />
              <PlaylistSongsSection
                canLoadMore={songs.length < totalSongs}
                songs={visibleSongs}
                onLoadMore={handleLoadMoreSongsPress}
                onOpenSongActions={handleOpenSongActions}
              />
            </SectionCard>
            {relatedProjects.length > 0 ? (
              <RelatedProjectsSection
                currentProject={project}
                projects={relatedProjects}
                onOpenProject={handleOpenProject}
              />
            ) : null}
          </>
        ) : null}
      </ScreenScrollView>
      <SongActionsSheet
        artworkUrl={selectedSong?.album_art_thumbnail_url}
        sheetRef={songSheetRef}
        subtitle={selectedSong?.artist_name}
        title={selectedSong?.name}
        onAddToPlaylist={handleOpenPlaylistPicker}
      />
      <SelectPlaylistSheet
        playlists={playlistDrafts}
        sheetRef={playlistSheetRef}
        onCreatePlaylist={handleCreatePlaylistForSelectedSong}
        onSelectPlaylist={handleSelectPlaylist}
      />
    </AppScaffold>
  );
}

function PlaylistSongsSection({
  songs,
  canLoadMore,
  onLoadMore,
  onOpenSongActions,
}: PlaylistSongsSectionProps): React.JSX.Element {
  return (
    <>
      <View style={styles.songList}>
        {songs.map(song => (
          <PlaylistSongRow
            key={`${song.id}-${song.project_song?.song_order ?? 0}`}
            song={song}
            onOpenSongActions={onOpenSongActions}
          />
        ))}
      </View>
      {canLoadMore ? (
        <Text style={styles.showMore} onPress={onLoadMore}>
          {strings.common.actions.seeMore}
        </Text>
      ) : null}
    </>
  );
}

function RelatedProjectsSection({
  currentProject,
  projects,
  onOpenProject,
}: RelatedProjectsSectionProps): React.JSX.Element {
  return (
    <SectionCard title={strings.playlistDetails.moreToExplore}>
      <View style={styles.relatedColumn}>
        {projects.map(relatedProject => (
          <RelatedProjectCard
            key={relatedProject.id}
            currentProject={currentProject}
            project={relatedProject}
            onOpenProject={onOpenProject}
          />
        ))}
      </View>
    </SectionCard>
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
      artworkUrl={song.album_art_thumbnail_url}
      subtitle={song.artist_name}
      title={song.name}
      onMorePress={handleOpenSongActions}
    />
  );
}

function RelatedProjectCard({
  currentProject,
  project,
  onOpenProject,
}: RelatedProjectCardProps): React.JSX.Element {
  function handleOpenProject() {
    onOpenProject(project.id);
  }

  return (
    <PlaylistCard
      artworkUrls={[
        project.thumbnail_art_file_url ?? '',
        currentProject.thumbnail_art_file_url ?? '',
        currentProject.art_file_url ?? '',
        project.art_file_url ?? '',
      ]}
      subtitle={formatCreatorSubtitle(project)}
      title={project.name}
      onPress={handleOpenProject}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xl,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  heroCard: {
    backgroundColor: colors.accent,
    borderRadius: radius.xl,
    overflow: 'hidden',
    padding: spacing.xxl,
  },
  heroArtwork: {
    alignSelf: 'center',
    borderRadius: radius.lg,
    height: 230,
    marginBottom: spacing.xl,
    width: '100%',
  },
  heroEyebrow: {
    color: colors.goldMuted,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 36,
    fontWeight: '900',
    lineHeight: 40,
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
    marginTop: spacing.lg,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  heroActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  sortRow: {
    alignItems: 'flex-end',
  },
  songList: {
    gap: spacing.lg,
    marginTop: spacing.xl,
  },
  showMore: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: spacing.xl,
  },
  relatedColumn: {
    gap: spacing.lg,
  },
});
