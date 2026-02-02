'use client';

import ReactCalendar from 'react-calendar';
import type { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { cn } from '@/lib/utils';
import './calendar.css';

interface CustomCalendarProps extends Omit<CalendarProps, 'onChange'> {
  className?: string;
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  onMonthChange?: (date: Date) => void;
  modifiers?: {
    workout?: Date[];
  };
  modifiersClassNames?: {
    workout?: string;
  };
}

function Calendar({
  className,
  selected,
  onSelect,
  onMonthChange,
  modifiers,
  modifiersClassNames,
  ...props
}: CustomCalendarProps) {
  const workoutDates = modifiers?.workout ?? [];
  const workoutClassName = modifiersClassNames?.workout ?? '';

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return '';
    const isWorkout = workoutDates.some((d) => d.toDateString() === date.toDateString());
    return isWorkout ? workoutClassName : '';
  };

  return (
    <ReactCalendar
      className={cn('react-calendar-custom', className)}
      value={selected}
      onChange={(value) => {
        if (value instanceof Date) {
          onSelect?.(value);
        } else if (Array.isArray(value) && value[0] instanceof Date) {
          onSelect?.(value[0]);
        } else {
          onSelect?.(undefined);
        }
      }}
      tileClassName={tileClassName}
      locale="ko-KR"
      formatDay={(_, date) => date.getDate().toString()}
      onActiveStartDateChange={({ activeStartDate }) => {
        if (activeStartDate) {
          onMonthChange?.(activeStartDate);
        }
      }}
      {...props}
    />
  );
}

export { Calendar };
