import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { CatalogPage } from './components/CatalogPage';
import { ProductEditor } from './components/ProductEditor';
import { MerchViewer } from './components/MerchViewer';
import { getProductsFromCatalog } from './utils/catalogAdapter';
import { Product, Color } from './components/merch-widget-v2/types';

function AppRoutes() {
  const navigate = useNavigate();
  const products = getProductsFromCatalog();

  const handleStart = () => {
    navigate('/catalog');
  };

  const handleViewer = () => {
    navigate('/viewer');
  };

  const handleSelectProduct = (product: Product, color: Color) => {
    // Передаем id продукта и цвета через state роутера
    navigate(`/editor/${product.id}`, { state: { colorId: color.id } });
  };

  const handleBackToCatalog = () => {
    navigate('/catalog');
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage onStart={handleStart} onViewer={handleViewer} />} />
      
      <Route path="/catalog" element={
        <CatalogPage 
          products={products} 
          onSelect={handleSelectProduct} 
        />
      } />

      <Route path="/editor/:productId" element={
        <ProductEditor 
          products={products}
          onBack={handleBackToCatalog} 
        />
      } />

      <Route path="/viewer" element={
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
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
