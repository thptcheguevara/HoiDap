
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  percentage: string;
}

interface StatsBarChartProps {
  data: ChartData[];
}

const COLORS = ['#34d399', '#f87171']; // Emerald-400 for Answered, Red-400 for Unanswered

export const StatsBarChart: React.FC<StatsBarChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 150 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 25, right: 10, left: -20, bottom: 5 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#475569' }} interval={0} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#475569' }} />
          <Tooltip 
            cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} 
            contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                fontSize: '12px'
            }}
          />
          <Bar dataKey="value" barSize={40}>
             {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            <LabelList dataKey="percentage" position="top" style={{ fill: '#475569', fontSize: '12px', fontWeight: '500' }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
