import axiosInstance from '@/lib/axios';

export interface WeeklyChartData {
  date: string;
  duration: number;
}

export interface WeeklyChartResponse extends WeeklyChartData{
  id: string;
  userId: string;
  createdAt: string;
}

export const getWeeklyChartData = async (userId: string, startDate: string, endDate: string) => {
  const response = await axiosInstance.get('/api/main/chart', {
    params: { userId, startDate, endDate },
  });
  
  // 일주일 날짜 생성 (일주일 전부터 오늘까지)
  const today = new Date();
  const weekData = [];
  let totalDuration = 0;
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0].substring(5); // MM-DD 형식
    
    // 해당 날짜의 데이터 찾기
    const dayData = response.data.find((session: WeeklyChartResponse) => 
      session.date.split('T')[0].substring(5) === dateStr
    );
    
    const value = dayData ? dayData.duration : 0;
    totalDuration += value;
    
    weekData.push({
      name: dateStr,
      value: value,
    });
  }
  
  // 평균 추가
  const average = Math.round(totalDuration / 7);
  weekData.push({
    name: '평균',
    value: average,
  });
  
  return weekData;
};
