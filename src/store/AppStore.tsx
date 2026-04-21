import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import { APP_CONFIG } from '../config/appConfig';
import { strings } from '../localization/strings';
import type {
  AppNotification,
  ChannelAccount,
  PlaylistDraft,
  PlaylistDraftSong,
  SessionState,
} from '../types/app';
import { readJson, readString, writeJson, writeString } from '../services/storage/sessionStorage';
import { storageKeys } from '../services/storage/storageKeys';

const defaultChannels: ChannelAccount[] = [
  {
    id: 'moewb',
    teamId: 'team-moe',
    title: strings.store.channels.moeWb.title,
    subtitle: strings.store.channels.moeWb.subtitle,
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'thematic-team',
    teamId: 'team-thematic',
    title: strings.store.channels.thematicTeam.title,
    subtitle: strings.store.channels.thematicTeam.subtitle,
    avatarUrl:
      'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=200&q=80',
  },
];

const defaultNotifications: AppNotification[] = [
  {
    id: 'badge-1',
    title: strings.store.notifications.achievedBadge,
    subtitle: strings.store.notifications.eightMinutesAgo,
    category: 'milestone',
    accent: 'pink',
  },
  {
    id: 'badge-2',
    title: strings.store.notifications.achievedBadge,
    subtitle: strings.store.notifications.eighteenMinutesAgo,
    category: 'unread',
    accent: 'purple',
  },
];

