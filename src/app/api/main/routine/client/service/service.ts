import axiosInstance from '@/lib/axios';

export const deleteRoutine = async (routineId: string) => {
  const response = await axiosInstance.delete('/api/main/routine', {
    params: { routineId },
  });
  return response.data;
};

export interface UpdateRoutineRequest {
  routineId: string;
  name: string;
}

export const updateRoutine = async (payload: UpdateRoutineRequest) => {
  const response = await axiosInstance.patch('/api/main/routine', payload);
  return response.data;
};
