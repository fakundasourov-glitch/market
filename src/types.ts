export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  altText: string;
  description: string;
  dimensions?: string;
  materials?: string;
  inStock: boolean;
  stockCount: number;
  sku: string;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  date: string;
  status: 'Pending' | 'Sent via WhatsApp' | 'Confirmed' | 'Delivered' | 'Cancelled';
  notes?: string;
}

export interface StoreSettings {
  storeName: string;
  whatsappNumber: string; // e.g. "1234567890" or "447123456789"
  currencySymbol: string;
  freeShippingThreshold: number;
  shippingFee: number;
  contactEmail: string;
  studioAddress: string;
  businessHours: string;
  welcomeMessage: string;
}

export type ActiveTab = 'catalog' | 'admin' | 'contact';
export type AdminSubTab = 'products' | 'orders' | 'settings' | 'analytics';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  isAnonymous?: boolean;
}
