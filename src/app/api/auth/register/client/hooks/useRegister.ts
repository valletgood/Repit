import { useMutation } from '@tanstack/react-query';
import { register } from '../service/service';
import { NewUser } from '@/db/schema';

export const useRegister = () => {
  return useMutation({
    mutationFn: async (payload: NewUser) => await register(payload),
  });
};
