import { Product } from "../owner-site/admin/product";

export interface WishlistItem {
  id: number;
  user: number;
  product: Product;
  created_at: string;
  updated_at: string;
}
