import { useMutation } from '@tanstack/react-query';
import { deleteRoutine, updateRoutine, UpdateRoutineRequest } from '../service/service';

export const useDeleteRoutine = () => {
  return useMutation({
    mutationFn: async (routineId: string) => await deleteRoutine(routineId),
  });
};

export const useUpdateRoutine = () => {
  return useMutation({
    mutationFn: async (payload: UpdateRoutineRequest) => await updateRoutine(payload),
  });
};
