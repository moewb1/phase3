import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SelectPlaylistSheet } from '../components/bottomSheets/SelectPlaylistSheet';
import { SongActionsSheet } from '../components/bottomSheets/SongActionsSheet';
import { AppScaffold } from '../components/common/AppScaffold';
import { Loader } from '../components/common/Loader';
import { ScreenScrollView } from '../components/common/ScreenScrollView';
import { SectionCard } from '../components/common/SectionCard';
import { SongListItem } from '../components/common/SongListItem';
import { HomeAestheticHeroTile } from '../components/home/HomeAestheticHeroTile';
import { HomeArtworkCollage } from '../components/home/HomeArtworkCollage';
import { HomeJumpBackItem } from '../components/home/HomeJumpBackItem';
import { HomePlaylistPreviewCard } from '../components/home/HomePlaylistPreviewCard';
import { APP_CONFIG } from '../config/appConfig';
import { strings } from '../localization/strings';
import {
  getFeaturedProjects,
  getMoreToExplore,
  getProjectSongs,
  getYourThematics,
} from '../services/projects/projectsService';
import { useAppStore } from '../store/AppStore';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import type { ApiProject, ApiSong } from '../types/api';
import type { RootStackParamList } from '../types/navigation';
import {
  buildProjectArtworkSet,
  formatHomePlaylistMeta,
  getProjectArtworkUrl,
  mergeUniqueProjects,
} from '../utils/home';
import { mapApiSongToDraftSong } from '../utils/mappers';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

interface HomeState {
  loading: boolean;
  error: string | null;
  heroProject: ApiProject | null;
  weeklySongs: ApiSong[];
  curatedPlaylists: ApiProject[];
  aestheticProjects: ApiProject[];
  jumpBackProjects: ApiProject[];
}

interface WeeklyMatchesSectionProps {
  songs: ApiSong[];
  totalSongsCount: number;
  showAllSongs: boolean;
  onOpenSongActions: (song: ApiSong) => void;
  onToggleShowAll: () => void;
}

interface CuratedPlaylistsSectionProps {
  channelTitle: string;
  projects: ApiProject[];
  onOpenProject: (projectId: number) => void;
}

interface AestheticSectionProps {
  featureProject: ApiProject | null;
  label: string;
  leadProject: ApiProject | null;
  sharedProjectPool: ApiProject[];
  onOpenProject: (projectId: number) => void;
}

interface JumpBackSectionProps {
  projects: ApiProject[];
  sharedProjectPool: ApiProject[];
  onOpenProject: (projectId: number) => void;
}

interface WeeklySongRowProps {
  song: ApiSong;
  onOpenSongActions: (song: ApiSong) => void;
}

interface CuratedPlaylistCardProps {
  project: ApiProject;
  onOpenProject: (projectId: number) => void;
}

interface AestheticFeatureCardProps {
  featureProject: ApiProject;
  sharedProjectPool: ApiProject[];
  onOpenProject: (projectId: number) => void;
}

interface JumpBackProjectItemProps {
  project: ApiProject;
  sharedProjectPool: ApiProject[];
  onOpenProject: (projectId: number) => void;
}

const WEEKLY_PREVIEW_COUNT = 3;
const DEFAULT_AESTHETIC_LABEL = strings.home.aesthetic.defaultLabel;
const HOME_PROJECT_FETCH_LIMIT = 12;
const HOME_PLAYLIST_COUNT = 6;
const HOME_AESTHETIC_COUNT = 2;
const HOME_JUMP_BACK_COUNT = 4;

