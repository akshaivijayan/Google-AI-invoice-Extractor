
import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
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
    <motion.div
      whileHover={{ scale: 1.02, rotateX: -2, rotateY: 2 }}
      whileTap={{ scale: 0.98 }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isLoading && fileInputRef.current?.click()}
      className={`
        relative border-2 border-dashed rounded-[2.5rem] p-12 transition-all duration-500 cursor-pointer
        flex flex-col items-center justify-center min-h-[350px] preserve-3d
        ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-zinc-900/40 hover:border-white/20'}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        shadow-2xl backdrop-blur-xl
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
      
      <motion.div 
        animate={isDragging ? { scale: 1.2, rotate: 10 } : { scale: 1, rotate: 0 }}
        className="w-24 h-24 bg-indigo-600/10 rounded-3xl flex items-center justify-center mb-8 text-indigo-400 shadow-inner"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </motion.div>
      
      <h3 className="text-3xl font-black mb-4 text-white tracking-tight">Upload Invoice</h3>
      <p className="text-zinc-500 text-center max-w-sm font-medium leading-relaxed">
        Drag and drop your PDF, image, or text file here, or click to browse.
      </p>
      <div className="mt-8 flex gap-3">
        {['PDF', 'JPG', 'PNG', 'TXT'].map(ext => (
          <span key={ext} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-zinc-500 tracking-widest uppercase">
            {ext}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default FileUpload;
