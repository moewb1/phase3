export interface ApiListResponse<T> {
  items: T[];
  current_count: number;
  total: number;
  limit: number;
  offset: number;
  extra_data: Record<string, unknown>;
}

export interface ApiUser {
  id: number;
  user_type: string;
  profile_name: string | null;
  profile_image_url: string | null;
  followers_count: number;
  following_count: number;
  is_verified: boolean;
  country: string | null;
}

export interface ApiTag {
  id: number;
  name: string;
  image_url: string | null;
  thumbnail_image_url: string | null;
  system_type: string;
}

export interface ApiProject {
  id: number;
  name: string;
  description: string | null;
  public: boolean;
  featured: boolean;
  project_type: string;
  project_songs_count: number;
  art_file_url: string | null;
  thumbnail_art_file_url: string | null;
  updated_at: string;
  created_at: string;
  user: ApiUser;
  themes: ApiTag[];
  pickups: ApiPickup[];
  songs: ApiSong[];
  saved: boolean;
  can: {
    edit: boolean;
    delete: boolean;
  };
}

export interface ApiProjectSong {
  id: number;
  song_id: number;
  project_id: number;
  song_order: number;
  can: {
    edit: boolean;
    delete: boolean;
  };
}

export interface ApiSong {
  id: number;
  name: string;
  description: string;
  duration: string;
  duration_in_seconds: number;
  bpm: number;
  explicit: boolean;
  instrumental_only: boolean;
  access_tier: string;
  artist_id: number;
  artist_name: string;
  artist_image_url: string | null;
  album_art_url: string | null;
  album_art_thumbnail_url: string | null;
  album_name: string;
  downloadable: boolean;
  downloaded: boolean;
  song_type: string;
  lyrics: string;
  youtube_url: string;
  play_count: number;
  download_count: number;
  popularity: number;
  project_song?: ApiProjectSong;
  creators: ApiUser[];
}

export interface ApiPickup {
  id: number;
  artist_name?: string;
  song_name?: string;
  creator_name?: string;
  image_url?: string | null;
  [key: string]: unknown;
}
