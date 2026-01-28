import { NewUser } from '@/db/schema';
import axios from 'axios';

export const register = async (payload: NewUser) => {
  const response = await axios.post('/api/auth/register', payload);
  return response.data;
};
