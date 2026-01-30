import { useQuery } from '@tanstack/react-query';
import { getWeeklyChartData } from '../service/service';

export const useGetWeeklyChart = (userId: string, startDate: Date, endDate: Date) => {
  return useQuery({
    queryKey: ['weeklyChartData'],
    queryFn: async () => await getWeeklyChartData(userId, startDate, endDate),
    enabled: !!userId && !!startDate && !!endDate,
  });
};
