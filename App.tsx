
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  const [progress, setProgress] = useState(0);

  // Simulate progress during extraction
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'processing') {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 15;
        });
      }, 400);
    } else if (status === 'success') {
      setProgress(100);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [status]);

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
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col relative overflow-hidden bg-grid-white">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 preserve-3d">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight tracking-tight">InvoiceLens AI</h1>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Gemini 3 Flash</p>
            </div>
          </motion.div>
          
          <AnimatePresence>
            {extractedData && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={resetApp}
                className="px-4 py-2 text-sm font-semibold text-zinc-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-lg border border-white/10"
              >
                Start New Extraction
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-12 relative z-10 perspective-1000">
        <AnimatePresence mode="wait">
          {status === 'idle' || status === 'error' ? (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, rotateX: 10, y: 20 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, rotateX: -10, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-16">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter text-glow"
                >
                  Invoice Intelligence. <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Redefined.</span>
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl text-zinc-400 leading-relaxed"
                >
                  Upload invoices as PDF, image, or text. Our multimodal AI extracts every detail into structured data in seconds.
                </motion.p>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 backdrop-blur-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-red-500 font-bold text-sm">Extraction Failed</h3>
                    <p className="text-red-400/80 text-sm mt-1">{error}</p>
                  </div>
                </motion.div>
              )}

              <FileUpload onFileSelect={handleFileSelect} isLoading={status === 'processing'} />

              {/* Features Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
                {[
                  { title: 'Multimodal AI', desc: 'Processes PDF, JPEG, PNG, and plain text documents seamlessly.', icon: '🧠' },
                  { title: 'Smart Extraction', desc: 'Identifies line items, tax, vendor info, and payment terms.', icon: '✨' },
                  { title: 'Developer Ready', desc: 'Get perfectly validated JSON output for your apps.', icon: '🛠️' },
                ].map((f, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    whileHover={{ y: -5, rotateX: -5, rotateY: 5 }}
                    className="p-8 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-md preserve-3d shadow-xl"
                  >
                    <div className="text-4xl mb-6">{f.icon}</div>
                    <h3 className="text-white font-bold text-lg mb-3">{f.title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Sidebar / File Info */}
              <div className="lg:col-span-4 space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-2xl"
                >
                  <h3 className="text-white font-black mb-6 flex items-center gap-3 text-lg">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    Document
                  </h3>
                  {fileInfo && (
                    <div className="space-y-6">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Filename</span>
                        <span className="text-zinc-200 font-bold truncate text-sm">{fileInfo.name}</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Size / Type</span>
                        <span className="text-zinc-200 font-bold text-sm">{fileInfo.size} • {fileInfo.type.split('/')[1]?.toUpperCase() || 'TEXT'}</span>
                      </div>
                      {fileInfo.previewUrl && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-6 pt-6 border-t border-white/5"
                        >
                          <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest block mb-4">Preview</span>
                          <div className="rounded-2xl overflow-hidden border border-white/10 aspect-square shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500">
                            <img src={fileInfo.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-indigo-600/20 to-zinc-900/80 backdrop-blur-xl rounded-3xl p-8 border border-indigo-500/20 shadow-2xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                      <span className="text-indigo-400 text-xl">💡</span>
                    </div>
                    <h4 className="text-white font-bold">Pro Insight</h4>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                    The JSON output is schema-validated and ready for direct integration into your accounting workflows or ERP systems.
                  </p>
                </motion.div>
              </div>

              {/* Results Display */}
              <div className="lg:col-span-8 flex flex-col min-h-[600px]">
                <div className="flex items-center justify-between mb-6 bg-zinc-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/5 self-start shadow-xl">
                  <button
                    onClick={() => setViewMode('visual')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === 'visual' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Visual Summary
                  </button>
                  <button
                    onClick={() => setViewMode('json')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === 'json' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Raw JSON
                  </button>
                </div>

                <div className="flex-grow">
                  {extractedData && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="h-full"
                    >
                      {viewMode === 'visual' ? (
                        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-10 border border-white/5 shadow-2xl">
                          <InvoiceSummary data={extractedData} />
                        </div>
                      ) : (
                        <div className="h-full">
                          <JsonDisplay data={extractedData} />
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Processing Overlay with Progress Bar */}
      <AnimatePresence>
        {status === 'processing' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/80 backdrop-blur-xl"
          >
            <div className="max-w-md w-full px-8 text-center">
              <motion.div 
                animate={{ 
                  rotateY: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotateY: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity }
                }}
                className="w-24 h-24 bg-indigo-600 rounded-3xl mx-auto mb-10 flex items-center justify-center shadow-2xl shadow-indigo-500/40 preserve-3d"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </motion.div>
              
              <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Analyzing Invoice</h3>
              <p className="text-zinc-400 mb-10 font-medium">Gemini is identifying line items and vendor details...</p>
              
              <div className="relative h-3 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 to-purple-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-20 h-full animate-shimmer" />
              </div>
              <div className="mt-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-500">
                <span>Processing</span>
                <span className="text-indigo-400">{Math.round(progress)}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-zinc-950/50 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-zinc-500 text-sm font-medium">
              © 2024 InvoiceLens AI. Built with Google Gemini 3 Flash.
            </p>
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
              Enterprise Grade Extraction
            </p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-zinc-500 hover:text-indigo-400 transition-colors text-xs font-bold uppercase tracking-widest">Privacy</a>
            <a href="#" className="text-zinc-500 hover:text-indigo-400 transition-colors text-xs font-bold uppercase tracking-widest">API Docs</a>
            <a href="#" className="text-zinc-500 hover:text-indigo-400 transition-colors text-xs font-bold uppercase tracking-widest">Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
