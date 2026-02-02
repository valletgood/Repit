import axiosInstance from '@/lib/axios';

export interface WorkoutSession {
  id: string;
  userId: string;
  date: string;
  duration: number;
  createdAt: string;
}

export interface WorkoutSetWithExercise {
  id: string;
  sessionId: string;
  exerciseId: string;
  setNumber: number;
  weight: number | null;
  reps: number | null;
  duration: number | null;
  distance: number | null;
  exerciseName: string;
  mainCategory: string;
  equipment: string;
}

export interface DailyRecordResponse {
  sessions: WorkoutSession[];
  sets: WorkoutSetWithExercise[];
}

export interface MonthlyRecordResponse {
  workoutCount: number;
  workoutDates: string[];
}

export const getDailyRecord = async (userId: string, date: string): Promise<DailyRecordResponse> => {
  const response = await axiosInstance.get('/api/main/record', {
    params: { userId, date },
  });
  return response.data;
};

export const getMonthlyRecord = async (userId: string, month: string): Promise<MonthlyRecordResponse> => {
  const response = await axiosInstance.get('/api/main/record', {
    params: { userId, month },
  });
  return response.data;
};
