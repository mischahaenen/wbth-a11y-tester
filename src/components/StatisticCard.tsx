import React from 'react';

interface StatisticCardProps {
  label: string;
  value: string;
  valueClassName?: string;
}

export const StatisticCard: React.FC<StatisticCardProps> = ({
  label,
  value,
  valueClassName = "text-2xl"
}) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <dt className="text-sm text-gray-600 mb-1">{label}</dt>
      <dd className={`font-bold ${valueClassName}`}>{value}</dd>
    </div>
  );
};