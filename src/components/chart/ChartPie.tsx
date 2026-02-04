'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ChartPieProps {
  data: {
    label: string;
    value: number;
  }[];
  height?: number;
}

// 파스텔 컬러 팔레트 (부드럽고 세련된 색상)
const COLORS = [
  '#A5B4FC', // 파스텔 인디고
  '#86EFAC', // 파스텔 그린
  '#FCD34D', // 파스텔 옐로우
  '#F9A8D4', // 파스텔 핑크
  '#99F6E4', // 파스텔 민트
  '#C4B5FD', // 파스텔 퍼플
  '#FDBA74', // 파스텔 오렌지
  '#67E8F9', // 파스텔 스카이
];

// 커스텀 라벨 렌더러 - 부위와 퍼센티지 표시
const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
}) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 25;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // 퍼센트가 5% 미만이면 라벨 생략 (너무 작은 영역)
  if (percent < 0.05) return null;

  return (
    <text
      x={x}
      y={y}
      fill="#FFFFFF"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
      fontWeight={500}
    >
      {`${name} ${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

export default function ChartPie({ data, height = 280 }: ChartPieProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={100}
          innerRadius={50}
          dataKey="value"
          nameKey="label"
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
