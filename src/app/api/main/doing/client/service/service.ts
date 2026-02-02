import axiosInstance from '@/lib/axios';

export interface SaveRoutineSetsRequest {
  routineId: string;
  duration: number;
  exercises: {
    routineExerciseId: string;
    exerciseId: string;
    order: number;
    sets: {
      id: string;
      setNumber: number;
      weight: number | null;
      reps: number | null;
    }[];
  }[];
}

export const saveRoutineSets = async (payload: SaveRoutineSetsRequest) => {
  const response = await axiosInstance.put('/api/main/doing', payload);
  return response.data;
};
