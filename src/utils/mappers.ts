import type { PlaylistDraftSong } from '../types/app';
import type { ApiSong } from '../types/api';

export function mapApiSongToDraftSong(song: ApiSong): PlaylistDraftSong {
  return {
    id: `api-song-${song.id}`,
    title: song.name,
    artistName: song.artist_name,
    artworkUrl: song.album_art_thumbnail_url ?? song.artist_image_url ?? '',
  };
}
