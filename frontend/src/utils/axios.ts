import { CONFIG } from '@/config-global';
import axios from 'axios';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';

// ----------------------------------------------------------------------

interface CustomSession extends Session {
  access_token?: string;
}

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.site.serverUrl });

const EXCLUDED_ROUTES = ['/auth/login', 'users/create'];

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        sessionStorage.clear();

        if (window.location.pathname !== '/unauthorized') {
          window.location.href = '/unauthorized';
        }
      }
    }

    return Promise.reject(
      error.response?.data || {
        message: 'Algo deu errado!',
        status: error.response?.status,
      },
    );
  },
);

axiosInstance.interceptors.request.use(async (config) => {
  if (typeof window === 'undefined') return config;

  const session = await getSession();

  const isExcluded = EXCLUDED_ROUTES.some((route) =>
    config.url?.includes(route),
  );

  if (!isExcluded && (session as CustomSession)?.access_token) {
    config.headers.Authorization = `Bearer ${
      (session as CustomSession)?.access_token
    }`;
  }

  return config;
});

export default axiosInstance;

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/auth/profile',
    signIn: '/auth/login',
    signUp: '/users/create',
  },
  documents: {
    create: '/documents/create',
    delete: (id: string) => `/documents/delete/${id}`,
    list: '/api/get-documents',
    getByOwner: (owner: string) => `/documents/owner/${owner}`,
    download: (id: string) => `/documents/download/${id}`,
  },
  signatures: {
    create: '/signatures/create',
    getByOwner: (owner: string) => `/signatures/user/${owner}`,
  },
  users: {
    getUsersByQuery: '/users',
  },
};
