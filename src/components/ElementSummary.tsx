import React from 'react';

interface ElementSummaryProps {
  category: string;
  description: string;
  count: number;
}

export const ElementSummary: React.FC<ElementSummaryProps> = ({
  category,
  description,
  count
}) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <dt className="flex items-center justify-between">
        <span className="font-medium text-gray-700">{description}</span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {category}
        </span>
      </dt>
      <dd className="mt-2">
        <span className="text-2xl font-bold">{count}</span>
        <span className="text-sm ml-1 text-gray-600">elements</span>
      </dd>
    </div>
  );
};