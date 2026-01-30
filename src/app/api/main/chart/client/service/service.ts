import axiosInstance from '@/lib/axios';

export const getWeeklyChartData = async (userId: string, startDate: Date, endDate: Date) => {
  const response = await axiosInstance.get('/api/main/chart', {
    params: { userId, startDate, endDate },
  });
  return response.data;
};
