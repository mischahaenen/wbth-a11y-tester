import React from 'react';
import { getSeverityLevel, getSeverityStyle } from '../utils/severity';

interface IssueSummaryProps {
  category: string;
  description: string;
  count: number;
}

export const IssueSummary: React.FC<IssueSummaryProps> = ({
  category,
  description,
  count
}) => {
  const severity = getSeverityLevel(category);
  const severityStyle = getSeverityStyle(severity);

  return (
    <div className={`p-4 rounded-lg border ${severityStyle}`}>
      <div className="flex justify-between items-start">
        <dt className="text-sm font-medium flex-grow">{description}</dt>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/80">
          {severity}
        </span>
      </div>
      <dd className="mt-2">
        <span className="text-2xl font-bold">{count}</span>
        <span className="text-sm ml-1">issues</span>
      </dd>
    </div>
  );
};