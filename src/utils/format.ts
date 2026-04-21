import type { ApiProject, ApiSong } from '../types/api';

export function formatCompactCount(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  return String(value);
}

export function formatSongCount(count: number): string {
  return `${count} song${count === 1 ? '' : 's'}`;
}

export function formatCreatorSubtitle(project: ApiProject): string {
  const ownerName = project.user.profile_name ?? 'Thematic';
  return `Playlist by ${ownerName} • ${formatSongCount(project.project_songs_count)}`;
}

export function sortSongsByOption(
  songs: ApiSong[],
  sortBy: 'name' | 'date',
): ApiSong[] {
  return [...songs].sort((leftSong, rightSong) => {
    if (sortBy === 'name') {
      return leftSong.name.localeCompare(rightSong.name);
    }

    const leftOrder = leftSong.project_song?.song_order ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = rightSong.project_song?.song_order ?? Number.MAX_SAFE_INTEGER;
    return leftOrder - rightOrder;
  });
}

export function sortProjectsByOption(
  projects: ApiProject[],
  sortBy: 'name' | 'date',
): ApiProject[] {
  return [...projects].sort((leftProject, rightProject) => {
    if (sortBy === 'name') {
      return leftProject.name.localeCompare(rightProject.name);
    }

    return (
      new Date(rightProject.updated_at).getTime() -
      new Date(leftProject.updated_at).getTime()
    );
  });
}

export function truncateText(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}…`;
}