export function HomeScreen({ navigation }: HomeScreenProps): React.JSX.Element {
  const { session, selectedChannel, playlistDrafts, addSongToPlaylist, createPlaylist } =
    useAppStore();
  const [selectedSong, setSelectedSong] = useState<ApiSong | null>(null);
  const [showAllWeeklySongs, setShowAllWeeklySongs] = useState(false);
  const [state, setState] = useState<HomeState>({
    loading: true,
    error: null,
    heroProject: null,
    weeklySongs: [],
    curatedPlaylists: [],
    aestheticProjects: [],
    jumpBackProjects: [],
  });
  const songSheetRef = useRef<BottomSheetModal>(null);
  const playlistSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    let mounted = true;

    async function loadHome() {
      try {
        const [yourThematics, featuredProjects] = await Promise.all([
          getYourThematics(session.authToken, { limit: HOME_PROJECT_FETCH_LIMIT }),
          getFeaturedProjects(session.authToken),
        ]);

        const preferredProjects = mergeUniqueProjects(
          yourThematics.items,
          featuredProjects.items,
        );
        const heroProject = preferredProjects[0] ?? null;

        const [songsResponse, extraResponse] = heroProject
          ? await Promise.all([
              getProjectSongs(session.authToken, heroProject.id, {
                limit: APP_CONFIG.requestPageSize,
              }),
              getMoreToExplore(session.authToken, heroProject.id),
            ])
          : [{ items: [] }, { items: [] }];

        const homeProjects = mergeUniqueProjects(preferredProjects, extraResponse.items);

        if (!mounted) {
          return;
        }

        setState({
          loading: false,
          error: null,
          heroProject,
          weeklySongs: songsResponse.items,
          curatedPlaylists: homeProjects.slice(0, HOME_PLAYLIST_COUNT),
          aestheticProjects: homeProjects.slice(
            HOME_PLAYLIST_COUNT,
            HOME_PLAYLIST_COUNT + HOME_AESTHETIC_COUNT,
          ),
          jumpBackProjects: homeProjects.slice(
            HOME_PLAYLIST_COUNT + HOME_AESTHETIC_COUNT,
            HOME_PLAYLIST_COUNT + HOME_AESTHETIC_COUNT + HOME_JUMP_BACK_COUNT,
          ),
        });
      } catch (error) {
        if (!mounted) {
          return;
        }

        setState(currentState => ({
          ...currentState,
          loading: false,
          error: error instanceof Error ? error.message : strings.home.error,
        }));
      }
    }

    loadHome();

    return () => {
      mounted = false;
    };
  }, [session.authToken]);

  function handleOpenSongActions(song: ApiSong) {
    setSelectedSong(song);
    songSheetRef.current?.present();
  }

  function handleToggleWeeklySongs() {
    setShowAllWeeklySongs(currentValue => !currentValue);
  }

  function handleOpenProject(projectId: number) {
    navigation.navigate('PlaylistDetails', { projectId });
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

  const visibleWeeklySongs = state.weeklySongs.slice(
    0,
    showAllWeeklySongs ? state.weeklySongs.length : WEEKLY_PREVIEW_COUNT,
  );
  const aestheticLeadProject =
    state.aestheticProjects[0] ?? state.curatedPlaylists[0] ?? null;
  const aestheticFeatureProject =
    state.aestheticProjects[1] ??
    state.jumpBackProjects[0] ??
    state.curatedPlaylists[1] ??
    null;
  const aestheticLabel = aestheticLeadProject?.themes[0]?.name ?? DEFAULT_AESTHETIC_LABEL;
  const sharedProjectPool = mergeUniqueProjects(
    state.curatedPlaylists,
    state.aestheticProjects,
    state.jumpBackProjects,
  );

  return (
    <AppScaffold navigation={navigation} showFloatingChat>
      <ScreenScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{strings.home.madeFor(selectedChannel.title)}</Text>
        {state.loading ? <Loader /> : null}
        {state.error ? <Text style={styles.error}>{state.error}</Text> : null}
        {!state.loading && state.heroProject ? (
          <>
            <WeeklyMatchesSection
              showAllSongs={showAllWeeklySongs}
              songs={visibleWeeklySongs}
              totalSongsCount={state.weeklySongs.length}
              onOpenSongActions={handleOpenSongActions}
              onToggleShowAll={handleToggleWeeklySongs}
            />
            {state.curatedPlaylists.length > 0 ? (
              <CuratedPlaylistsSection
                channelTitle={selectedChannel.title}
                projects={state.curatedPlaylists}
                onOpenProject={handleOpenProject}
              />
            ) : null}
            {aestheticLeadProject || aestheticFeatureProject ? (
              <AestheticSection
                featureProject={aestheticFeatureProject}
                label={aestheticLabel}
                leadProject={aestheticLeadProject}
                sharedProjectPool={sharedProjectPool}
                onOpenProject={handleOpenProject}
              />
            ) : null}
            {state.jumpBackProjects.length > 0 ? (
              <JumpBackSection
                projects={state.jumpBackProjects}
                sharedProjectPool={sharedProjectPool}
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

function WeeklyMatchesSection({
  songs,
  totalSongsCount,
  showAllSongs,
  onOpenSongActions,
  onToggleShowAll,
}: WeeklyMatchesSectionProps): React.JSX.Element {
  return (
    <SectionCard title={strings.home.weeklyMatches.title}>
      <Text style={styles.cardLead}>{strings.home.weeklyMatches.description}</Text>
      <View style={styles.songList}>
        {songs.map(song => (
          <WeeklySongRow
            key={song.id}
            song={song}
            onOpenSongActions={onOpenSongActions}
          />
        ))}
      </View>
      {totalSongsCount > WEEKLY_PREVIEW_COUNT ? (
        <Text style={styles.showMore} onPress={onToggleShowAll}>
          {showAllSongs
            ? strings.common.actions.showLess
            : strings.common.actions.showMore}
        </Text>
      ) : null}
    </SectionCard>
  );
}

function CuratedPlaylistsSection({
  channelTitle,
  projects,
  onOpenProject,
}: CuratedPlaylistsSectionProps): React.JSX.Element {
  return (
    <SectionCard title={strings.home.playlistsFor(channelTitle)}>
      <Text style={styles.cardLead}>{strings.home.curatedDescription}</Text>
      <ScrollView
        horizontal
        contentContainerStyle={styles.playlistRail}
        showsHorizontalScrollIndicator={false}>
        {projects.map(project => (
          <CuratedPlaylistCard
            key={project.id}
            project={project}
            onOpenProject={onOpenProject}
          />
        ))}
      </ScrollView>
    </SectionCard>
  );
}

function AestheticSection({
  featureProject,
  label,
  leadProject,
  sharedProjectPool,
  onOpenProject,
}: AestheticSectionProps): React.JSX.Element {
  function handleOpenLeadProject() {
    if (!leadProject) {
      return;
    }

    onOpenProject(leadProject.id);
  }

  return (
    <SectionCard title={strings.home.aesthetic.title}>
      <Text style={styles.cardLead}>{strings.home.aesthetic.description}</Text>
      <View style={styles.aestheticRow}>
        <HomeAestheticHeroTile title={label} onPress={handleOpenLeadProject} />
        {featureProject ? (
          <AestheticFeatureCard
            featureProject={featureProject}
            sharedProjectPool={sharedProjectPool}
            onOpenProject={onOpenProject}
          />
        ) : null}
      </View>
    </SectionCard>
  );
}

function JumpBackSection({
  projects,
  sharedProjectPool,
  onOpenProject,
}: JumpBackSectionProps): React.JSX.Element {
  return (
    <SectionCard title={strings.home.jumpBack.title}>
      <Text style={styles.cardLead}>{strings.home.jumpBack.description}</Text>
      <View style={styles.jumpBackList}>
        {projects.map(project => (
          <JumpBackProjectItem
            key={project.id}
            project={project}
            sharedProjectPool={sharedProjectPool}
            onOpenProject={onOpenProject}
          />
        ))}
      </View>
    </SectionCard>
  );
}

function WeeklySongRow({
  song,
  onOpenSongActions,
}: WeeklySongRowProps): React.JSX.Element {
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

function CuratedPlaylistCard({
  project,
  onOpenProject,
}: CuratedPlaylistCardProps): React.JSX.Element {
  function handleOpenProject() {
    onOpenProject(project.id);
  }

  return (
    <HomePlaylistPreviewCard
      imageUrl={getProjectArtworkUrl(project)}
      subtitle={formatHomePlaylistMeta(project)}
      title={project.name}
      onPress={handleOpenProject}
    />
  );
}

function AestheticFeatureCard({
  featureProject,
  sharedProjectPool,
  onOpenProject,
}: AestheticFeatureCardProps): React.JSX.Element {
  function handleOpenProject() {
    onOpenProject(featureProject.id);
  }

  return (
    <Pressable style={styles.aestheticFeature} onPress={handleOpenProject}>
      <HomeArtworkCollage
        artworkUrls={buildProjectArtworkSet([
          featureProject,
          ...sharedProjectPool.filter(project => project.id !== featureProject.id),
        ])}
      />
      <Text numberOfLines={2} style={styles.aestheticFeatureTitle}>
        {featureProject.name}
      </Text>
      <Text numberOfLines={2} style={styles.aestheticFeatureSubtitle}>
        {formatHomePlaylistMeta(featureProject)}
      </Text>
    </Pressable>
  );
}

function JumpBackProjectItem({
  project,
  sharedProjectPool,
  onOpenProject,
}: JumpBackProjectItemProps): React.JSX.Element {
  function handleOpenProject() {
    onOpenProject(project.id);
  }

  return (
    <HomeJumpBackItem
      artworkUrls={buildProjectArtworkSet([
        project,
        ...sharedProjectPool.filter(candidate => candidate.id !== project.id),
      ])}
      subtitle={formatHomePlaylistMeta(project)}
      title={project.name}
      onPress={handleOpenProject}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    padding: spacing.xl,
    paddingBottom: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 36,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  cardLead: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 28,
    marginBottom: spacing.lg,
  },
  songList: {
    gap: spacing.md,
  },
  showMore: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: spacing.xl,
  },
  playlistRail: {
    gap: spacing.md,
  },
  aestheticRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
  },
  aestheticFeature: {
    flex: 1,
    minWidth: 0,
  },
  aestheticFeatureTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    marginTop: spacing.sm,
  },
  aestheticFeatureSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    marginTop: spacing.xs,
  },
  jumpBackList: {
    gap: spacing.lg,
  },
});
