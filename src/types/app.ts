import type { ApiSong } from './api';

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
  accent: string;
}

export interface PlaylistDraftSong {
  id: string;
  title: string;
  artistName: string;
  artworkUrl: string;
}

export interface PlaylistDraft {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  updatedAt: string;
  artworkUrls: string[];
  songs: PlaylistDraftSong[];
}

export interface SearchMediaCard {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}

export interface SearchResultsBundle {
  artists: ApiSong[];
  songs: ApiSong[];
  playlists: {
    id: number;
    name: string;
    description: string | null;
    imageUrl: string | null;
    songCount: number;
    ownerName: string;
  }[];
  creators: {
    id: number;
    name: string;
    imageUrl: string | null;
  }[];
  videos: SearchMediaCard[];
  photos: SearchMediaCard[];
}
