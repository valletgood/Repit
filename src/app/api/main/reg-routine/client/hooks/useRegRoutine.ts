import { useMutation } from '@tanstack/react-query';
import { regRoutine, RegRoutineRequest } from '../service/service';

export const useRegRoutine = () => {
  return useMutation({
    mutationFn: async (payload: RegRoutineRequest) => await regRoutine(payload),
  });
};
