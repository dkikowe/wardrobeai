import React, { useState } from 'react';
import { Product, Color } from './merch-widget-v2/types';

interface CatalogPageProps {
  products: Product[];
  onSelect: (product: Product, color: Color) => void;
}

const CatalogCard: React.FC<{ product: Product; onSelect: (p: Product, c: Color) => void }> = ({ product, onSelect }) => {
  const [activeColor, setActiveColor] = useState<Color>(product.colors[0]);

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white hover:border-gray-400 hover:shadow-md transition-all flex flex-col group">
      {/* Изображение товара */}
      <div 
        className="aspect-square flex items-center justify-center cursor-pointer mb-4 relative"
        onClick={() => onSelect(product, activeColor)}
      >
        <img 
          src={activeColor.image} 
          alt={product.name} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      {/* Информация и выбор цвета */}
      <div className="mt-auto space-y-4">
        <h3 
          className="text-sm font-medium text-slate-900 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors" 
          onClick={() => onSelect(product, activeColor)}
        >
          {product.name}
        </h3>
        
        {/* Палитра цветов для данной модели */}
        <div className="flex flex-wrap gap-2">
          {product.colors.map((c) => (
            <button
              key={c.id}
              onClick={(e) => {
                e.stopPropagation(); // Чтобы не срабатывал клик по карточке
                setActiveColor(c);
              }}
              title={c.name}
              className={`w-6 h-6 rounded-full border transition-all ${
                activeColor.id === c.id 
                  ? 'ring-1 ring-offset-2 ring-slate-900 border-transparent scale-110' 
                  : 'border-gray-300 hover:border-gray-400 hover:scale-110'
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const CatalogPage: React.FC<CatalogPageProps> = ({ products, onSelect }) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 12; // Показывать по 12 базовых моделей на странице

  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const currentItems = products.slice(
    (page - 1) * itemsPerPage, 
    page * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100">
        
        {/* Шапка каталога */}
        <div className="mb-8 space-y-4">
          <h1 className="text-xl font-medium text-gray-800">
            Выберите товар для примерки
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
              Категория:
            </span>
            <select className="border border-gray-300 rounded-md px-4 py-1.5 text-sm text-gray-700 bg-white outline-none focus:border-gray-400 cursor-pointer">
              <option>Одежда</option>
            </select>
          </div>
        </div>

        {/* Сетка базовых товаров */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
          {currentItems.map((product) => (
            <CatalogCard key={product.id} product={product} onSelect={onSelect} />
          ))}
        </div>

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 text-sm text-gray-700">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="border border-gray-300 px-5 py-2 bg-white text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              &larr; Назад
            </button>
            
            <span className="font-medium">
              Стр. {page} из {totalPages} ({totalItems} шт.)
            </span>
            
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="border-2 border-slate-900 px-5 py-2 bg-white text-slate-900 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              Вперёд &rarr;
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
