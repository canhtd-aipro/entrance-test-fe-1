import axios, { AxiosError, CreateAxiosDefaults } from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import Cookies from 'js-cookie';
import { decodeToken } from 'react-jwt';
import { apiNotify } from '../components/notify-provider/api-notify/apiNotify';

declare module 'axios' {
  interface AxiosRequestConfig {
    silent?: boolean;
  }
}

export const createApiInstance = (config: CreateAxiosDefaults) => {
  const api = axios.create(config);

  setupCache(api, {
    location: 'client',
    // storage: buildWebStorage(sessionStorage, 'axios-cache:'),
    ttl: 1_000,
  });

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<any, any>) => {
      const notify = async () => {
        const data = error.response?.data;

        if (!error.config?.silent) {
          let code = data.code;
          if (!code && data instanceof Blob) {
            try {
              code ??= JSON.parse(await data.text()).code;
            } catch {}
          }
          apiNotify.error(code);
        }
      };
      notify();

      console.error(error);

      return Promise.reject(error);
    },
  );

  return api;
};

export const api = createApiInstance({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const removeAccessToken = () => {
  Cookies.remove('token');
};

export const isValidToken = () => {
  const token = Cookies.get('token');
  if (!token) {
    return false;
  }
  const exp = decodeToken<{ exp: number }>(token)?.exp ?? 0;
  const remaining = exp * 1000 - Date.now();
  if (remaining > 43_200_000) {
    setTimeout(window.location.reload, remaining);
    return true;
  }
  return false;
};
