import axios from 'axios';

interface CheckIdResponse {
  available: boolean;
  message: string;
}

export const checkIdAvailability = async (userId: string): Promise<CheckIdResponse> => {
  const response = await axios.get(`/api/auth/check-id?userId=${encodeURIComponent(userId)}`);
  return response.data;
};
