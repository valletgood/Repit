'use client';

import { useState } from 'react';
import { ChartPartDropDown } from '@/app/(main)/chart/_components/ChartPartDropDown';
import { useGetChartPartWeekly } from '@/app/api/main/chart-page/client/hooks/useGetChartPartWeekly';
import { useGetChartPartDistribution } from '@/app/api/main/exercises/client/hooks/useGetChartPartDistribution';
import ChartBar from '@/components/chart/ChartBar';

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
      <div className="relative w-48">
        <ChartPartDropDown
          options={parts}
          value={selectedPart}
          onChangeValue={handleSelectedPart}
        />
      </div>

      {/* 2. 부위 별 차트 */}
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="scrollbar-hide flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-xl">
          <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <h2 className="mb-4 text-lg font-bold text-white">
              부위 별
              <ChartBar data={weeklyData ?? []} height={200} />
            </h2>
          </section>

          {/* 4. 부위 수행 차트 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">부위 수행 차트</h2>
            <div className="rounded-xl bg-white p-6">
              <div className="relative mx-auto h-64 w-64">
                {/* 파이 차트 플레이스홀더 */}
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  {/* 가장 큰 섹션 (빨강) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#EF4444"
                    strokeWidth="80"
                    strokeDasharray="125.6 125.6"
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                  {/* 두 번째 섹션 (연한 빨강) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#FCA5A5"
                    strokeWidth="80"
                    strokeDasharray="62.8 188.4"
                    strokeDashoffset="-125.6"
                    transform="rotate(-90 50 50)"
                  />
                  {/* 세 번째 섹션 (더 연한 빨강) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#FEE2E2"
                    strokeWidth="80"
                    strokeDasharray="31.4 219.8"
                    strokeDashoffset="-188.4"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                {/* 라벨들 */}
                <div className="absolute top-1/4 right-4 text-xs">
                  <div className="rounded bg-white px-2 py-1 shadow">
                    <span className="font-bold text-red-500">50.6%</span>
                    <div className="text-gray-600">Label</div>
                  </div>
                </div>
                <div className="absolute bottom-1/3 left-4 text-xs">
                  <div className="rounded bg-white px-2 py-1 shadow">
                    <span className="font-bold text-red-300">25%</span>
                    <div className="text-gray-600">Label</div>
                  </div>
                </div>
                <div className="absolute top-1/2 left-8 text-xs">
                  <div className="rounded bg-white px-2 py-1 shadow">
                    <span className="font-bold text-red-200">12.5%</span>
                    <div className="text-gray-600">Label</div>
                  </div>
                </div>
                <div className="absolute bottom-8 left-1/4 text-xs">
                  <div className="rounded bg-white px-2 py-1 shadow">
                    <span className="font-bold text-red-100">11.9%</span>
                    <div className="text-gray-600">Label</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
