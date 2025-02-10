import { AccessibilityIssue, WebsiteReport } from './wave';

export interface AggregatedPageReport {
  url: string;
  issueCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  infoCount: number;
  issues: AccessibilityIssue[];
}

export interface DomainAggregateReport {
  domain: string;
  pagesScanned: number;
  totalIssues: number;
  issuesBySeverity: {
    critical: number;
    high: number;
    medium: number;
    info: number;
  };
  issuesByCategory: Record<string, number>;
  pages: AggregatedPageReport[];
  commonIssues: Array<{
    description: string;
    count: number;
    severity: string;
    affectedPages: string[];
  }>;
}