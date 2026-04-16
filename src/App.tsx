import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { CatalogPage } from './components/CatalogPage';
import { ProductEditor } from './components/ProductEditor';
import { MerchViewer } from './components/MerchViewer';
import { getProductsFromCatalog } from './utils/catalogAdapter';
import { Product, Color } from './components/merch-widget-v2/types';

type AppStep = 'landing' | 'catalog' | 'editor' | 'viewer';

function App() {
  const [step, setStep] = useState<AppStep>('landing');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  
  // Загружаем и адаптируем данные из catalog.json
  const products = getProductsFromCatalog();

  const handleStart = () => {
    setStep('catalog');
  };

  const handleViewer = () => {
    setStep('viewer');
  };

  const handleSelectProduct = (product: Product, color: Color) => {
    setSelectedProduct(product);
    setSelectedColor(color);
    setStep('editor');
  };

  const handleBackToCatalog = () => {
    setStep('catalog');
  };

  const handleBackToLanding = () => {
    setStep('landing');
  };

  return (
    <>
      {step === 'landing' && (
        <LandingPage onStart={handleStart} onViewer={handleViewer} />
      )}
      
      {step === 'catalog' && (
        <CatalogPage 
          products={products} 
          onSelect={handleSelectProduct} 
        />
      )}

      {step === 'editor' && selectedProduct && selectedColor && (
        <ProductEditor 
          key={`${selectedProduct.id}-${selectedColor.id}`}
          product={selectedProduct}
          initialColor={selectedColor}
          onBack={handleBackToCatalog} 
        />
      )}

      {step === 'viewer' && (
        <div className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-8">
            <button
              onClick={handleBackToLanding}
              className="text-sm font-medium text-gray-500 hover:text-slate-900 transition-colors flex items-center gap-2"
            >
              &larr; Назад
            </button>
          </div>
          <MerchViewer />
        </div>
      )}
    </>
  );
}

export default App;
