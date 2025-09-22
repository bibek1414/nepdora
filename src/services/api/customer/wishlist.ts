import { getApiBaseUrl } from "@/config/site";
import { createHeadersCustomer } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import { WishlistItem } from "@/types/customer/wishlist";

export const getWishlist = async (): Promise<WishlistItem[]> => {
  try {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/wishlist/`, {
      headers: createHeadersCustomer(),
    });

    await handleApiError(response);
    return response.json();
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while fetching wishlist.");
  }
};

export const addToWishlist = async ({
  productId,
}: {
  productId: number;
}): Promise<WishlistItem> => {
  try {
    // Add validation to ensure productId is provided and is a number
    if (!productId || typeof productId !== "number") {
      throw new Error("Product ID is required and must be a number");
    }

    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/wishlist/`, {
      method: "POST",
      headers: createHeadersCustomer(),
      body: JSON.stringify({ product_id: productId }),
    });

    await handleApiError(response);
    return response.json();
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while adding to wishlist.");
  }
};

export const removeFromWishlist = async ({
  wishlistItemId,
}: {
  wishlistItemId: number;
}): Promise<void> => {
  try {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(
      `${API_BASE_URL}/api/wishlist/${wishlistItemId}/`,
      {
        method: "DELETE",
        headers: createHeadersCustomer(),
      }
    );

    await handleApiError(response);

    // Check for 204 No Content response
    if (response.status !== 204) {
      throw new Error("Unexpected response status when removing from wishlist");
    }
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      "An unexpected error occurred while removing from wishlist."
    );
  }
};
