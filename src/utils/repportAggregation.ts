import { BatchProcessingStatus } from '../components/BatchProcessing';
import { DomainAggregateReport, AggregatedPageReport } from '../types/aggregate';
import { WebsiteReport } from '../types/wave';
import { extractDomain } from './domain';

export const aggregateReportsByDomain = (reports: BatchProcessingStatus[]): DomainAggregateReport[] => {
  // Group reports by domain
  const domainGroups = reports.reduce((acc, status) => {
    if (status.status !== 'completed' || !status.result) return acc;
    
    const domain = extractDomain(status.url);
    if (!acc[domain]) acc[domain] = [];
    acc[domain].push({ status, result: status.result });
    return acc;
  }, {} as Record<string, Array<{ status: BatchProcessingStatus; result: WebsiteReport }>>);

  // Process each domain
  return Object.entries(domainGroups).map(([domain, groupedReports]) => {
    const pages: AggregatedPageReport[] = groupedReports.map(({ status, result }) => ({
      url: status.url,
      issueCount: Object.values(result.summary.issues).reduce((sum, { count }) => sum + count, 0),
      criticalCount: result.details.issues.filter(i => i.severity === 'Critical').length,
      highCount: result.details.issues.filter(i => i.severity === 'High').length,
      mediumCount: result.details.issues.filter(i => i.severity === 'Medium').length,
      infoCount: result.details.issues.filter(i => i.severity === 'Info').length,
      issues: result.details.issues
    }));

    // Aggregate issue counts
    const issuesBySeverity = pages.reduce(
      (acc, page) => ({
        critical: acc.critical + page.criticalCount,
        high: acc.high + page.highCount,
        medium: acc.medium + page.mediumCount,
        info: acc.info + page.infoCount
      }),
      { critical: 0, high: 0, medium: 0, info: 0 }
    );

    // Calculate common issues across pages
    const issueMap = new Map<string, {
      description: string;
      count: number;
      severity: string;
      affectedPages: Set<string>;
    }>();

    pages.forEach(page => {
      page.issues.forEach(issue => {
        const key = `${issue.category}-${issue.description}`;
        if (!issueMap.has(key)) {
          issueMap.set(key, {
            description: issue.description,
            count: 0,
            severity: issue.severity,
            affectedPages: new Set()
          });
        }
        const issueData = issueMap.get(key)!;
        issueData.count++;
        issueData.affectedPages.add(page.url);
      });
    });

    const commonIssues = Array.from(issueMap.values())
      .map(issue => ({
        ...issue,
        affectedPages: Array.from(issue.affectedPages)
      }))
      .sort((a, b) => b.count - a.count);

    // Calculate issues by category
    const issuesByCategory = pages.reduce((acc, page) => {
      page.issues.forEach(issue => {
        acc[issue.category] = (acc[issue.category] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return {
      domain,
      pagesScanned: pages.length,
      totalIssues: pages.reduce((sum, page) => sum + page.issueCount, 0),
      issuesBySeverity,
      issuesByCategory,
      pages,
      commonIssues
    };
  });
};