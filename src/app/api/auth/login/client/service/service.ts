import axios from 'axios';

export interface LoginRequest {
  userId: string;
  password: string;
}

export const login = async (payload: LoginRequest) => {
  const response = await axios.post('/api/auth/login', payload);
  return response.data;
};
