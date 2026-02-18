
import React, { useRef, useState } from 'react';
import { FileInfo } from '../types';

interface FileUploadProps {
  onFileSelect: (file: File, fileInfo: FileInfo) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processFile = async (file: File) => {
    const fileInfo: FileInfo = {
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
    };

    if (file.type.startsWith('image/')) {
      fileInfo.previewUrl = URL.createObjectURL(file);
    } else if (file.type === 'text/plain') {
      const text = await file.text();
      fileInfo.content = text;
    }

    onFileSelect(file, fileInfo);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isLoading && fileInputRef.current?.click()}
      className={`
        relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer
        flex flex-col items-center justify-center min-h-[250px]
        ${isDragging ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]' : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900/50'}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        className="hidden"
        accept="application/pdf,image/*,text/plain"
        disabled={isLoading}
      />
      
      <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-zinc-400 group-hover:text-indigo-400 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      
      <h3 className="text-xl font-semibold mb-2 text-white">Upload Invoice</h3>
      <p className="text-zinc-400 text-center max-w-sm">
        Drag and drop your PDF, image, or text file here, or click to browse.
      </p>
      <p className="mt-4 text-xs text-zinc-500">
        Supports PDF, JPG, PNG, and TXT (Max 10MB)
      </p>

      {isLoading && (
        <div className="absolute inset-0 bg-zinc-950/40 rounded-2xl flex flex-col items-center justify-center backdrop-blur-[2px]">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-sm font-medium text-white">Extracting Data...</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
