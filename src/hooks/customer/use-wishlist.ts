"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/hooks/customer/use-auth";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "@/services/api/customer/wishlist";
import { WishlistItem } from "@/types/customer/wishlist";

const getLocalWishlist = (): WishlistItem[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("nepdora_wishlist");
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
};

const saveLocalWishlist = (items: WishlistItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("nepdora_wishlist", JSON.stringify(items));
  }
};

export const useWishlist = () => {
  const { isAuthenticated } = useAuth();

  return useQuery<WishlistItem[], Error>({
    queryKey: ["wishlist"],
    queryFn: async () => {
      if (isAuthenticated) {
        return getWishlist();
      } else {
        return getLocalWishlist();
      }
    },
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: async (product: any) => {
      if (isAuthenticated) {
        const productId = typeof product === "number" ? product : product.id;
        return addToWishlist({ productId });
      } else {
        if (typeof product === "number") {
          throw new Error("Full product object is required for local wishlist");
        }

        const localItems = getLocalWishlist();
        if (localItems.some(item => item.product.id === product.id)) {
          return localItems.find(
            item => item.product.id === product.id
          ) as WishlistItem;
        }

        const newItem: WishlistItem = {
          id: Date.now(), // Create a pseudo ID for local storage
          user: 0,
          product: product,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const newItems = [...localItems, newItem];
        saveLocalWishlist(newItems);
        return newItem;
      }
    },
    onSuccess: newItem => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Added to Wishlist", {
        description: `${
          newItem?.product?.name || "Item"
        } has been added to your wishlist.`,
      });
    },
    onError: error => {
      toast.error("Error", {
        description: "Could not add item to wishlist. Please try again.",
      });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: async (wishlistItemId: number) => {
      if (isAuthenticated) {
        return removeFromWishlist({ wishlistItemId });
      } else {
        const localItems = getLocalWishlist();
        const newItems = localItems.filter(item => item.id !== wishlistItemId);
        saveLocalWishlist(newItems);
        return;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Removed from Wishlist", {
        description: "The item has been removed from your wishlist.",
      });
    },
    onError: error => {
      toast.error("Error", {
        description: "Could not remove item from wishlist. Please try again.",
      });
    },
  });
};
