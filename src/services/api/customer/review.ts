import { getApiBaseUrl } from "@/config/site";
import { createHeadersCustomer } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  Review,
  ReviewsResponse,
  CreateReviewData,
  UpdateReviewData,
  ReviewFilters,
} from "@/types/customer/review";

export const reviewsApi = {
  // Get all reviews with optional filters
  getReviews: async (filters?: ReviewFilters): Promise<ReviewsResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const url = `${API_BASE_URL}/api/product-reviews/?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: createHeadersCustomer(),
    });

    await handleApiError(response);
    return response.json();
  },

  // Get reviews for a specific product
  getProductReviews: async (
    productSlug: string,
    filters?: Omit<ReviewFilters, "slug">
  ): Promise<ReviewsResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const params = new URLSearchParams();
    params.append("slug", productSlug);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const url = `${API_BASE_URL}/api/product-reviews/?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: createHeadersCustomer(),
    });

    await handleApiError(response);
    return response.json();
  },

  // Get a single review by ID
  getReview: async (reviewId: number): Promise<Review> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/product-reviews/${reviewId}/`,
      {
        method: "GET",
        headers: createHeadersCustomer(),
      }
    );

    await handleApiError(response);
    return response.json();
  },

  // Create a new review
  createReview: async (reviewData: CreateReviewData): Promise<Review> => {
    const API_BASE_URL = getApiBaseUrl();

    if (
      !reviewData.product_id ||
      reviewData.rating < 1 ||
      reviewData.rating > 5
    ) {
      throw new Error(
        "Invalid review data. Please check your rating and try again."
      );
    }

    const response = await fetch(`${API_BASE_URL}/api/product-reviews/`, {
      method: "POST",
      headers: createHeadersCustomer(),
      body: JSON.stringify(reviewData),
    });

    await handleApiError(response);
    return response.json();
  },

  // Update an existing review
  updateReview: async (
    reviewId: number,
    reviewData: UpdateReviewData
  ): Promise<Review> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(
      `${API_BASE_URL}/api/product-reviews/${reviewId}/`,
      {
        method: "PATCH",
        headers: createHeadersCustomer(),
        body: JSON.stringify(reviewData),
      }
    );

    await handleApiError(response);
    return response.json();
  },

  // Delete a review
  deleteReview: async (reviewId: number): Promise<void> => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(
      `${API_BASE_URL}/api/product-reviews/${reviewId}/`,
      {
        method: "DELETE",
        headers: createHeadersCustomer(),
      }
    );

    await handleApiError(response);
  },
};
