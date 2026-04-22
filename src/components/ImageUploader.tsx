import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface Props {
  onImagesChange: (files: File[]) => void;
}

export const ImageUploader: React.FC<Props> = ({ onImagesChange }) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const handleFiles = (newFiles: File[]) => {
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onImagesChange(updatedFiles);

    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Forzado de tipo solicitado para evitar error 'unknown'
    const imageFiles = (Array.from(e.dataTransfer.files) as File[]).filter(
      file => file.type.startsWith('image/')
    );
    handleFiles(imageFiles);
  };

  const removeImage = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    onImagesChange(updatedFiles);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center hover:border-indigo-500 transition-all bg-white cursor-pointer group"
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-slate-400 group-hover:text-indigo-500 transition-colors mb-3" />
        <p className="text-slate-600 font-medium">Arrastra las fotos de los lomos aquí</p>
        <p className="text-slate-400 text-sm mt-1">O haz clic para explorar tus archivos</p>
        <input
          id="fileInput"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(Array.from(e.target.files || []))}
        />
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {previews.map((url, i) => (
            <div key={i} className="relative aspect-square">
              <img src={url} className="w-full h-full object-cover rounded-xl shadow-md" alt="Preview" />
              <button
                onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};