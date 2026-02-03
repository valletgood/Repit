import axios from 'axios';
import { store } from '@/redux/configStore';
import { logout as logoutAction } from '@/redux/slices/userSlice';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    // TODO: 토큰이 있으면 헤더에 추가
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 공통 에러 처리
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        console.error('인증이 만료되었습니다.');
        
        axiosInstance.post('/api/auth/logout').finally(() => {
          store.dispatch(logoutAction());
          
          if (typeof window !== 'undefined') {
            window.location.href = '/login?expired=true';
          }
        });
      }

      if (status === 500) {
        console.error('서버 오류가 발생했습니다.');
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
