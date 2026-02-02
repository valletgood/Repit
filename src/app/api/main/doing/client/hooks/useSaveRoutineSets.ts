import { useMutation } from '@tanstack/react-query';
import { saveRoutineSets, SaveRoutineSetsRequest } from '@/app/api/main/doing/client/service/service';

export const useSaveRoutineSets = () => {
  return useMutation({
    mutationFn: (payload: SaveRoutineSetsRequest) => saveRoutineSets(payload),
  });
};
