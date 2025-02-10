export interface WaveDocumentation {
    name: string;
    title: string;
    type: string;
    summary: string;
    guidelines: Array<{
      name: string;
      link: string;
    }>;
  }
  
  export interface ContrastData {
    ratio: number;
    foregroundColor: string;
    backgroundColor: string;
    isLargeText: boolean;
  }
  
  export interface AccessibilityIssue {
    category: string;
    id: string;
    count: number;
    description: string;
    documentation?: WaveDocumentation;
    location: {
      selector: string;
      humanReadable: string;
    };
    severity: 'Critical' | 'High' | 'Medium' | 'Info';
    contrast?: {
      data: ContrastData[];
    };
  }
  
  export interface WebsiteReport {
    url: string;
    statistics: {
      totalelements: number;
      pagetitle: string;
      time: number;
    };
    summary: {
      issues: Record<string, { count: number; description: string }>;
      elements: Record<string, { count: number; description: string }>;
    };
    details: {
      issues: AccessibilityIssue[];
      elements: any[]; 
    };
    error?: string;
  }