interface AppStoreValue {
  hydrated: boolean;
  session: SessionState;
  channels: ChannelAccount[];
  selectedChannel: ChannelAccount;
  notifications: AppNotification[];
  playlistDrafts: PlaylistDraft[];
  switchChannel: (channelId: string) => void;
  createPlaylist: (name?: string) => string;
  updatePlaylistText: (
    playlistId: string,
    updates: Partial<Pick<PlaylistDraft, 'name' | 'description' | 'isPrivate'>>,
  ) => void;
  deleteSongsFromPlaylist: (playlistId: string, songIds: string[]) => void;
  reorderPlaylistSongs: (playlistId: string, songs: PlaylistDraftSong[]) => void;
  addSongToPlaylist: (playlistId: string, song: PlaylistDraftSong) => void;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

function resolveSelectedChannel(
  activeChannelId: string,
  channels: ChannelAccount[],
): ChannelAccount {
  return channels.find(channel => channel.id === activeChannelId) ?? channels[0];
}

function buildArtworkUrls(songs: PlaylistDraftSong[]): string[] {
  return [...new Set(songs.map(song => song.artworkUrl).filter(Boolean))].slice(0, 4);
}

function sanitizeStoredPlaylists(
  playlists: PlaylistDraft[] | null,
  fallbackOwnerChannelId: string,
): PlaylistDraft[] {
  if (!playlists?.length) {
    return [];
  }

  return playlists.reduce<PlaylistDraft[]>((nextPlaylists, playlist) => {

    const songs = playlist.songs.filter(song => !song.id.startsWith('local-song-'));
    const hadLegacySongs = songs.length !== playlist.songs.length;

    if (hadLegacySongs && songs.length === 0) {
      return nextPlaylists;
    }

    nextPlaylists.push({
      ...playlist,
      ownerChannelId: playlist.ownerChannelId ?? fallbackOwnerChannelId,
      songs,
      artworkUrls: buildArtworkUrls(songs),
    });

    return nextPlaylists;
  }, []);
}

export function AppStoreProvider({
  children,
}: PropsWithChildren): React.JSX.Element {
  const [hydrated, setHydrated] = useState(false);
  const [channels] = useState(defaultChannels);
  const [notifications] = useState(defaultNotifications);
  const [session, setSession] = useState<SessionState>({
    authToken: APP_CONFIG.authToken,
    activeTeamId: defaultChannels[0].teamId,
    activeChannelId: defaultChannels[0].id,
  });
  const [allPlaylistDrafts, setAllPlaylistDrafts] = useState<PlaylistDraft[]>([]);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const [authToken, activeTeamId, activeChannelId, storedPlaylists] =
        await Promise.all([
          readString(storageKeys.authToken),
          readString(storageKeys.activeTeamId),
          readString(storageKeys.activeChannelId),
          readJson<PlaylistDraft[]>(storageKeys.playlistDrafts),
        ]);

      if (!mounted) {
        return;
      }

      const nextChannel = activeChannelId
        ? defaultChannels.find(channel => channel.id === activeChannelId)
        : undefined;
      const nextActiveChannelId = nextChannel?.id ?? defaultChannels[0].id;

      setSession({
        authToken: authToken ?? APP_CONFIG.authToken,
        activeTeamId: activeTeamId ?? nextChannel?.teamId ?? defaultChannels[0].teamId,
        activeChannelId: nextActiveChannelId,
      });
      setAllPlaylistDrafts(sanitizeStoredPlaylists(storedPlaylists, nextActiveChannelId));
      setHydrated(true);
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    Promise.all([
      writeString(storageKeys.authToken, session.authToken),
      writeString(storageKeys.activeChannelId, session.activeChannelId),
      writeString(storageKeys.activeTeamId, session.activeTeamId ?? ''),
    ]).catch(() => undefined);
  }, [hydrated, session]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    writeJson(storageKeys.playlistDrafts, allPlaylistDrafts).catch(() => undefined);
  }, [allPlaylistDrafts, hydrated]);

  const selectedChannel = resolveSelectedChannel(session.activeChannelId, channels);
  const playlistDrafts = allPlaylistDrafts.filter(
    playlist => playlist.ownerChannelId === selectedChannel.id,
  );

  function switchChannel(channelId: string) {
    const nextChannel = channels.find(channel => channel.id === channelId);
    if (!nextChannel) {
      return;
    }

    setSession(currentSession => ({
      ...currentSession,
      activeChannelId: nextChannel.id,
      activeTeamId: nextChannel.teamId,
    }));
  }

  function createPlaylist(name: string = strings.common.playlist.newName): string {
    const nextPlaylistId = `playlist-${Date.now()}`;
    const newPlaylist: PlaylistDraft = {
      id: nextPlaylistId,
      ownerChannelId: selectedChannel.id,
      name,
      description: strings.common.playlist.defaultDescription,
      isPrivate: true,
      updatedAt: new Date().toISOString(),
      artworkUrls: [],
      songs: [],
    };

    setAllPlaylistDrafts(currentPlaylists => [newPlaylist, ...currentPlaylists]);
    return nextPlaylistId;
  }

  function updatePlaylistText(
    playlistId: string,
    updates: Partial<Pick<PlaylistDraft, 'name' | 'description' | 'isPrivate'>>,
  ) {
    setAllPlaylistDrafts(currentPlaylists =>
      currentPlaylists.map(playlist =>
        playlist.id === playlistId
          ? {
              ...playlist,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : playlist,
      ),
    );
  }

  function deleteSongsFromPlaylist(playlistId: string, songIds: string[]) {
    setAllPlaylistDrafts(currentPlaylists =>
      currentPlaylists.map(playlist =>
        playlist.id === playlistId
          ? (() => {
              const songs = playlist.songs.filter(song => !songIds.includes(song.id));

              return {
                ...playlist,
                artworkUrls: buildArtworkUrls(songs),
                songs,
                updatedAt: new Date().toISOString(),
              };
            })()
          : playlist,
      ),
    );
  }

  function reorderPlaylistSongs(playlistId: string, songs: PlaylistDraftSong[]) {
    setAllPlaylistDrafts(currentPlaylists =>
      currentPlaylists.map(playlist =>
        playlist.id === playlistId
          ? {
              ...playlist,
              artworkUrls: buildArtworkUrls(songs),
              songs,
              updatedAt: new Date().toISOString(),
            }
          : playlist,
      ),
    );
  }

  function addSongToPlaylist(playlistId: string, song: PlaylistDraftSong) {
    setAllPlaylistDrafts(currentPlaylists =>
      currentPlaylists.map(playlist =>
        playlist.id === playlistId
          ? (() => {
              const songs = playlist.songs.some(item => item.id === song.id)
                ? playlist.songs
                : [song, ...playlist.songs];

              return {
                ...playlist,
                artworkUrls: buildArtworkUrls(songs),
                songs,
                updatedAt: new Date().toISOString(),
              };
            })()
          : playlist,
      ),
    );
  }

  return (
    <AppStoreContext.Provider
      value={{
        hydrated,
        session,
        channels,
        selectedChannel,
        notifications,
        playlistDrafts,
        switchChannel,
        createPlaylist,
        updatePlaylistText,
        deleteSongsFromPlaylist,
        reorderPlaylistSongs,
        addSongToPlaylist,
      }}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore(): AppStoreValue {
  const context = useContext(AppStoreContext);

  if (!context) {
    throw new Error(strings.store.errors.missingProvider);
  }

  return context;
}
