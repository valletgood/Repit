import { useMutation } from '@tanstack/react-query';
import { login, LoginRequest } from '../service/service';

export const useLogin = () => {
  return useMutation({
    mutationFn: async (payload: LoginRequest) => await login(payload),
  });
};
