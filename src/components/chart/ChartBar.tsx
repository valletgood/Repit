import { Bar, BarChart, XAxis, Cell, ResponsiveContainer } from 'recharts';

interface ChartBarProps {
  data: {
    name: string;
    value: number;
  }[];
  height?: number;
}

const getBarColor = (value: number): string => {
  if (value < 1800) return '#260108';
  if (value < 3600) return '#730216';
  return '#A60320';
};

export default function ChartBar({ data, height = 120 }: ChartBarProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} barCategoryGap="20%">
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#888888', fontSize: 12 }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.name === '평균' ? '#D90416' : getBarColor(entry.value)}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
