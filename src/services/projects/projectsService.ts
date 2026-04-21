import { apiClient, withAuthToken } from '../../api/client';
import { projectEndpoints } from '../../api/endpoints/projects';
import type { ApiListResponse, ApiPickup, ApiProject, ApiSong } from '../../types/api';

interface PaginationOptions {
  limit?: number;
  offset?: number;
}

export async function getFeaturedProjects(
  authToken: string,
): Promise<ApiListResponse<ApiProject>> {
  const response = await apiClient.get<ApiListResponse<ApiProject>>(
    projectEndpoints.featured,
    withAuthToken(authToken),
  );

  return response.data;
}

export async function getYourThematics(
  authToken: string,
  options: PaginationOptions = {},
): Promise<ApiListResponse<ApiProject>> {
  const response = await apiClient.get<ApiListResponse<ApiProject>>(
    projectEndpoints.yourThematics,
    {
      ...withAuthToken(authToken),
      params: options,
    },
  );

  return response.data;
}

export async function getProjects(
  authToken: string,
  options: PaginationOptions = {},
): Promise<ApiListResponse<ApiProject>> {
  const response = await apiClient.get<ApiListResponse<ApiProject>>(
    projectEndpoints.list,
    {
      ...withAuthToken(authToken),
      params: options,
    },
  );

  return response.data;
}

export async function getProjectDetails(
  authToken: string,
  projectId: number,
): Promise<ApiProject> {
  const response = await apiClient.get<ApiProject>(
    projectEndpoints.details(projectId),
    withAuthToken(authToken),
  );

  return response.data;
}

export async function getProjectSongs(
  authToken: string,
  projectId: number,
  options: PaginationOptions = {},
): Promise<ApiListResponse<ApiSong>> {
  const response = await apiClient.get<ApiListResponse<ApiSong>>(
    projectEndpoints.songs(projectId),
    {
      ...withAuthToken(authToken),
      params: options,
    },
  );

  return response.data;
}

export async function getProjectPickups(
  authToken: string,
  projectId: number,
): Promise<ApiPickup[]> {
  const response = await apiClient.get<ApiPickup[]>(
    projectEndpoints.pickups(projectId),
    withAuthToken(authToken),
  );

  return response.data;
}

export async function getMoreToExplore(
  authToken: string,
  projectId: number,
): Promise<ApiListResponse<ApiProject>> {
  const response = await apiClient.get<ApiListResponse<ApiProject>>(
    projectEndpoints.moreToExplore(projectId),
    withAuthToken(authToken),
  );

  return response.data;
}

export async function getYouMightAlsoLike(
  authToken: string,
  projectId: number,
): Promise<{ message?: string } | ApiListResponse<ApiProject>> {
  const response = await apiClient.get<{ message?: string } | ApiListResponse<ApiProject>>(
    projectEndpoints.youMightAlsoLike(projectId),
    withAuthToken(authToken),
  );

  return response.data;
}
