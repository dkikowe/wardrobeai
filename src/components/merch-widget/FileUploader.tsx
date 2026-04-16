import React from 'react';
import { UploadCloud } from 'lucide-react';

interface FileUploaderProps {
  onUpload: (url: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onUpload }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // В реальности здесь будет загрузка на сервер
      // Для демо используем URL.createObjectURL
      const url = URL.createObjectURL(file);
      onUpload(url);
    }
  };

  return (
    <div className="w-full">
      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-200 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
          <p className="mb-2 text-sm text-gray-700 font-medium">
            Нажмите или перетащите файл
          </p>
          <p className="text-xs text-gray-500">SVG, PNG, JPG (до 10 МБ)</p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept=".svg,.png,.jpg,.jpeg"
          onChange={handleFileChange} 
        />
      </label>
    </div>
  );
};
