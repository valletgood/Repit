import axios from 'axios';

export interface LoginRequest {
  userId: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: string;
    userId: string;
    name: string;
    gender: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post('/api/auth/login', payload);
  return response.data;
};
