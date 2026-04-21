import axios, { type AxiosRequestConfig } from 'axios';
import { APP_CONFIG } from '../config/appConfig';

export const apiClient = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
  timeout: 15000,
});

export function withAuthToken(authToken: string): AxiosRequestConfig {
  return {
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: 'application/json',
    },
  };
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiMessage = error.response?.data?.message;
    if (typeof apiMessage === 'string') {
      return apiMessage;
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong while loading data.';
}
