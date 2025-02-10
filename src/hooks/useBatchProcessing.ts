import { useCallback, useState } from 'react';
import { BatchProcessingStatus } from '../types/batch';
import { WaveApiService } from '../services/waveApi';

export const useBatchProcessing = () => {
    const [batchStatus, setBatchStatus] = useState<BatchProcessingStatus[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
  
    const processBatch = useCallback(async (urls: string[]) => {
      setIsProcessing(true);
      
      // Initialize status for all URLs
      setBatchStatus(urls.map(url => ({
        url,
        status: 'pending'
      })));
  
      // Process in chunks to avoid overwhelming the API
      const CHUNK_SIZE = 3;
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      
      for (let i = 0; i < urls.length; i += CHUNK_SIZE) {
        const chunk = urls.slice(i, i + CHUNK_SIZE);
        
        // Process chunk in parallel
        await Promise.all(chunk.map(async (url, index) => {
          const statusIndex = i + index;
          
          try {
            setBatchStatus(prev => prev.map((status, idx) => 
              idx === statusIndex 
                ? { ...status, status: 'processing' }
                : status
            ));
  
            const result = await WaveApiService.getInstance().testWebsite(url);
            
            setBatchStatus(prev => prev.map((status, idx) => 
              idx === statusIndex 
                ? { ...status, status: 'completed', result }
                : status
            ));
          } catch (error: any) {
            setBatchStatus(prev => prev.map((status, idx) => 
              idx === statusIndex 
                ? { ...status, status: 'failed', error: error?.message }
                : status
            ));
          }
        }));
  
        // Add delay between chunks to respect rate limits
        if (i + CHUNK_SIZE < urls.length) {
          await delay(1000);
        }
      }
  
      setIsProcessing(false);
    }, []);
  
    return {
      batchStatus,
      isProcessing,
      processBatch
    };
  };