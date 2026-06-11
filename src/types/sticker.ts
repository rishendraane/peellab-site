export interface Sticker {
  id: string;
  name: string;
  category: string;
  franchise: string;
  price: number;
  image: string;
  featured?: boolean;
}

export interface CartItem {
  sticker: Sticker;
  quantity: number;
}

export interface Category {
  slug: string;
  label: string;
  icon: string;
  description: string;
  count: string;
  vibeColor: string;
}

export interface Franchise {
  slug: string;
  label: string;
  category: string;
  description: string;
}
