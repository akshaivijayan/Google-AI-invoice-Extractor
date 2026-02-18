
import React, { useState, useEffect } from 'react';
import { InvoiceData, ExtractionStatus, FileInfo } from './types';
import { extractInvoiceData } from './services/geminiService';
import FileUpload from './components/FileUpload';
import JsonDisplay from './components/JsonDisplay';
import InvoiceSummary from './components/InvoiceSummary';

const App: React.FC = () => {
  const [status, setStatus] = useState<ExtractionStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<InvoiceData | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [viewMode, setViewMode] = useState<'visual' | 'json'>('visual');

  const handleFileSelect = async (file: File, info: FileInfo) => {
    setStatus('processing');
    setError(null);
    setFileInfo(info);
    setExtractedData(null);

    try {
      let dataToProcess: string;
      const isText = file.type === 'text/plain';

      if (isText) {
        dataToProcess = await file.text();
      } else {
        // Convert to base64 for Gemini API
        dataToProcess = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            // Remove the "data:mime/type;base64," prefix
            resolve(result.split(',')[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      const result = await extractInvoiceData(dataToProcess, file.type, isText);
      setExtractedData(result);
      setStatus('success');
    } catch (err: any) {
      console.error("Extraction error:", err);
      setError(err.message || "An unexpected error occurred during extraction.");
      setStatus('error');
    }
  };

  const resetApp = () => {
    setStatus('idle');
    setError(null);
    setExtractedData(null);
    setFileInfo(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">InvoiceLens AI</h1>
              <p className="text-xs text-zinc-500 font-medium">Gemini 3 Powered Extraction</p>
            </div>
          </div>
          
          {extractedData && (
            <button 
              onClick={resetApp}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Start New Extraction
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-12">
        {status === 'idle' || status === 'error' ? (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Turn Invoices into Insights.</h2>
              <p className="text-xl text-zinc-400">
                Upload your invoices as PDF, image, or text. Our AI will automatically extract every detail into structured JSON format in seconds.
              </p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-red-500 font-semibold text-sm">Extraction Failed</h3>
                  <p className="text-red-400/80 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            <FileUpload onFileSelect={handleFileSelect} isLoading={status === 'processing'} />

            {/* Features Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              {[
                { title: 'Multimodal AI', desc: 'Processes PDF, JPEG, PNG, and plain text documents seamlessly.', icon: '🧠' },
                { title: 'Smart Extraction', desc: 'Identifies line items, tax, vendor info, and payment terms accurately.', icon: '✨' },
                { title: 'Developer Ready', desc: 'Get perfectly validated JSON output for your apps and databases.', icon: '🛠️' },
              ].map((f, i) => (
                <div key={i} className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/50">
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar / File Info */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Document Info
                </h3>
                {fileInfo && (
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-zinc-500 text-xs font-semibold uppercase">Filename</span>
                      <span className="text-zinc-300 font-medium truncate">{fileInfo.name}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-zinc-500 text-xs font-semibold uppercase">Size / Type</span>
                      <span className="text-zinc-300 font-medium">{fileInfo.size} • {fileInfo.type.split('/')[1]?.toUpperCase() || 'TEXT'}</span>
                    </div>
                    {fileInfo.previewUrl && (
                      <div className="mt-4 pt-4 border-t border-zinc-800">
                        <span className="text-zinc-500 text-xs font-semibold uppercase block mb-2">Preview</span>
                        <div className="rounded-xl overflow-hidden border border-zinc-800 aspect-square">
                          <img src={fileInfo.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="bg-gradient-to-br from-indigo-900/20 to-zinc-900 rounded-2xl p-6 border border-indigo-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <span className="text-indigo-400 text-lg">💡</span>
                  </div>
                  <h4 className="text-white font-semibold">Pro Tip</h4>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  The JSON data is perfectly structured according to standard accounting schemas. You can directly import this into systems like Quickbooks, Xero, or custom databases.
                </p>
              </div>
            </div>

            {/* Results Display */}
            <div className="lg:col-span-8 flex flex-col min-h-[600px]">
              <div className="flex items-center justify-between mb-4 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800 self-start">
                <button
                  onClick={() => setViewMode('visual')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'visual' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-zinc-400 hover:text-white'}`}
                >
                  Visual Summary
                </button>
                <button
                  onClick={() => setViewMode('json')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'json' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-zinc-400 hover:text-white'}`}
                >
                  Raw JSON
                </button>
              </div>

              <div className="flex-grow">
                {extractedData && (
                  viewMode === 'visual' ? (
                    <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <InvoiceSummary data={extractedData} />
                    </div>
                  ) : (
                    <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <JsonDisplay data={extractedData} />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm">
            © 2024 InvoiceLens AI. Built with Google Gemini API.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm">API Docs</a>
            <a href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm">Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
