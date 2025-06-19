// refresh 관련 유틸리티 및 상태 관리
import { PoPoAxios } from './axios.instance';

let isRefreshing = false;
// 여러 컴포넌트가 동시에 리프레시 토큰 재발급을 요청하는 것을 막기 위해 사용
// 여러 컴포넌트가 각각 리프레시를 요청하면 백엔드에서 race condition으로 인해 오류가 발생할 수 있음
// 이를 방지하기 위해 한 번의 리프레시로 모든 컴포넌트의 요청을 처리하도록 함
let failedQueue: Array<{
  // eslint-disable-next-line
  resolve: (value?: any) => void;
  // eslint-disable-next-line
  reject: (error: any) => void;
  originalRequest: any;
}> = [];

export const processQueue = (error: any) => {
  failedQueue.forEach(({ resolve, reject, originalRequest }) => {
    if (error) {
      reject(error);
    } else {
      resolve(PoPoAxios(originalRequest));
    }
  });
  failedQueue = [];
};

export const getIsRefreshing = () => isRefreshing;
export const setIsRefreshing = (value: boolean) => {
  isRefreshing = value;
};

export const addToFailedQueue = (
  // eslint-disable-next-line
  resolve: (value?: any) => void,
  // eslint-disable-next-line
  reject: (error: any) => void,
  originalRequest: any,
) => {
  failedQueue.push({ resolve, reject, originalRequest });
};

export const refreshAccessToken = async () => {
  try {
    const response = await PoPoAxios.post(
      '/auth/refresh',
      {},
      { withCredentials: true },
    );
    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Refresh token failed');
    }
    return true;
  } catch (error) {
    console.error('Refresh token error:', error);
    throw error;
  }
};
