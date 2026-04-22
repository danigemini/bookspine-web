import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultsList } from './components/ResultsList';
import { analyzeBooks } from './services/geminiService';
import { BookResult } from './types';
import { Library, Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [results, setResults] = useState<BookResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiKeyExists = !!import.meta.env.VITE_GEMINI_API_KEY;

  const handleAnalyze = async () => {
    if (images.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeBooks(images);
      setResults(data);
    } catch (err: any) {
      setError(err.message || "Error al analizar los libros. Verifica tu conexión y API Key.");
    } finally {
      setLoading(false);
    }
  };

  if (!apiKeyExists) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-red-100 max-w-md text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h1 className="text-xl font-bold text-slate-900 mb-2">Falta API Key</h1>
          <p className="text-slate-600">
            Debes configurar la variable de entorno <code className="bg-slate-100 px-1 rounded text-red-600">VITE_GEMINI_API_KEY</code> en tu archivo .env o en la configuración de tu repositorio.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 h-18 flex items-center gap-3 py-4">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <Library className="text-white" size={26} />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            BookSpine <span className="text-indigo-600">Scanner</span>
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-10">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Tu biblioteca, digitalizada.</h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            Sube una o varias fotos de tus lomos de libros y la IA extraerá los datos automáticamente usando Gemini.
          </p>
        </div>

        <ImageUploader onImagesChange={setImages} />

        {error && (
          <div className="mt-8 p-5 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex gap-4 text-red-800 animate-pulse">
            <AlertCircle className="shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <ResultsList results={results} />
      </main>

      {images.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-bold py-5 px-8 rounded-2xl shadow-2xl hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:bg-slate-400 disabled:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Procesando {images.length} imagen(es)...
                </>
              ) : (
                <>Escanear {images.length} libros ahora</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;