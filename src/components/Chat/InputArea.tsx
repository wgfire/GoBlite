import React, { useState, useRef, ChangeEvent } from 'react';
import { UploadedFile } from './types';
import { FiSend, FiUpload, FiZap, FiFile, FiX } from 'react-icons/fi';

interface InputAreaProps {
  onSend: (prompt: string, files: UploadedFile[]) => void;
  onOptimizePrompt: (prompt: string) => Promise<string>;
  isSending: boolean;
  uploadedFiles: UploadedFile[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
}

const InputArea: React.FC<InputAreaProps> = ({
  onSend,
  onOptimizePrompt,
  isSending,
  uploadedFiles,
  setUploadedFiles
}) => {
  const [prompt, setPrompt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.previewUrl) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const handleSend = () => {
    if (!prompt.trim() && uploadedFiles.length === 0) return;
    onSend(prompt, uploadedFiles);
    setPrompt('');
    setUploadedFiles([]);
  };

  const handleOptimize = async () => {
    if (!prompt.trim()) return;
    setIsOptimizing(true);
    try {
      const optimized = await onOptimizePrompt(prompt);
      setPrompt(optimized);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="border-t border-gray-700 p-4 bg-gray-800">
      {/* File preview gallery */}
      {uploadedFiles.length > 0 && (
        <div className="flex gap-2 mb-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {uploadedFiles.map(file => (
            <div key={file.id} className="relative flex-shrink-0 w-20 h-20 bg-gray-700 rounded-md overflow-hidden">
              {file.previewUrl ? (
                <img src={file.previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiFile size={24} />
                </div>
              )}
              <button 
                onClick={() => removeFile(file.id)}
                className="absolute top-1 right-1 bg-gray-900 bg-opacity-70 rounded-full p-1 hover:bg-opacity-100"
              >
                <FiX size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-gray-700 text-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          disabled={isSending}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-3 disabled:opacity-50 transition-colors"
        >
          {isSending ? (
            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            <FiSend size={20} />
          )}
        </button>
      </div>

      <div className="flex justify-between mt-2">
        <div className="flex space-x-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
            title="Upload file"
          >
            <FiUpload size={18} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
        </div>
        <button
          onClick={handleOptimize}
          disabled={isOptimizing || !prompt.trim()}
          className="text-yellow-400 hover:text-yellow-300 p-2 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50"
          title="Optimize prompt"
        >
          <FiZap size={18} />
        </button>
      </div>
    </div>
  );
};

export default InputArea;