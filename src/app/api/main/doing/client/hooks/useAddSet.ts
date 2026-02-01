import { useMutation } from '@tanstack/react-query';
import { addSet, AddSetRequest } from '@/app/api/main/doing/client/service/service';

export const useAddSet = () => {
  return useMutation({
    mutationFn: (payload: AddSetRequest) => addSet(payload),
  });
};
