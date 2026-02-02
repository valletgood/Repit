import { useQuery } from '@tanstack/react-query';
import type { Exercise } from '@/db/schema';
import axiosInstance from '@/lib/axios';

interface ExercisesResponse {
  exercises: Exercise[];
  categories: string[];
  equipments: string[];
}

export function useGetExercises() {
  return useQuery<ExercisesResponse>({
    queryKey: ['exercises'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/main/exercises');
      return data;
    },
  });
}
