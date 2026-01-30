import { pgTable, text, integer, real, timestamp, uuid } from 'drizzle-orm/pg-core';

// 사용자 테이블
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().unique(), // 로그인용 아이디
  name: text('name').notNull(),
  password: text('password').notNull(),
  gender: text('gender').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// 운동 종류 테이블
export const exercises = pgTable('exercises', {
  excerciseId: uuid('excercise_id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  mainCategory: text('category').notNull(), // 예: "가슴", "등", "어깨", "하체", "팔", "복근", "유산소"
  subCategory: text('sub_category'), // 예: "벤치 프레스", "덤벨 프레스", "시티드 덤벨 숄더 프레스"
  equipment: text('equipment').notNull(), // 예: "바벨", "덤벨", "머신", "케이블", "맨몸", "유산소"
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// 운동 세션 테이블 (하루 운동 기록)
export const workoutSessions = pgTable('workout_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  date: timestamp('date').notNull(),
  duration: integer('duration').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// 운동 세트 테이블 (각 운동의 세트 기록)
export const workoutSets = pgTable('workout_sets', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id')
    .notNull()
    .references(() => workoutSessions.id, { onDelete: 'cascade' }),
  exerciseId: uuid('exercise_id')
    .notNull()
    .references(() => exercises.excerciseId),
  setNumber: integer('set_number').notNull(),
  weight: real('weight'), // kg 단위
  reps: integer('reps'), // 반복 횟수
  duration: integer('duration'), // 초 단위 (유산소 운동용)
  distance: real('distance'), // km 단위 (유산소 운동용)
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// 루틴 테이블 (사용자의 운동 루틴)
export const routines = pgTable('routines', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// 루틴 운동 테이블 (루틴에 포함된 운동 목록)
export const routineExercises = pgTable('routine_exercises', {
  id: uuid('id').primaryKey().defaultRandom(),
  routineId: uuid('routine_id')
    .notNull()
    .references(() => routines.id, { onDelete: 'cascade' }),
  exerciseId: uuid('exercise_id')
    .notNull()
    .references(() => exercises.excerciseId),
  order: integer('order').notNull(), // 운동 순서
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// 루틴 운동 세트 테이블 (각 운동의 세트별 무게/횟수)
export const routineExerciseSets = pgTable('routine_exercise_sets', {
  id: uuid('id').primaryKey().defaultRandom(),
  routineExerciseId: uuid('routine_exercise_id')
    .notNull()
    .references(() => routineExercises.id, { onDelete: 'cascade' }),
  setNumber: integer('set_number').notNull(), // 세트 번호 (1, 2, 3...)
  weight: real('weight'), // kg 단위
  reps: integer('reps'), // 반복 횟수
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// 타입 내보내기
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;

export type WorkoutSession = typeof workoutSessions.$inferSelect;
export type NewWorkoutSession = typeof workoutSessions.$inferInsert;

export type WorkoutSet = typeof workoutSets.$inferSelect;
export type NewWorkoutSet = typeof workoutSets.$inferInsert;

export type Routine = typeof routines.$inferSelect;
export type NewRoutine = typeof routines.$inferInsert;

export type RoutineExercise = typeof routineExercises.$inferSelect;
export type NewRoutineExercise = typeof routineExercises.$inferInsert;

export type RoutineExerciseSet = typeof routineExerciseSets.$inferSelect;
export type NewRoutineExerciseSet = typeof routineExerciseSets.$inferInsert;
