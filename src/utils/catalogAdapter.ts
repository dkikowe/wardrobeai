import catalogData from '../../catalog.json';
import { Product, Color } from '../components/merch-widget-v2/types';

// Используем прокси для локальной разработки и для продакшена (Vercel), чтобы обойти CORS
const BASE_URL = "/n2b-images";

// Простая эвристика для определения HEX цвета по русскому названию (для кружочков)
const getColorHex = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes('бел') || lower.includes('молочн')) return '#FFFFFF';
  if (lower.includes('черн')) return '#111827';
  if (lower.includes('красн') || lower.includes('бордов') || lower.includes('гранат') || lower.includes('вишнев')) return '#991b1b';
  if (lower.includes('син') || lower.includes('кобальт') || lower.includes('джинс') || lower.includes('navy') || lower.includes('royal')) return '#1d4ed8';
  if (lower.includes('голуб')) return '#38bdf8';
  if (lower.includes('зелен') || lower.includes('лайм') || lower.includes('яблоко') || lower.includes('хаки') || lower.includes('изумруд')) return '#15803d';
  if (lower.includes('желт') || lower.includes('лимон')) return '#eab308';
  if (lower.includes('оранж') || lower.includes('абрикос')) return '#f97316';
  if (lower.includes('фиолет') || lower.includes('лавандов')) return '#7e22ce';
  if (lower.includes('роз') || lower.includes('орхидея') || lower.includes('фуксия') || lower.includes('candy')) return '#db2777';
  if (lower.includes('сер') || lower.includes('меланж') || lower.includes('сталь') || lower.includes('графит')) return '#64748b';
  if (lower.includes('коричн') || lower.includes('шоколад') || lower.includes('терракот')) return '#451a03';
  if (lower.includes('бежев') || lower.includes('песочн')) return '#f5f5dc';
  if (lower.includes('бирюз')) return '#0d9488';
  return '#cccccc'; // По умолчанию серый
};

export const getProductsFromCatalog = (): Product[] => {
  return catalogData.groups.map((group: any, index: number) => {
    const basePrice = parseFloat(group.variants[0]?.prices[0]?.price || '0');
    
    const colors: Color[] = group.variants.map((v: any) => {
      // Извлекаем название цвета (все что после запятой)
      const parts = v.name.split(',');
      const colorName = parts.length > 1 ? parts[1].trim() : v.name;
      return {
        id: v.product_id,
        name: colorName.charAt(0).toUpperCase() + colorName.slice(1),
        hex: getColorHex(colorName),
        image: `${BASE_URL}${v.image}` // Используем реальную картинку
      };
    });

    // Удаляем дубликаты цветов по имени
    const uniqueColors = Array.from(new Map(colors.map(c => [c.name, c])).values());

    return {
      id: `prod-${index}`,
      name: group.base_name,
      price: basePrice,
      colors: uniqueColors,
      zones: [
        { id: 'chest', name: 'Грудь', top: '35%', left: '50%', width: '25%' },
        { id: 'back', name: 'Спина', top: '35%', left: '50%', width: '25%' },
      ]
    };
  });
};
