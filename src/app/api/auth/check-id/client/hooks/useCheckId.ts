import { useMutation } from '@tanstack/react-query';
import { checkIdAvailability } from '../service/service';

export const useCheckId = () => {
  return useMutation({
    mutationFn: async (userId: string) => await checkIdAvailability(userId),
  });
};
