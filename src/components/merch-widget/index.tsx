import React, { useState } from 'react';
import { mockProducts } from './mockData';
import { ProductViewer } from './ProductViewer';
import { ControlPanel } from './ControlPanel';
import { Product, Color, PlacementZone, LogoState } from './types';

export const MerchWidget: React.FC = () => {
  // Состояния
  const [product, setProduct] = useState<Product>(mockProducts[0]);
  const [color, setColor] = useState<Color>(mockProducts[0].colors[0]);
  const [zone, setZone] = useState<PlacementZone>(mockProducts[0].zones[0]);
  const [view, setView] = useState<'front' | 'back'>('front');
  
  const [logo, setLogo] = useState<LogoState>({
    url: null,
    scale: 100,
    flipH: false,
    flipV: false,
  });

  // При смене товара сбрасываем цвет и зону на дефолтные для этого товара
  const handleProductChange = (newProduct: Product) => {
    setProduct(newProduct);
    setColor(newProduct.colors[0]);
    setZone(newProduct.zones[0]);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Онлайн-примерочная</h1>
        <p className="text-gray-500 mt-2">Создайте свой уникальный корпоративный мерч</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Левая колонка (Зона предпросмотра) */}
        <div className="lg:col-span-7 xl:col-span-8">
          <ProductViewer
            product={product}
            color={color}
            zone={zone}
            logo={logo}
            view={view}
            onViewChange={setView}
            onZoneChange={setZone}
          />
        </div>

        {/* Правая колонка (Панель управления) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <ControlPanel
            products={mockProducts}
            selectedProduct={product}
            selectedColor={color}
            logo={logo}
            onProductChange={handleProductChange}
            onColorChange={setColor}
            onLogoChange={setLogo}
          />
        </div>
      </div>
    </div>
  );
};
