import React from 'react';
import { WebsiteReport as WebsiteReportType } from '../types/wave';
import { AccessibilityIssue } from './AccessibilityIssue';
import { StatisticCard } from './StatisticCard';
import { IssueSummary } from './IssueSummary';
import { ElementSummary } from './ElementSummary';

interface WebsiteReportProps {
  report: WebsiteReportType;
}

export const WebsiteReport: React.FC<WebsiteReportProps> = ({ report }) => {
  return (
    <article>
      <header className="p-6 bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800">{report.url}</h2>
      </header>
      
      {report.error ? (
        <div className="p-6">
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-red-700">{report.error}</p>
          </div>
        </div>
      ) : (
        <div className="p-6 space-y-8">
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatisticCard
                label="Total Elements"
                value={report.statistics.totalelements.toString()}
              />
              <StatisticCard
                label="Page Title"
                value={report.statistics.pagetitle}
                valueClassName="text-lg"
              />
              <StatisticCard
                label="Analysis Time"
                value={`${report.statistics.time}s`}
              />
            </div>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Issues Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(report.summary.issues).map(([category, data]) => (
                <IssueSummary
                  key={category}
                  category={category}
                  description={data.description}
                  count={data.count}
                />
              ))}
            </div>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Page Elements</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(report.summary.elements).map(([category, data]) => (
                <ElementSummary
                  key={category}
                  category={category}
                  description={data.description}
                  count={data.count}
                />
              ))}
            </div>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Detailed Issues</h3>
            <div className="space-y-4">
              {report.details.issues.map((issue, index) => (
                <AccessibilityIssue key={`${issue.id}-${index}`} issue={issue} />
              ))}
            </div>
          </section>

          
        </div>
      )}
    </article>
  );
};