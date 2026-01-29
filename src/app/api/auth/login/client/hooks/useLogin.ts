import { useMutation } from '@tanstack/react-query';
import { login, LoginRequest, LoginResponse } from '../service/service';

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (payload: LoginRequest) => await login(payload),
  });
};
