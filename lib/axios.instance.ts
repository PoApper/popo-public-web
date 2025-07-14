import axios from 'axios';
import {
  refreshAccessToken,
  getIsRefreshing,
  setIsRefreshing,
  addToFailedQueue,
  processQueue,
} from './refresh.utils';

const next_env = process.env.NEXT_PUBLIC_ENV;

export const popoApiUrl =
  next_env === 'prod'
    ? 'https://api.popo.poapper.club'
    : next_env === 'dev'
      ? 'https://api.popo-dev.poapper.club'
      : next_env === 'local'
        ? 'https://localhost:4000'
        : new Error('NEXT_PUBLIC_ENV is not set or invalid');

export const PoPoAxios = axios.create({
  baseURL: popoApiUrl as string,
});

// 엑세스 토큰 만료 시 refresh 후 재시도 로직
PoPoAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      // 백엔드에서 엑세스 토큰 만료 시 내려주는 에러 메시지
      error.response?.data?.error === 'AccessTokenExpired' &&
      !originalRequest._retry
    ) {
      console.debug('엑세스 토큰 만료 에러 받음');
      if (getIsRefreshing()) {
        console.debug('이미 refresh 중이면 큐에 추가');
        // 이미 refresh 중이면 큐에 추가
        return new Promise((resolve, reject) => {
          addToFailedQueue(resolve, reject, originalRequest);
        });
      }

      console.debug('refresh 중이 아니면 큐에 추가 안함');
      originalRequest._retry = true;
      setIsRefreshing(true);

      try {
        console.debug('refresh 토큰 재발급 시작');
        // refresh 토큰 재발급
        await refreshAccessToken();
        processQueue(null);
        console.debug('refresh 토큰 재발급 완료');
        return PoPoAxios(originalRequest);
      } catch (refreshError) {
        console.debug('refresh 토큰 재발급 실패');
        processQueue(refreshError);
        // refresh 실패 시 로그아웃 처리
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      } finally {
        console.debug('refresh 토큰 재발급 로직 finally');
        setIsRefreshing(false);
      }
    }
    console.debug('refresh 상황이 아닌 경우');
    // refresh 상황이 아닌 경우
    return Promise.reject(error);
  },
);

export const PopoCdnAxios = axios.create({
  baseURL: 'https://cdn.popo.poapper.club',
});

export const InPoStackAxios = axios.create({
  baseURL: 'https://api.inpostack.poapper.club',
});
