import axios from 'axios';

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
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
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
        // TODO: 인증 만료 처리 (로그아웃, 로그인 페이지 리다이렉트 등)
        console.error('인증이 만료되었습니다.');
      }

      if (status === 500) {
        console.error('서버 오류가 발생했습니다.');
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
