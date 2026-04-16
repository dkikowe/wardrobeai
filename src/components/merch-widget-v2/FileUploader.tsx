import React from 'react';
import { UploadCloud, FlipHorizontal, FlipVertical, Trash2 } from 'lucide-react';
import { LogoState } from './types';

interface FileUploaderProps {
  logo: LogoState;
  onLogoChange: (logo: LogoState) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ logo, onLogoChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onLogoChange({ ...logo, url });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-medium text-slate-900 uppercase tracking-widest">Ваш дизайн:</h3>
      
      {!logo.url ? (
        <label className="flex flex-col items-center justify-center w-full h-48 border border-gray-300 border-dashed rounded-2xl cursor-pointer bg-white hover:bg-gray-50 transition-colors group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="w-12 h-12 mb-4 rounded-full bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6 text-slate-900" />
            </div>
            <p className="mb-2 text-sm text-slate-900 font-medium">
              Загрузите логотип
            </p>
            <p className="text-xs text-gray-500 font-light">SVG, PNG, JPG (до 10 МБ)</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept=".svg,.png,.jpg,.jpeg"
            onChange={handleFileChange} 
          />
        </label>
      ) : (
        <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 p-2 flex items-center justify-center">
                <img src={logo.url} alt="Preview" className="max-w-full max-h-full object-contain" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Файл загружен</p>
                <button 
                  onClick={() => onLogoChange({ ...logo, url: null })}
                  className="text-xs text-red-500 hover:text-red-600 mt-1 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Удалить
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-gray-50">
            <div className="space-y-3">
              <div className="flex justify-between text-xs uppercase tracking-widest">
                <span className="text-gray-500 font-medium">Масштаб</span>
                <span className="text-slate-900 font-medium">{logo.scale}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={logo.scale}
                onChange={(e) => onLogoChange({ ...logo, scale: Number(e.target.value) })}
                className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-slate-900"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => onLogoChange({ ...logo, flipH: !logo.flipH })}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors border ${
                  logo.flipH ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <FlipHorizontal className="w-4 h-4" />
                Отразить по X
              </button>
              <button
                onClick={() => onLogoChange({ ...logo, flipV: !logo.flipV })}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors border ${
                  logo.flipV ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <FlipVertical className="w-4 h-4" />
                Отразить по Y
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
