import React from 'react';
import { FlipHorizontal, FlipVertical, Trash2 } from 'lucide-react';
import { Product, Color, LogoState } from './types';
import { FileUploader } from './FileUploader';

interface ControlPanelProps {
  products: Product[];
  selectedProduct: Product;
  selectedColor: Color;
  logo: LogoState;
  onProductChange: (product: Product) => void;
  onColorChange: (color: Color) => void;
  onLogoChange: (logo: LogoState) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  products,
  selectedProduct,
  selectedColor,
  logo,
  onProductChange,
  onColorChange,
  onLogoChange,
}) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
      <div className="flex-1 space-y-8">
        
        {/* Блок 1: Выбор товара */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Тип товара</h3>
          <div className="grid grid-cols-3 gap-3">
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => onProductChange(p)}
                className={`p-3 rounded-xl text-sm font-medium transition-all border ${
                  selectedProduct.id === p.id
                    ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Блок 2: Цвет товара */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Цвет</h3>
          <div className="flex flex-wrap gap-3">
            {selectedProduct.colors.map((c) => (
              <button
                key={c.id}
                onClick={() => onColorChange(c)}
                title={c.name}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor.id === c.id
                    ? 'border-slate-900 scale-110 shadow-sm'
                    : 'border-gray-200 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        {/* Блок 3: Ваш дизайн */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Ваш дизайн</h3>
            {logo.url && (
              <button 
                onClick={() => onLogoChange({ ...logo, url: null })}
                className="text-red-500 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors"
                title="Удалить дизайн"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {!logo.url ? (
            <FileUploader onUpload={(url) => onLogoChange({ ...logo, url })} />
          ) : (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 p-2 flex items-center justify-center">
                  <img src={logo.url} alt="Preview" className="max-w-full max-h-full object-contain" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Логотип загружен</p>
                  <p className="text-xs text-gray-500">Настройте отображение ниже</p>
                </div>
              </div>

              {/* Блок 4: Настройки логотипа */}
              <div className="space-y-5 pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">Масштаб</span>
                    <span className="text-slate-900 font-semibold">{logo.scale}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={logo.scale}
                    onChange={(e) => onLogoChange({ ...logo, scale: Number(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => onLogoChange({ ...logo, flipH: !logo.flipH })}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
                      logo.flipH ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <FlipHorizontal className="w-4 h-4" />
                    По горизонтали
                  </button>
                  <button
                    onClick={() => onLogoChange({ ...logo, flipV: !logo.flipV })}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
                      logo.flipV ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <FlipVertical className="w-4 h-4" />
                    По вертикали
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Подвал панели управления */}
      <div className="pt-6 mt-6 border-t border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-500 font-medium">Ориентировочная цена:</span>
          <span className="text-2xl font-bold text-slate-900">{selectedProduct.price} ₽</span>
        </div>
        <button className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-semibold text-lg shadow-md shadow-slate-900/20 transition-all active:scale-[0.98]">
          Сохранить дизайн
        </button>
      </div>
    </div>
  );
};
