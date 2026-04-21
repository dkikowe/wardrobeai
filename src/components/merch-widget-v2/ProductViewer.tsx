import React from 'react';
import { Product, Color, PlacementZone, LogoState } from './types';

interface ProductViewerProps {
  product: Product;
  color: Color;
  zone: PlacementZone;
  logo: LogoState;
  view: 'front' | 'back';
}

export const ProductViewer: React.FC<ProductViewerProps> = ({
  product,
  color,
  zone,
  logo,
  // view, // Убрали неиспользуемую переменную для фикса ошибки TS
}) => {
  // Поскольку в API у нас только одно фото на вариант, используем его для обоих ракурсов
  const imageSrc = color.image || product.imageFront || '';

  return (
    <div className="w-full flex justify-center mb-12">
      <div className="relative w-full max-w-2xl aspect-[4/5] bg-white flex items-center justify-center overflow-hidden">
        {/* Изображение товара (теперь берется реальное фото выбранного цвета) */}
        <img
          src={imageSrc}
          alt={`${product.name} - ${color.name}`}
          className="w-full h-full object-contain transition-all duration-500 ease-in-out"
        />

        {/* Слой с логотипом */}
        {logo.url && (
          <div
            className="absolute border border-dashed border-gray-300/50 pointer-events-none transition-all duration-300"
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
