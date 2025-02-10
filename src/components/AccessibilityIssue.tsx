import React from 'react';
import { AccessibilityIssue as AccessibilityIssueType } from '../types/wave';
import { getSeverityStyle } from '../utils/severity';

interface AccessibilityIssueProps {
  issue: AccessibilityIssueType;
}

export const AccessibilityIssue: React.FC<AccessibilityIssueProps> = ({ issue }) => {
  return (
    <article className={`mb-4 p-4 rounded-lg border ${getSeverityStyle(issue.severity)}`}>
      <header className="flex justify-between items-start mb-3">
        <h4 className="text-lg font-medium">
          {issue.documentation?.title ?? issue.description}
        </h4>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/90">
            {(issue.documentation?.type ?? issue.category ?? 'unknown').toUpperCase()}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium bg-white/90`}>
            {issue.severity}
          </span>
        </div>
      </header>
      
      <div className="space-y-4">
        {/* Description */}
        <div className="prose prose-sm max-w-none">
          <strong className="text-sm font-semibold">Description: </strong>
          <span>{issue.documentation?.summary ?? issue.description}</span>
        </div>

        {/* Location */}
        <div>
          <strong className="text-sm font-semibold">Location: </strong>
          <code className="px-2 py-1 rounded bg-white/50 text-sm font-mono">
            {issue.location.humanReadable}
          </code>
        </div>
        
        {/* Contrast Information */}
        {issue.contrast && (
          <div className="bg-white/50 rounded-lg p-4">
            <strong className="text-sm font-semibold block mb-2">Contrast Details:</strong>
            <div className="space-y-3">
              {issue.contrast.data.map((contrast, index) => (
                <div key={contrast.ratio + "-" + index} className="pl-4 border-l-2 border-gray-200">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <strong>Contrast Ratio:</strong>
                      <span className="ml-2">{contrast.ratio.toFixed(2)}:1</span>
                    </div>
                    <div>
                      <strong>Text Size:</strong>
                      <span className="ml-2">{contrast.isLargeText ? 'Large' : 'Normal'}</span>
                    </div>
                    <div>
                      <strong>Foreground:</strong>
                      <span className="ml-2 font-mono">{contrast.foregroundColor}</span>
                    </div>
                    <div>
                      <strong>Background:</strong>
                      <span className="ml-2 font-mono">{contrast.backgroundColor}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* WCAG Guidelines */}
        {issue.documentation?.guidelines && issue.documentation.guidelines.length > 0 && (
          <div>
            <strong className="text-sm font-semibold block mb-2">WCAG Guidelines:</strong>
            <ul className="list-disc pl-5 space-y-1">
              {issue.documentation.guidelines.map((guideline, index) => (
                <li key={guideline.name + "-" + index}>
                  <a
                    href={guideline.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {guideline.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
};