import { ISSUE_CATEGORIES, WAVE_API_BASE_URL } from '../config/constants';
import { WaveDocumentation, WebsiteReport } from '../types/wave';
import { formatSelector } from '../utils/selectors';
import { getSeverityLevel } from '../utils/severity';
import { standardizeUrl } from '../utils/url';

export class WaveApiService {
    private static instance: WaveApiService;
    private documentation: WaveDocumentation[] = [];
    private readonly WAVE_API_KEY = import.meta.env.VITE_WAVE_API_KEY;
  
    private constructor() {}
  
    static getInstance(): WaveApiService {
      if (!this.instance) {
        this.instance = new WaveApiService();
      }
      return this.instance;
    }
  
    async fetchDocumentation(): Promise<WaveDocumentation[]> {
      try {
        const response = await fetch(`${WAVE_API_BASE_URL}/docs`);
        if (!response.ok) {
          throw new Error('Failed to fetch documentation');
        }
        this.documentation = await response.json();
        return this.documentation;
      } catch (error) {
        console.error('Error fetching documentation:', error);
        return [];
      }
    }
  
    async testWebsite(url: string): Promise<WebsiteReport> {
      const standardizedUrl = standardizeUrl(url);
      const apiUrl = `${WAVE_API_BASE_URL}/request?key=${this.WAVE_API_KEY}&url=${encodeURIComponent(
        standardizedUrl
      )}&format=json&reporttype=4`;
  
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('API request failed');
        }
        const data = await response.json();
  
        if (!data.status.success) {
          throw new Error(data.status.error || 'API returned an error');
        }
  
        return this.processWaveResponse(data, standardizedUrl);
      } catch (error: any) {
        throw new Error(`Failed to test website: ${error?.message}`);
      }
    }
  
    private processWaveResponse(data: any, url: string): WebsiteReport {
      const detailedReport: WebsiteReport = {
        url,
        statistics: {
          totalelements: data.statistics.totalelements,
          pagetitle: data.statistics.pagetitle,
          time: data.statistics.time
        },
        summary: {
          issues: {},
          elements: {}
        },
        details: {
          issues: [],
          elements: []
        }
      };
  
      // Process each category
      for (const [categoryKey, category] of Object.entries<any>(data.categories)) {
        const isIssue = ISSUE_CATEGORIES.includes(categoryKey as 'error' | 'contrast' | 'alert');
        const targetSummary = isIssue ? detailedReport.summary.issues : detailedReport.summary.elements;
        const targetDetails = isIssue ? detailedReport.details.issues : detailedReport.details.elements;
  
        targetSummary[categoryKey] = {
          count: category.count,
          description: category.description
        };
  
        if (category.items) {
          for (const [itemKey, item] of Object.entries<any>(category.items)) {
            const docs = this.documentation.find(doc => doc.name === item.id) || {
              title: item.description,
              type: categoryKey,
              summary: item.description,
              guidelines: []
            };
  
            const locations = item.selectors || [];
            locations.forEach((selector: string) => {
              targetDetails.push({
                category: categoryKey,
                id: itemKey,
                count: item.count,
                description: item.description,
                documentation: docs,
                location: {
                  selector,
                  humanReadable: formatSelector(selector)
                },
                severity: getSeverityLevel(categoryKey),
                ...(item.contrastdata && {
                  contrast: {
                    data: item.contrastdata.map(([ratio, fgColor, bgColor, isLargeText]: [number, string, string, boolean]) => ({
                      ratio,
                      foregroundColor: fgColor,
                      backgroundColor: bgColor,
                      isLargeText
                    }))
                  }
                })
              });
            });
          }
        }
      }
  
      return detailedReport;
    }
  }