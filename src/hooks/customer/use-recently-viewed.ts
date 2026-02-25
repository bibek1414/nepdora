import { useState, useEffect } from "react";
import { Product } from "@/types/owner-site/admin/product";

const RECENTLY_VIEWED_KEY = "nepdora_recently_viewed";
const MAX_RECENT = 10;

export const useRecentlyViewed = () => {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
      if (stored) {
        setRecentProducts(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse recently viewed products", e);
    }
  }, []);

  const addRecentlyViewed = (product: Product) => {
    if (!product) return;

    setRecentProducts(prev => {
      // Remove if already exists to move to top
      const filtered = prev.filter(p => p.id !== product.id);

      // Store a lightweight version of the product to save localStorage space
      const lightProduct = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        market_price: product.market_price,
        thumbnail_image: product.thumbnail_image,
        thumbnail_alt_description: product.thumbnail_alt_description,
        stock: product.stock,
        average_rating: product.average_rating,
        reviews_count: product.reviews_count,
        category: product.category,
      } as Product;

      const updated = [lightProduct, ...filtered].slice(0, MAX_RECENT);

      try {
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save recently viewed products", e);
      }

      return updated;
    });
  };

  return { recentProducts, addRecentlyViewed };
};
