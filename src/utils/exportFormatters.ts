import Papa from 'papaparse';
import { DomainAggregateReport } from '../types/aggregate';

export const formatForCSV = (domainReports: DomainAggregateReport[]): string => {
  // Create arrays for different CSV sheets
  const domainSummary = domainReports.map(report => ({
    Domain: report.domain,
    'Pages Scanned': report.pagesScanned,
    'Total Issues': report.totalIssues,
    'Critical Issues': report.issuesBySeverity.critical,
    'High Issues': report.issuesBySeverity.high,
    'Medium Issues': report.issuesBySeverity.medium,
    'Info Issues': report.issuesBySeverity.info
  }));

  const pageDetails = domainReports.flatMap(report =>
    report.pages.map(page => ({
      Domain: report.domain,
      URL: page.url,
      'Total Issues': page.issueCount,
      'Critical Issues': page.criticalCount,
      'High Issues': page.highCount,
      'Medium Issues': page.mediumCount,
      'Info Issues': page.infoCount
    }))
  );

  const allIssues = domainReports.flatMap(report =>
    report.pages.flatMap(page =>
      page.issues.map(issue => ({
        Domain: report.domain,
        URL: page.url,
        Category: issue.category,
        Description: issue.description,
        Severity: issue.severity,
        Location: issue.location.humanReadable,
        'WCAG Guidelines': issue.documentation?.guidelines
          ?.map(g => g.name)
          .join('; ') || ''
      }))
    )
  );

  return {
    domainSummary: Papa.unparse(domainSummary),
    pageDetails: Papa.unparse(pageDetails),
    allIssues: Papa.unparse(allIssues)
  };
};

export const formatForPDF = (domainReports: DomainAggregateReport[]): any[] => {
  return domainReports.map(report => ({
    title: `Accessibility Report for ${report.domain}`,
    content: [
      {
        text: `Domain: ${report.domain}`,
        style: 'header'
      },
      {
        text: 'Summary',
        style: 'subheader'
      },
      {
        columns: [
          {
            width: '50%',
            text: [
              `Pages Scanned: ${report.pagesScanned}\n`,
              `Total Issues: ${report.totalIssues}\n`
            ]
          },
          {
            width: '50%',
            text: [
              'Issues by Severity:\n',
              `Critical: ${report.issuesBySeverity.critical}\n`,
              `High: ${report.issuesBySeverity.high}\n`,
              `Medium: ${report.issuesBySeverity.medium}\n`,
              `Info: ${report.issuesBySeverity.info}\n`
            ]
          }
        ]
      },
      {
        text: 'Common Issues',
        style: 'subheader',
        margin: [0, 20, 0, 10]
      },
      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto'],
          body: [
            ['Issue', 'Severity', 'Affected Pages'],
            ...report.commonIssues.map(issue => [
              issue.description,
              issue.severity,
              issue.affectedPages.length.toString()
            ])
          ]
        }
      },
      {
        text: 'Page Details',
        style: 'subheader',
        margin: [0, 20, 0, 10]
      },
      ...report.pages.map(page => ({
        margin: [0, 0, 0, 10],
        stack: [
          { text: page.url, style: 'url' },
          {
            columns: [
              {
                width: 'auto',
                text: [
                  `Critical: ${page.criticalCount}\n`,
                  `High: ${page.highCount}\n`
                ]
              },
              {
                width: 'auto',
                text: [
                  `Medium: ${page.mediumCount}\n`,
                  `Info: ${page.infoCount}\n`
                ]
              }
            ]
          }
        ]
      }))
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      url: {
        fontSize: 12,
        bold: true,
        color: 'blue'
      }
    }
  }));
};