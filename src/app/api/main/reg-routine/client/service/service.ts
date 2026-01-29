import axiosInstance from '@/lib/axios';

export interface RegRoutineRequest {
  userId: string;
  name: string;
  exerciseIds: string[];
}

export const regRoutine = async (payload: RegRoutineRequest) => {
  const response = await axiosInstance.post('/api/main/reg-routine', payload);
  return response.data;
};
