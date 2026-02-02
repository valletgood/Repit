import axiosInstance from '@/lib/axios';

export interface LogoutResponse {
  message: string;
}

export const logout = async (): Promise<LogoutResponse> => {
  const response = await axiosInstance.post('/api/auth/logout');
  return response.data;
};