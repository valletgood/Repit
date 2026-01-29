import { Bar, BarChart } from 'recharts';

interface ChartBarProps {
  data: {
    name: string;
    value: number;
  }[];
}

export default function ChartBar({ data }: ChartBarProps) {
  return (
    <BarChart
      style={{ width: '100%', maxWidth: '300px', maxHeight: '100px', aspectRatio: 1.618 }}
      responsive
      data={data}
    >
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
  );
}
