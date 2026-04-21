export const projectEndpoints = {
  featured: '/v2/projects/featured',
  yourThematics: '/v2/projects/your_thematics',
  list: '/v2/projects',
  details: (projectId: number) => `/v2/projects/${projectId}`,
  songs: (projectId: number) => `/v2/projects/${projectId}/songs`,
  pickups: (projectId: number) => `/v2/projects/${projectId}/pickups`,
  moreToExplore: (projectId: number) => `/v2/projects/${projectId}/more_to_explore`,
  youMightAlsoLike: (projectId: number) =>
    `/v2/projects/${projectId}/you_might_also_like`,
} as const;
