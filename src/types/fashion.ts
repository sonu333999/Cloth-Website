export interface FashionCollection {
  id: string;
  name: string;
  category: string;
  description: string;
  editorialStory: string;
  modelImage: string;
  coverImage: string;
  altText: string;
  sortOrder: number;
  featured: boolean;
}

export interface Product {
  id: string;
  collectionId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  sizes: string[];
  colors: string[];
  stock: number;
}

export interface CartItem {
  id: string;
  productId: string;
  collectionId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  collectionId: string;
  name: string;
  price: number;
  image: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItemSummary {
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: string;
  items: OrderItemSummary[];
  totalAmount: number;
  status: OrderStatus;
  createdAt?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: 'subscribed';
  createdAt?: string;
}

export interface BrandSettings {
  brandName: string;
  tagline: string;
}

export type ActivePage = 'home' | 'shop' | 'about' | 'journal' | 'admin';
