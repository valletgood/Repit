import { useQuery } from '@tanstack/react-query';
import { getChartPartDistributionData } from '@/app/api/main/chart-page/client/service/service';

export const useGetChartPartDistribution = () => {
  return useQuery({
    queryKey: ['chart-part-distribution'],
    queryFn: async () => {
      const { data } = await getChartPartDistributionData();
      return data;
    },
  });
};
