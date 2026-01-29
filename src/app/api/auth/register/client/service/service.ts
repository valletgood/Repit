import { NewUser } from '@/db/schema';
import axiosInstance from '@/lib/axios';

export const register = async (payload: NewUser) => {
  const response = await axiosInstance.post('/api/auth/register', payload);
  return response.data;
};
