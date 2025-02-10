import React, { useState, useRef, useEffect } from 'react';
import { BatchProcessingStatus } from './BatchProcessing';
import { formatForCSV } from '../utils/exportFormatters';
import { aggregateReportsByDomain } from '../utils/repportAggregation';
import { saveAs } from 'file-saver';


interface ExportButtonProps {
  batchStatus: BatchProcessingStatus[];
}

export const ExportButton: React.FC<ExportButtonProps> = ({ batchStatus }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = async (format: 'json' | 'csv' | 'pdf') => {
    setIsOpen(false);
    setIsExporting(true);
    try {
      const completedReports = batchStatus.filter(
        status => status.status === 'completed' && status.result
      );

      if (completedReports.length === 0) {
        alert('No completed reports to export');
        return;
      }

      const aggregatedReports = aggregateReportsByDomain(batchStatus);
      const timestamp = new Date().toISOString().split('T')[0];

      switch (format) {
        case 'json': {
          const exportData = {
            generatedAt: new Date().toISOString(),
            summary: {
              totalDomains: aggregatedReports.length,
              totalPagesScanned: aggregatedReports.reduce((sum, report) => sum + report.pagesScanned, 0),
              totalIssues: aggregatedReports.reduce((sum, report) => sum + report.totalIssues, 0)
            },
            domainReports: aggregatedReports
          };

          const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
          saveAs(blob, `accessibility-report-${timestamp}.json`);
          break;
        }
        
        case 'csv': {
          const { domainSummary, pageDetails, allIssues } = formatForCSV(aggregatedReports);
          
          const JSZip = (await import('jszip')).default;
          const zip = new JSZip();
          
          zip.file('domain-summary.csv', domainSummary);
          zip.file('page-details.csv', pageDetails);
          zip.file('all-issues.csv', allIssues);
          
          const blob = await zip.generateAsync({ type: 'blob' });
          saveAs(blob, `accessibility-report-${timestamp}.zip`);
          break;
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const isDisabled = !batchStatus.some(status => status.status === 'completed') || isExporting;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        disabled={isDisabled}
        className={`
          px-4 py-2 rounded-lg flex items-center gap-2
          ${isDisabled 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-green-600 hover:bg-green-700'
          }
          text-white font-medium transition-colors
        `}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {isExporting ? 'Exporting...' : 'Export Report'}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1" role="none">
            {[
              { label: 'Export as JSON', format: 'json' },
              { label: 'Export as CSV', format: 'csv' }
            ].map(({ label, format }) => (
              <button
                key={format}
                className="
                  w-full text-left px-4 py-2 text-sm text-gray-700
                  hover:bg-gray-100 hover:text-gray-900
                  focus:outline-none focus:bg-gray-100 focus:text-gray-900
                "
                role="menuitem"
                onClick={() => handleExport(format as 'json' | 'csv')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


