import { Product } from './types';

export const mockProducts: Product[] = [
  {
    id: 'tshirt',
    name: 'Базовая футболка',
    price: 1500,
    colors: [
      { id: 'white', name: 'Белый', hex: '#FFFFFF' },
      { id: 'black', name: 'Черный', hex: '#111827' },
      { id: 'gray', name: 'Серый меланж', hex: '#9CA3AF' },
    ],
    zones: [
      { id: 'chest', name: 'Грудь', top: '35%', left: '50%', width: '25%' },
      { id: 'back', name: 'Спина', top: '35%', left: '50%', width: '25%' },
      { id: 'sleeve_l', name: 'Левый рукав', top: '30%', left: '70%', width: '12%' },
    ],
    // В реальном проекте здесь будут URL реальных фотографий
    image: 'https://placehold.co/600x800/f8fafc/94a3b8?text=T-Shirt',
  },
  {
    id: 'hoodie',
    name: 'Премиум Худи',
    price: 3500,
    colors: [
      { id: 'black', name: 'Черный', hex: '#111827' },
      { id: 'navy', name: 'Темно-синий', hex: '#1E3A8A' },
      { id: 'sand', name: 'Песочный', hex: '#D4D4D8' },
    ],
    zones: [
      { id: 'chest', name: 'Грудь', top: '40%', left: '50%', width: '30%' },
      { id: 'back', name: 'Спина', top: '45%', left: '50%', width: '30%' },
    ],
    image: 'https://placehold.co/600x800/f8fafc/94a3b8?text=Hoodie',
  },
  {
    id: 'mug',
    name: 'Керамическая кружка',
    price: 500,
    colors: [
      { id: 'white', name: 'Белый', hex: '#FFFFFF' },
      { id: 'black', name: 'Черный', hex: '#111827' },
    ],
    zones: [
      { id: 'center', name: 'По центру', top: '50%', left: '50%', width: '40%' },
    ],
    image: 'https://placehold.co/600x600/f8fafc/94a3b8?text=Mug',
  },
];
