import React from 'react';
import { ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onViewer: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onViewer }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex flex-col items-center justify-center text-white font-sans selection:bg-white selection:text-slate-900 px-4 relative overflow-hidden">
      
      {/* Декоративные элементы фона */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
            Создайте свой<br />идеальный мерч
          </h1>
          <p className="text-lg md:text-2xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            Премиальная онлайн-примерочная для вашего бизнеса. Выберите модель из каталога, настройте цвет и добавьте свой логотип.
          </p>
        </div>
        
        <div className="pt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={onStart}
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-full font-semibold text-sm md:text-base uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            <span className="relative z-10 flex items-center gap-3">
              Примерить 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gray-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          </button>
          
          <button 
            onClick={onViewer}
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-transparent border-2 border-white/20 text-white rounded-full font-semibold text-sm md:text-base uppercase tracking-widest overflow-hidden transition-all hover:border-white/50 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-3">
              Тест MerchViewer
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
