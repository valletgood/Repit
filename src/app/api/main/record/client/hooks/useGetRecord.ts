import { useQuery } from '@tanstack/react-query';
import { getDailyRecord, getMonthlyRecord } from '../service/service';

export const useGetDailyRecord = (userId: string, date: string) => {
  return useQuery({
    queryKey: ['dailyRecord', userId, date],
    queryFn: async () => await getDailyRecord(userId, date),
    enabled: !!userId && !!date,
  });
};

export const useGetMonthlyRecord = (userId: string, month: string) => {
  return useQuery({
    queryKey: ['monthlyRecord', userId, month],
    queryFn: async () => await getMonthlyRecord(userId, month),
    enabled: !!userId && !!month,
  });
};
