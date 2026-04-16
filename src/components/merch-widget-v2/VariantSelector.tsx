import React from 'react';
import { Product, Color, PlacementZone } from './types';

interface VariantSelectorProps {
  products: Product[];
  selectedProduct: Product;
  selectedColor: Color;
  selectedZone: PlacementZone;
  view: 'front' | 'back';
  onProductChange: (product: Product) => void;
  onColorChange: (color: Color) => void;
  onZoneChange: (zone: PlacementZone) => void;
  onViewChange: (view: 'front' | 'back') => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  products,
  selectedProduct,
  selectedColor,
  selectedZone,
  view,
  onProductChange,
  onColorChange,
  onZoneChange,
  onViewChange,
}) => {
  return (
    <div className="space-y-10">
      {/* Выбор модели */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-slate-900 uppercase tracking-widest">Модель:</h3>
        <div className="flex flex-wrap gap-2">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => onProductChange(p)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedProduct.id === p.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-gray-50 text-slate-600 hover:bg-gray-100'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Выбор цвета */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-slate-900 uppercase tracking-widest">Цвет:</h3>
        <div className="flex flex-wrap gap-6">
          {selectedProduct.colors.map((c) => (
            <button
              key={c.id}
              onClick={() => onColorChange(c)}
              className="group flex flex-col items-center gap-2 focus:outline-none"
            >
              <div
                className={`w-10 h-10 rounded-full border transition-all duration-200 flex items-center justify-center ${
                  selectedColor.id === c.id
                    ? 'ring-1 ring-offset-4 ring-slate-900 border-transparent'
                    : 'border-gray-200 group-hover:border-gray-400'
                }`}
                style={{ backgroundColor: c.hex }}
              />
              <span className={`text-xs font-medium ${selectedColor.id === c.id ? 'text-slate-900' : 'text-gray-500'}`}>
                {c.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Выбор ракурса и зоны */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-slate-900 uppercase tracking-widest">Позиция нанесения:</h3>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-gray-50 p-1 rounded-full">
            <button
              onClick={() => onViewChange('front')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                view === 'front' ? 'bg-white shadow-sm text-slate-900' : 'text-gray-500 hover:text-slate-900'
              }`}
            >
              Спереди
            </button>
            <button
              onClick={() => onViewChange('back')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                view === 'back' ? 'bg-white shadow-sm text-slate-900' : 'text-gray-500 hover:text-slate-900'
              }`}
            >
              Сзади
            </button>
          </div>

          <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

          <div className="flex gap-2">
            {selectedProduct.zones.map((z) => (
              <button
                key={z.id}
                onClick={() => onZoneChange(z)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  selectedZone.id === z.id
                    ? 'border-slate-900 text-slate-900'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {z.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
