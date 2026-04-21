import { photoPlaceholders, videoPlaceholders } from '../constants/mockMedia';
import type { SearchMediaCard, SearchResultsBundle } from '../types/app';
import type { ApiProject, ApiSong, ApiUser } from '../types/api';

function normalize(value: string | null | undefined): string {
  return (value ?? '').trim().toLowerCase();
}

function includesQuery(value: string | null | undefined, query: string): boolean {
  return normalize(value).includes(query);
}

function uniqueCreators(users: ApiUser[]) {
  const seenUserIds = new Set<number>();

  return users.filter(user => {
    if (seenUserIds.has(user.id)) {
      return false;
    }

    seenUserIds.add(user.id);
    return true;
  });
}

function buildMediaCards(
  placeholders: readonly SearchMediaCard[],
  query: string,
): SearchMediaCard[] {
  if (!query) {
    return [...placeholders];
  }

  return placeholders.filter(
    item =>
      includesQuery(item.title, query) || includesQuery(item.subtitle, query),
  );
}

export function buildSearchResults(
  queryValue: string,
  projects: ApiProject[],
  songs: ApiSong[],
): SearchResultsBundle {
  const query = normalize(queryValue);
  const filteredSongs = songs.filter(song => {
    if (!query) {
      return true;
    }

    return (
      includesQuery(song.name, query) ||
      includesQuery(song.artist_name, query) ||
      includesQuery(song.album_name, query)
    );
  });

  const artistRepresentatives: ApiSong[] = [];
  const seenArtistIds = new Set<number>();
  filteredSongs.forEach(song => {
    if (!seenArtistIds.has(song.artist_id)) {
      seenArtistIds.add(song.artist_id);
      artistRepresentatives.push(song);
    }
  });

  const filteredProjects = projects.filter(project => {
    if (!query) {
      return true;
    }

    return (
      includesQuery(project.name, query) ||
      includesQuery(project.description, query) ||
      project.themes.some(theme => includesQuery(theme.name, query))
    );
  });

  const creators = uniqueCreators([
    ...filteredProjects.map(project => project.user),
    ...filteredSongs.flatMap(song => song.creators),
  ]).filter(user => !query || includesQuery(user.profile_name, query));

  return {
    artists: artistRepresentatives.slice(0, 6),
    songs: filteredSongs.slice(0, 8),
    playlists: filteredProjects.slice(0, 6).map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      imageUrl: project.thumbnail_art_file_url,
      songCount: project.project_songs_count,
      ownerName: project.user.profile_name ?? 'Thematic',
    })),
    creators: creators.slice(0, 6).map(user => ({
      id: user.id,
      name: user.profile_name ?? 'Creator',
      imageUrl: user.profile_image_url,
    })),
    videos: buildMediaCards(videoPlaceholders, query),
    photos: buildMediaCards(photoPlaceholders, query),
  };
}
