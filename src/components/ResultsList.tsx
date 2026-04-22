import React, { useState } from 'react';
import { BookResult } from '../types';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface Props {
  results: BookResult[];
}

export const ResultsList: React.FC<Props> = ({ results }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const text = results
      .map((b, i) => `${i + 1}. ${b.title} - ${b.author}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (results.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mt-8 mb-28">
      <div className="p-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <h2 className="font-bold text-slate-800 text-lg">Libros Identificados</h2>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 text-sm bg-white border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 transition-all font-semibold shadow-sm"
        >
          {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
          {copied ? '¡Copiado!' : 'Copiar lista'}
        </button>
      </div>
      <div className="divide-y divide-slate-100">
        {results.map((book, index) => (
          <div key={book.id} className="p-5 hover:bg-indigo-50/30 transition-colors">
            <div className="flex gap-4">
              <span className="text-indigo-500 font-bold text-lg">{index + 1}</span>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 leading-snug">{book.title}</h3>
                <p className="text-slate-600 mt-1">{book.author}</p>
                {book.sources.length > 0 && (
                  <div className="flex gap-3 mt-3">
                    {book.sources.slice(0, 2).map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <ExternalLink size={12} /> Ver Fuente
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};