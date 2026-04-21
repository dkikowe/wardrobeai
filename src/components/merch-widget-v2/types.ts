export type Color = {
  id: string;
  name: string;
  hex: string;
  image?: string; // Сделали image опциональным, чтобы починить mockData
};

export type PlacementZone = {
  id: string;
  name: string;
  top: string;
  left: string;
  width: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  colors: Color[];
  zones: PlacementZone[];
  imageFront?: string;
  imageBack?: string;
};

export type LogoState = {
  url: string | null;
  scale: number;
  flipH: boolean;
  flipV: boolean;
};
