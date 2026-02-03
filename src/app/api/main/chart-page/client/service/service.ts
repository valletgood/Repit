import axiosInstance from '@/lib/axios';

export const getChartPartWeeklyData = async (part: string) => {
  const response = await axiosInstance.get(`/api/main/chart-page?type=part-weekly&part=${part}`);
  return response.data;
};

export const getChartPartDistributionData = async () => {
  const response = await axiosInstance.get(`/api/main/chart-page?type=part-distribution`);
  return response.data;
};
