import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsApi } from "@/services/api/customer/review";
import {
  ReviewFilters,
  CreateReviewData,
  UpdateReviewData,
} from "@/types/customer/review";
import { toast } from "sonner";

export const reviewQueryKeys = {
  all: ["reviews"] as const,
  lists: () => [...reviewQueryKeys.all, "list"] as const,
  list: (filters?: ReviewFilters) =>
    [...reviewQueryKeys.lists(), { filters }] as const,
  details: () => [...reviewQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...reviewQueryKeys.details(), id] as const,
  productReviews: (productSlug: string) =>
    [...reviewQueryKeys.all, "product", productSlug] as const,
};

export const useReviews = (filters?: ReviewFilters) => {
  return useQuery({
    queryKey: reviewQueryKeys.list(filters),
    queryFn: () => reviewsApi.getReviews(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useProductReviews = (
  productSlug: string,
  filters?: Omit<ReviewFilters, "slug">
) => {
  return useQuery({
    queryKey: reviewQueryKeys.productReviews(productSlug),
    queryFn: () => reviewsApi.getProductReviews(productSlug, filters),
    enabled: !!productSlug,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useReview = (reviewId: number) => {
  return useQuery({
    queryKey: reviewQueryKeys.detail(reviewId),
    queryFn: () => reviewsApi.getReview(reviewId),
    enabled: !!reviewId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewData) => reviewsApi.createReview(data),
    onSuccess: newReview => {
      queryClient.invalidateQueries({ queryKey: reviewQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: reviewQueryKeys.productReviews(newReview.product.slug),
      });

      toast.success("Your review has been submitted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit review");
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      data,
    }: {
      reviewId: number;
      data: UpdateReviewData;
    }) => reviewsApi.updateReview(reviewId, data),
    onSuccess: updatedReview => {
      queryClient.invalidateQueries({ queryKey: reviewQueryKeys.all });
      queryClient.setQueryData(
        reviewQueryKeys.detail(updatedReview.id),
        updatedReview
      );
      queryClient.invalidateQueries({
        queryKey: reviewQueryKeys.productReviews(updatedReview.product.slug),
      });

      toast.success("Review updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update review");
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: number) => reviewsApi.deleteReview(reviewId),
    onSuccess: (_, reviewId) => {
      queryClient.removeQueries({ queryKey: reviewQueryKeys.detail(reviewId) });
      queryClient.invalidateQueries({ queryKey: reviewQueryKeys.lists() });

      toast.success("Review deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete review");
    },
  });
};

export const useReviewForm = (initialData?: Partial<CreateReviewData>) => {
  const [reviewData, setReviewData] = useState<CreateReviewData>({
    product_id: initialData?.product_id || 0,
    rating: initialData?.rating || 0,
    review: initialData?.review || "",
  });
  const updateReviewData = <K extends keyof CreateReviewData>(
    field: K,
    value: CreateReviewData[K]
  ) => {
    setReviewData(prev => ({
      ...prev,
      [field]: field === "rating" ? Number(value) : value,
    }));
  };

  const resetForm = () => {
    setReviewData({
      product_id: initialData?.product_id || 0,
      rating: initialData?.rating || 0,
      review: initialData?.review || "",
    });
  };

  const isValid = reviewData.rating > 0 && reviewData.rating <= 5;

  return {
    reviewData,
    updateReviewData,
    resetForm,
    isValid,
  };
};
