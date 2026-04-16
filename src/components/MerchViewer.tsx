import React, { useState } from 'react';

const COLORS = [
  '#FFFFFF', // White
  '#000000', // Black
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
];

export const MerchViewer: React.FC = () => {
  const [selectedColorHex, setSelectedColorHex] = useState<string>(COLORS[0]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      {/* Контейнер: чисто белый фон */}
      <div className="relative flex items-center justify-center w-[400px] h-[500px] bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        
        {/* СЛОЙ 1: Сам парень (Полностью, с головой и руками) */}
        {/* Никаких фильтров, просто выводим твою улучшенную фотку */}
        <img 
          src="/model777.png" 
          alt="Model" 
          className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none"
        />

        {/* СЛОЙ 2: Цвет футболки (Обрезается по маске) */}
        {/* Этот слой ложится ПОВЕРХ белой футболки парня. Режим multiply "впитывает" тени парня снизу. */}
        <div 
          className="absolute inset-0 w-full h-full z-20 pointer-events-none transition-colors duration-300"
          style={{ 
            backgroundColor: selectedColorHex,
            mixBlendMode: 'multiply', // Пропускает тени снизу
            WebkitMaskImage: 'url(/maska.png)',
            maskImage: 'url(/maska.png)',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
          }}
        />

        {/* СЛОЙ 3: Логотип (Поверх всего) */}
        {logoUrl && (
          <img 
            src={logoUrl} 
            alt="Uploaded logo" 
            className="absolute z-30 max-w-[120px] max-h-[120px] object-contain pointer-events-none"
            style={{
              top: '35%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
      </div>

      {/* UI: Сетка идеально круглых плашек для переключения цветов */}
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-lg font-medium text-gray-700">Выберите цвет</h3>
        <div className="flex gap-3 flex-wrap justify-center max-w-[300px]">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColorHex(color)}
              className={`w-10 h-10 rounded-full border-2 transition-transform shadow-sm ${
                selectedColorHex === color ? 'border-blue-500 scale-110' : 'border-gray-200 hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Выбрать цвет ${color}`}
            />
          ))}
        </div>
      </div>

      {/* UI: FileUploader для загрузки логотипа */}
      <div className="flex flex-col items-center gap-4 w-full max-w-sm">
        <h3 className="text-lg font-medium text-gray-700">Загрузите логотип</h3>
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Нажмите для загрузки</span> или перетащите файл</p>
            <p className="text-xs text-gray-500">SVG, PNG, JPG или GIF</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleLogoUpload}
          />
        </label>
      </div>
    </div>
  );
};

export default MerchViewer;
