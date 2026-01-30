import { useQuery } from '@tanstack/react-query';
import { getWeeklyChartData } from '../service/service';

export const useGetWeeklyChart = (userId: string, startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['weeklyChartData'],
    queryFn: async () => await getWeeklyChartData(userId, startDate, endDate),
    enabled: !!userId && !!startDate && !!endDate,
  });
};
