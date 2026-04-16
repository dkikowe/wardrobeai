import { Product } from './types';

export const mockProducts: Product[] = [
  {
    id: 'imperial-190',
    name: 'T-Shirt Imperial 190',
    price: 586.00,
    colors: [
      { id: 'white', name: 'White', hex: '#FFFFFF' },
      { id: 'deep-slate', name: 'Deep Slate', hex: '#1e293b' },
      { id: 'crimson', name: 'Crimson', hex: '#991b1b' },
    ],
    zones: [
      { id: 'chest', name: 'Грудь', top: '35%', left: '50%', width: '25%' },
      { id: 'back', name: 'Спина', top: '35%', left: '50%', width: '25%' },
    ],
    imageFront: 'https://placehold.co/800x1000/ffffff/e2e8f0?text=Front+View',
    imageBack: 'https://placehold.co/800x1000/ffffff/e2e8f0?text=Back+View',
  },
  {
    id: 'basic-150',
    name: 'T-Shirt Basic 150',
    price: 420.00,
    colors: [
      { id: 'white', name: 'White', hex: '#FFFFFF' },
      { id: 'black', name: 'Black', hex: '#000000' },
      { id: 'navy', name: 'Navy', hex: '#172554' },
    ],
    zones: [
      { id: 'chest', name: 'Грудь', top: '35%', left: '50%', width: '25%' },
      { id: 'back', name: 'Спина', top: '35%', left: '50%', width: '25%' },
      { id: 'sleeve_l', name: 'Лев. рукав', top: '30%', left: '70%', width: '12%' },
    ],
    imageFront: 'https://placehold.co/800x1000/ffffff/e2e8f0?text=Front+View',
    imageBack: 'https://placehold.co/800x1000/ffffff/e2e8f0?text=Back+View',
  },
  {
    id: 'premium-oversize',
    name: 'Premium Oversize Fit',
    price: 1250.00,
    colors: [
      { id: 'white', name: 'White', hex: '#FFFFFF' },
      { id: 'stone', name: 'Stone', hex: '#d6d3d1' },
      { id: 'charcoal', name: 'Charcoal', hex: '#3f3f46' },
    ],
    zones: [
      { id: 'chest', name: 'Грудь', top: '40%', left: '50%', width: '30%' },
      { id: 'back', name: 'Спина', top: '40%', left: '50%', width: '30%' },
    ],
    imageFront: 'https://placehold.co/800x1000/ffffff/e2e8f0?text=Front+View',
    imageBack: 'https://placehold.co/800x1000/ffffff/e2e8f0?text=Back+View',
  },
];
