import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import { APP_CONFIG } from '../config/appConfig';
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
    title: 'Moe WB',
    subtitle: '83.3K Subscribers • 2K Videos',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'thematic-team',
    teamId: 'team-thematic',
    title: 'Thematic Team',
    subtitle: 'Support account • Product updates',
    avatarUrl:
      'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=200&q=80',
  },
];

const defaultNotifications: AppNotification[] = [
  {
    id: 'badge-1',
    title: 'You achieved a new badge!',
    subtitle: '8 minutes ago',
    category: 'milestone',
    accent: '#E46DAD',
  },
  {
    id: 'badge-2',
    title: 'You achieved a new badge!',
    subtitle: '18 minutes ago',
    category: 'unread',
    accent: '#7E49D4',
  },
];

const seedSongs: PlaylistDraftSong[] = [
  {
    id: 'local-song-1',
    title: 'Stay',
    artistName: 'Singto Conley',
    artworkUrl:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'local-song-2',
    title: 'Lonely Heroes',
    artistName: 'Nico Anuch',
    artworkUrl:
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'local-song-3',
    title: 'Silver Lining',
    artistName: 'Taylor Belle',
    artworkUrl:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=300&q=80',
  },
];

const defaultPlaylists: PlaylistDraft[] = [
  {
    id: 'draft-taylor',
    name: 'Taylor Swift',
    description: 'A polished shortlist for cinematic, bright pop storytelling.',
    isPrivate: true,
    updatedAt: new Date().toISOString(),
    artworkUrls: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=400&q=80',
    ],
    songs: seedSongs,
  },
  {
    id: 'draft-focus',
    name: 'Late Night Focus',
    description: 'Warm textures, slow builds, and tracks for thoughtful scenes.',
    isPrivate: false,
    updatedAt: new Date().toISOString(),
    artworkUrls: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=400&q=80',
    ],
    songs: seedSongs.slice(0, 2),
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
  const [playlistDrafts, setPlaylistDrafts] = useState<PlaylistDraft[]>(
    defaultPlaylists,
  );

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

      const nextChannel =
        activeChannelId &&
        defaultChannels.find(channel => channel.id === activeChannelId);

      setSession({
        authToken: authToken ?? APP_CONFIG.authToken,
        activeTeamId: activeTeamId ?? nextChannel?.teamId ?? defaultChannels[0].teamId,
        activeChannelId: nextChannel?.id ?? defaultChannels[0].id,
      });
      setPlaylistDrafts(storedPlaylists?.length ? storedPlaylists : defaultPlaylists);
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

    void Promise.all([
      writeString(storageKeys.authToken, session.authToken),
      writeString(storageKeys.activeChannelId, session.activeChannelId),
      writeString(storageKeys.activeTeamId, session.activeTeamId ?? ''),
    ]);
  }, [hydrated, session]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    void writeJson(storageKeys.playlistDrafts, playlistDrafts);
  }, [hydrated, playlistDrafts]);

  const selectedChannel = resolveSelectedChannel(session.activeChannelId, channels);

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

  function createPlaylist(name = 'Untitled Playlist'): string {
    const nextPlaylistId = `playlist-${Date.now()}`;
    const newPlaylist: PlaylistDraft = {
      id: nextPlaylistId,
      name,
      description: 'Add your playlist description here.',
      isPrivate: true,
      updatedAt: new Date().toISOString(),
      artworkUrls: defaultPlaylists[0].artworkUrls,
      songs: seedSongs,
    };

    setPlaylistDrafts(currentPlaylists => [newPlaylist, ...currentPlaylists]);
    return nextPlaylistId;
  }

  function updatePlaylistText(
    playlistId: string,
    updates: Partial<Pick<PlaylistDraft, 'name' | 'description' | 'isPrivate'>>,
  ) {
    setPlaylistDrafts(currentPlaylists =>
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
    setPlaylistDrafts(currentPlaylists =>
      currentPlaylists.map(playlist =>
        playlist.id === playlistId
          ? {
              ...playlist,
              songs: playlist.songs.filter(song => !songIds.includes(song.id)),
              updatedAt: new Date().toISOString(),
            }
          : playlist,
      ),
    );
  }

  function reorderPlaylistSongs(playlistId: string, songs: PlaylistDraftSong[]) {
    setPlaylistDrafts(currentPlaylists =>
      currentPlaylists.map(playlist =>
        playlist.id === playlistId
          ? {
              ...playlist,
              songs,
              updatedAt: new Date().toISOString(),
            }
          : playlist,
      ),
    );
  }

  function addSongToPlaylist(playlistId: string, song: PlaylistDraftSong) {
    setPlaylistDrafts(currentPlaylists =>
      currentPlaylists.map(playlist =>
        playlist.id === playlistId
          ? {
              ...playlist,
              songs: playlist.songs.some(item => item.id === song.id)
                ? playlist.songs
                : [song, ...playlist.songs],
              updatedAt: new Date().toISOString(),
            }
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
    throw new Error('useAppStore must be used inside AppStoreProvider.');
  }

  return context;
}
