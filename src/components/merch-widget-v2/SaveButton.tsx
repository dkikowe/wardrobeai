import React from 'react';

interface SaveButtonProps {
  onClick: () => void;
  price: number;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ onClick, price }) => {
  return (
    <div className="pt-8">
      <button 
        onClick={onClick}
        className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-2xl font-semibold text-sm uppercase tracking-widest transition-all active:scale-[0.99] flex items-center justify-center gap-3"
      >
        <span>Добавить логотип</span>
        <span className="w-1 h-1 rounded-full bg-white/30"></span>
        <span className="font-light">{price.toFixed(2)} RUB</span>
      </button>
    </div>
  );
};
