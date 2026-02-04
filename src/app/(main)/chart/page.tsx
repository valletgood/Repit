'use client';

import { useState } from 'react';
import { ChartPartDropDown } from '@/app/(main)/chart/_components/ChartPartDropDown';
import { useGetChartPartWeekly } from '@/app/api/main/chart-page/client/hooks/useGetChartPartWeekly';
import { useGetChartPartDistribution } from '@/app/api/main/exercises/client/hooks/useGetChartPartDistribution';
import ChartBar from '@/components/chart/ChartBar';
import ChartPie from '@/components/chart/ChartPie';

export interface PartSelectOption {
  value: string;
  label: string;
}

const parts: PartSelectOption[] = [
  { value: '가슴', label: '가슴' },
  { value: '등', label: '등' },
  { value: '어깨', label: '어깨' },
  { value: '삼두', label: '삼두' },
  { value: '이두', label: '이두' },
];

export default function ChartPage() {
  const [selectedPart, setSelectedPart] = useState('가슴');

  const { data: weeklyData } = useGetChartPartWeekly(selectedPart);
  const { data: distributionData } = useGetChartPartDistribution();

  console.log(weeklyData);
  console.log(distributionData);

  const handleSelectedPart = (value: string) => {
    setSelectedPart(value);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* 1. 드롭다운 */}
      <div className="relative mb-10 w-48">
        <ChartPartDropDown
          options={parts}
          value={selectedPart}
          onChangeValue={handleSelectedPart}
        />
      </div>

      {/* 2. 부위 별 차트 */}
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="scrollbar-hide flex flex-1 flex-col gap-5 overflow-y-auto rounded-xl">
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">주간 운동 볼륨 추이</h2>
            <ChartBar data={weeklyData ?? []} height={200} />
          </section>

          {/* 4. 부위 수행 차트 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">부위별 운동 비율</h2>
            <ChartPie data={distributionData ?? []} height={280} />
          </section>
        </div>
      </section>
    </div>
  );
}
