export type AppNotificationAccent = 'pink' | 'purple';

export interface SessionState {
  authToken: string;
  activeTeamId: string | null;
  activeChannelId: string;
}

export interface ChannelAccount {
  id: string;
  teamId: string;
  title: string;
  subtitle: string;
  avatarUrl: string;
}

export interface AppNotification {
  id: string;
  title: string;
  subtitle: string;
  category: 'all' | 'unread' | 'milestone';
  accent: AppNotificationAccent;
}

export interface PlaylistDraftSong {
  id: string;
  title: string;
  artistName: string;
  artworkUrl: string;
}

export interface PlaylistDraft {
  id: string;
  ownerChannelId: string;
  name: string;
  description: string;
  isPrivate: boolean;
  updatedAt: string;
  artworkUrls: string[];
  songs: PlaylistDraftSong[];
}
