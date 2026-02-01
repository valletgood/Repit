import axiosInstance from '@/lib/axios';

export interface AddSetRequest {
  routineExerciseId: string;
  weight?: number | null;
  reps?: number | null;
}

export const addSet = async (payload: AddSetRequest) => {
  const response = await axiosInstance.post('/api/main/doing', payload);
  return response.data;
};
