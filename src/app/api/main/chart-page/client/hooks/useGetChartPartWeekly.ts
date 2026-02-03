import { useQuery } from '@tanstack/react-query';
import { getChartPartWeeklyData } from '@/app/api/main/chart-page/client/service/service';

export const useGetChartPartWeekly = (part: string) => {
  return useQuery({
    queryKey: ['chart-part-weekly', part],
    queryFn: async () => {
      const { data } = await getChartPartWeeklyData(part);
      return data;
    },
  });
};
