import React, { useState, useEffect } from 'react';
import { ProductViewer } from './ProductViewer';
import { VariantSelector } from './VariantSelector';
import { FileUploader } from './FileUploader';
import { SaveButton } from './SaveButton';
import { Product, Color, PlacementZone, LogoState } from './types';

interface MerchWidgetV2Props {
  products: Product[];
  initialProduct?: Product;
  initialColor?: Color;
  onBack?: () => void;
}

export const MerchWidgetV2: React.FC<MerchWidgetV2Props> = ({ 
  products, 
  initialProduct,
  initialColor,
  onBack 
}) => {
  const [product, setProduct] = useState<Product>(initialProduct || products[0]);
  const [color, setColor] = useState<Color>(initialColor || (initialProduct ? initialProduct.colors[0] : products[0].colors[0]));
  const [zone, setZone] = useState<PlacementZone>(initialProduct ? initialProduct.zones[0] : products[0].zones[0]);
  const [view, setView] = useState<'front' | 'back'>('front');
  
  const [logo, setLogo] = useState<LogoState>({
    url: null,
    scale: 100,
    flipH: false,
    flipV: false,
  });

  const handleProductChange = (newProduct: Product) => {
    setProduct(newProduct);
    setColor(newProduct.colors[0]);
    setZone(newProduct.zones[0]);
  };

  const handleSave = () => {
    alert('Дизайн сохранен!');
  };

  if (!product) return null;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-slate-200">
      
      {/* Шапка с кнопкой назад */}
      {onBack && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">
          <button 
            onClick={onBack}
            className="text-sm font-medium text-gray-500 hover:text-slate-900 transition-colors flex items-center gap-2"
          >
            &larr; Назад в каталог
          </button>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        
        {/* Зона предпросмотра */}
        <ProductViewer
          product={product}
          color={color}
          zone={zone}
          logo={logo}
          view={view}
        />

        {/* Панель управления (Одноколоночный флоу) */}
        <div className="max-w-xl mx-auto space-y-12">
          
          {/* Титульная группа */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
              {product.name}
            </h1>
            <p className="text-xl font-light text-gray-500">
              {product.price.toFixed(2)} RUB
            </p>
          </div>

          <div className="h-px w-full bg-gray-100" />

          {/* Выбор вариантов (Модель, Цвет, Зона) */}
          <VariantSelector
            products={products}
            selectedProduct={product}
            selectedColor={color}
            selectedZone={zone}
            view={view}
            onProductChange={handleProductChange}
            onColorChange={setColor}
            onZoneChange={setZone}
            onViewChange={setView}
          />

          <div className="h-px w-full bg-gray-100" />

          {/* Загрузка и настройка дизайна */}
          <FileUploader
            logo={logo}
            onLogoChange={setLogo}
          />

          {/* Кнопка сохранения */}
          <SaveButton 
            price={product.price} 
            onClick={handleSave} 
          />
          
        </div>
      </div>
    </div>
  );
};
