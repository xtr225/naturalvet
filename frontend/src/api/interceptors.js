import { apiClient } from "./axios";

export function configureApiInterceptors({ getToken, onUnauthorized } = {}) {
  apiClient.interceptors.request.use((config) => {
    const token = getToken?.();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        onUnauthorized?.();
      }

      return Promise.reject(error);
    }
  );
}
