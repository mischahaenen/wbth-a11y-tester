import { useEffect, useState } from 'react';
import { WaveDocumentation, WebsiteReport } from '../types/wave';
import { WaveApiService } from '../services/waveApi';

interface UseWaveAnalysisReturn {
  results: WebsiteReport[];
  loading: boolean;
  error: string | null;
  documentation: WaveDocumentation[];
  analyzeWebsites: (urls: string[]) => Promise<void>;
}

export const useWaveAnalysis = (): UseWaveAnalysisReturn => {
  const [results, setResults] = useState<WebsiteReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentation, setDocumentation] = useState<WaveDocumentation[]>([]);

  const waveApi = WaveApiService.getInstance();

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const docs = await waveApi.fetchDocumentation();
        setDocumentation(docs);
      } catch (err) {
        console.error('Failed to fetch WAVE documentation:', err);
      }
    };
    fetchDocs();
  }, []);

  const analyzeWebsites = async (urls: string[]) => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const resultsArray = await Promise.all(
        urls.map(async (url) => {
          try {
            return await waveApi.testWebsite(url);
          } catch (err) {
             console.error('Failed to test website: ', url, 'with error: ', err);
          }
        })
      );
      const filteredResults = resultsArray.filter((result) => result !== undefined);
      setResults(filteredResults);
    } catch (err) {
      setError('Failed to analyze websites');
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, documentation, analyzeWebsites };
};