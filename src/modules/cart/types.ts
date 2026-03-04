export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  wholesalePrice: number;
  quantity: number;
  unit: string;
  maxStock: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}
