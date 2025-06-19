import axios from 'axios';

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

// 엑세스 토큰 만료 시 리프레시 후 재시도 로직
PoPoAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      // 백엔드에서 엑세스 토큰 만료 시 내려주는 에러 메시지
      error.response?.data?.error === 'AccessTokenExpired' &&
      // 동일 요청 재시도를 방지하기 위함
      !originalRequest._retry
    ) {
      try {
        // refresh 요청
        await refreshAccessToken();

        // 원래 요청 재시도
        originalRequest._retry = true;
        return PoPoAxios(originalRequest);
      } catch (refreshError) {
        // refresh도 실패하면 로그아웃 처리
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
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

// refresh 토큰 요청 함수
export const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${popoApiUrl}/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // 쿠키 포함
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Refresh token failed');
    }

    return true;
  } catch (error) {
    console.error('Refresh token error:', error);
    throw error;
  }
};
