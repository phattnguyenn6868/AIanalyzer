import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { FighterAttributes } from '../types';

interface PerformanceChartProps {
  fighter1: FighterAttributes;
  fighter2: FighterAttributes;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ fighter1, fighter2 }) => {
  const data = [
    {
      attribute: 'Power',
      [fighter1.name]: fighter1.powerRating,
      [fighter2.name]: fighter2.powerRating,
    },
    {
      attribute: 'Defense',
      [fighter1.name]: fighter1.defenseRating,
      [fighter2.name]: fighter2.defenseRating,
    },
    {
      attribute: 'Accuracy',
      [fighter1.name]: fighter1.accuracyRating,
      [fighter2.name]: fighter2.accuracyRating,
    },
    {
      attribute: 'Ring Control',
      [fighter1.name]: fighter1.ringGeneralshipRating,
      [fighter2.name]: fighter2.ringGeneralshipRating,
    },
    {
      attribute: 'Fight IQ',
      [fighter1.name]: fighter1.fightIQRating,
      [fighter2.name]: fighter2.fightIQRating,
    },
    {
      attribute: 'Footwork',
      [fighter1.name]: fighter1.footworkRating,
      [fighter2.name]: fighter2.footworkRating,
    },
  ];

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="attribute" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
            domain={[0, 100]}
          />
          <Legend />
          <Bar 
            dataKey={fighter1.name} 
            fill="#DC2626" 
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey={fighter2.name} 
            fill="#7C2D12" 
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};