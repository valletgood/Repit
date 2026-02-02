import { useMutation } from '@tanstack/react-query';
import { logout } from '../service/service';

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
  });
};