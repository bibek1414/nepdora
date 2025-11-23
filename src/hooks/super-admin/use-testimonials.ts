"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { testimonialsApi } from "@/services/api/super-admin/testimonials";
import { UpdateTestimonialData } from "@/types/owner-site/admin/testimonial";

// Query keys
export const testimonialKeys = {
  all: ["testimonials"] as const,
  lists: () => [...testimonialKeys.all, "list"] as const,
  list: (filters: string) => [...testimonialKeys.lists(), { filters }] as const,
  details: () => [...testimonialKeys.all, "detail"] as const,
  detail: (id: number) => [...testimonialKeys.details(), id] as const,
};

// Main hook to fetch all testimonials
export function useTestimonials() {
  return useQuery({
    queryKey: testimonialKeys.lists(),
    queryFn: testimonialsApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook to fetch a single testimonial by ID
export function useTestimonial(id: number) {
  return useQuery({
    queryKey: testimonialKeys.detail(id),
    queryFn: () => testimonialsApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Mutation hook for creating testimonials
export function useCreateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: testimonialsApi.create,
    onSuccess: () => {
      // Invalidate and refetch testimonials list
      queryClient.invalidateQueries({
        queryKey: testimonialKeys.lists(),
      });
    },
    onError: error => {
      console.error("Create testimonial failed:", error);
    },
  });
}

// Mutation hook for updating testimonials
export function useUpdateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTestimonialData }) =>
      testimonialsApi.update(id, data),
    onSuccess: (data, variables) => {
      // Update the specific testimonial in cache
      queryClient.setQueryData(testimonialKeys.detail(variables.id), data);
      // Invalidate the list to ensure consistency
      queryClient.invalidateQueries({
        queryKey: testimonialKeys.lists(),
      });
    },
    onError: error => {
      console.error("Update testimonial failed:", error);
    },
  });
}

// Mutation hook for deleting testimonials
export function useDeleteTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: testimonialsApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove the testimonial from cache
      queryClient.removeQueries({
        queryKey: testimonialKeys.detail(deletedId),
      });
      // Invalidate the list to ensure consistency
      queryClient.invalidateQueries({
        queryKey: testimonialKeys.lists(),
      });
    },
    onError: error => {
      console.error("Delete testimonial failed:", error);
    },
  });
}
