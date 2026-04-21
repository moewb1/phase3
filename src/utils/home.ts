import type { ApiProject } from '../types/api';
import { formatSongCount } from './format';

export const HOME_FALLBACK_ARTWORK_URL =
  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=300&q=80';

export function mergeUniqueProjects(...collections: ApiProject[][]): ApiProject[] {
  const seenIds = new Set<number>();

  return collections.flat().filter(project => {
    if (seenIds.has(project.id)) {
      return false;
    }

    seenIds.add(project.id);
    return true;
  });
}

export function getProjectArtworkUrl(project?: ApiProject | null): string {
  return (
    project?.thumbnail_art_file_url ??
    project?.art_file_url ??
    HOME_FALLBACK_ARTWORK_URL
  );
}

export function buildProjectArtworkSet(
  projects: Array<ApiProject | null | undefined>,
): string[] {
  return projects
    .filter((project): project is ApiProject => project != null)
    .map(project => getProjectArtworkUrl(project))
    .slice(0, 4);
}

export function formatHomePlaylistMeta(project: ApiProject): string {
  const ownerName = project.user.profile_name ?? 'Thematic';
  return `Playlist by ${ownerName} - ${formatSongCount(project.project_songs_count)}`;
}
