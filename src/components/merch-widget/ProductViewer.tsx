import React from 'react';
import { Product, Color, PlacementZone, LogoState } from './types';

interface ProductViewerProps {
  product: Product;
  color: Color;
  zone: PlacementZone;
  logo: LogoState;
  view: 'front' | 'back';
  onViewChange: (view: 'front' | 'back') => void;
  onZoneChange: (zone: PlacementZone) => void;
}

export const ProductViewer: React.FC<ProductViewerProps> = ({
  product,
  color,
  zone,
  logo,
  view,
  onViewChange,
  onZoneChange,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {/* Переключатели вида и зон */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
        <div className="flex gap-2">
          <button
            onClick={() => onViewChange('front')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'front' ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Спереди
          </button>
          <button
            onClick={() => onViewChange('back')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'back' ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Сзади
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {product.zones.map((z) => (
            <button
              key={z.id}
              onClick={() => onZoneChange(z)}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                zone.id === z.id ? 'bg-gray-200 text-slate-900' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {z.name}
            </button>
          ))}
        </div>
      </div>

      {/* Окно просмотра */}
      <div 
        className="relative flex-1 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center min-h-[400px] lg:min-h-[600px]"
        style={{ backgroundColor: color.hex === '#FFFFFF' ? '#F8FAFC' : color.hex + '15' }} // Легкий оттенок фона в зависимости от цвета
      >
        {/* Изображение товара */}
        <img
          src={product.image}
          alt={product.name}
          className="max-w-full max-h-full object-contain mix-blend-multiply"
          style={{ 
            filter: color.hex !== '#FFFFFF' ? `opacity(0.9) drop-shadow(0 0 0 ${color.hex})` : 'none' 
          }}
        />

        {/* Слой с логотипом */}
        {logo.url && (
          <div
            className="absolute border border-dashed border-gray-400/50 rounded-sm pointer-events-none"
            style={{
              top: zone.top,
              left: zone.left,
              width: zone.width,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <img
              src={logo.url}
              alt="Ваш дизайн"
              className="w-full h-auto object-contain transition-transform duration-200"
              style={{
                transform: `
                  scale(${logo.scale / 100}) 
                  scaleX(${logo.flipH ? -1 : 1}) 
                  scaleY(${logo.flipV ? -1 : 1})
                `,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
