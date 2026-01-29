import axiosInstance from '@/lib/axios';

interface CheckIdResponse {
  available: boolean;
  message: string;
}

export const checkIdAvailability = async (userId: string): Promise<CheckIdResponse> => {
  const response = await axiosInstance.get(
    `/api/auth/check-id?userId=${encodeURIComponent(userId)}`
  );
  return response.data;
};
