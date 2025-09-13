import axios from 'axios';
import {
  refreshAccessToken,
  getIsRefreshing,
  setIsRefreshing,
  addToFailedQueue,
  processQueue,
} from './refresh.utils';

const next_env = process.env.NEXT_PUBLIC_ENV;

if (!next_env) {
  throw new Error(
    '.env 파일에 NEXT_PUBLIC_ENV 환경변수가 설정되어 있지 않습니다.',
  );
}

export const popoApiUrl =
  next_env === 'prod'
    ? 'https://api.popo.poapper.club'
    : next_env === 'dev'
      ? 'https://api.popo-dev.poapper.club'
      : next_env === 'local'
        ? 'https://localhost:4000'
        : (() => {
            throw new Error(
              `NEXT_PUBLIC_ENV 환경변수가 제대로 설정되어 있지 않습니다. ${next_env}는 유효하지 않은 값입니다.`,
            );
          })();

export const PoPoAxios = axios.create({
  baseURL: popoApiUrl as string,
  withCredentials: true,
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
      if (getIsRefreshing()) {
        // 이미 refresh 중이면 큐에 추가
        return new Promise((resolve, reject) => {
          addToFailedQueue(resolve, reject, originalRequest);
        });
      }

      originalRequest._retry = true;
      setIsRefreshing(true);

      try {
        // refresh 토큰 재발급
        await refreshAccessToken();
        processQueue(null);
        return PoPoAxios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // refresh 실패 시 로그아웃 처리
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      } finally {
        setIsRefreshing(false);
      }
    }
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
