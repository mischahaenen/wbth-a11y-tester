import { useState } from 'react'
import './App.css'
import { UrlInput } from './components/UrlInput';
import { ExportButton } from './components/ExportButton';
import { useBatchProcessing } from './types/batch';
import { AccordionItem } from './components/AccordionItem';

export default function App() {
  const [inputUrls, setInputUrls] = useState('');
  const { batchStatus, isProcessing, processBatch } = useBatchProcessing();

  const handleSubmit = () => {
    const urls = inputUrls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url !== '');

    if (urls.length === 0) return;
    processBatch(urls);
  };

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold">Website Accessibility Tester</h1>
      </header>
      
      <UrlInput
        value={inputUrls}
        onChange={setInputUrls}
        onSubmit={handleSubmit}
        disabled={isProcessing}
      />

      {batchStatus.length > 0 && (
        <section className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Results</h2>
            <ExportButton batchStatus={batchStatus} />
          </div>
          
          <div className="space-y-2">
            {batchStatus.map((status, index) => (
              <AccordionItem
                key={`${status.url}-${index}`}
                status={status}
                index={index}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
