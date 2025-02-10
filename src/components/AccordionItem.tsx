import { useState } from "react";
import { BatchProcessingStatus } from "../types/batch";
import { StatusBadge } from "./StatusBadge";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
import { WebsiteReport } from "./WebsiteReport";

interface AccordionItemProps {
    status: BatchProcessingStatus;
    index: number;
  }
  
  export const AccordionItem: React.FC<AccordionItemProps> = ({ status, index }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div className="border rounded-lg">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <div className="flex items-center space-x-4">
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="font-medium">{status.url}</span>
          </div>
          <StatusBadge status={status.status} />
        </button>
  
        {isOpen && (
          <>
            {status.status === 'processing' && (
              <div className="flex justify-center">
                <LoadingSpinner size="small" />
              </div>
            )}
  
            {status.status === 'failed' && (
              <ErrorMessage message={status.error ?? 'Processing failed'} />
            )}
  
            {status.status === 'completed' && status.result && (
              <WebsiteReport report={status.result} />
            )}
          </>
        )}
      </div>
    );
  };