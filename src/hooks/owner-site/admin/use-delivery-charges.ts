import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deliveryChargesApi } from "@/services/api/owner-sites/admin/delivery-charges";
import {
  UpdateDeliveryChargeRequest,
  DefaultDeliveryCharge,
  CreateDeliveryChargeRequest,
} from "@/types/owner-site/admin/delivery-charges";

export const DELIVERY_CHARGES_KEYS = {
  all: ["delivery-charges"] as const,
  default: () => [...DELIVERY_CHARGES_KEYS.all, "default"] as const,
  list: (page: number, page_size: number, search?: string) =>
    [...DELIVERY_CHARGES_KEYS.all, "list", page, page_size, search] as const,
  detail: (id: number) => [...DELIVERY_CHARGES_KEYS.all, "detail", id] as const,
};

// Get default delivery charges
export const useDefaultDeliveryCharges = () => {
  return useQuery({
    queryKey: DELIVERY_CHARGES_KEYS.default(),
    queryFn: deliveryChargesApi.getDefaultDeliveryCharges,
  });
};

// Update default delivery charges
export const useUpdateDefaultDeliveryCharges = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Omit<DefaultDeliveryCharge, "id" | "location_name" | "is_default">;
    }) => deliveryChargesApi.updateDefaultDeliveryCharges(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DELIVERY_CHARGES_KEYS.default(),
      });
    },
  });
};

// Get all delivery charges with pagination and search
export const useDeliveryCharges = (
  page: number = 1,
  page_size: number = 50,
  search?: string
) => {
  return useQuery({
    queryKey: DELIVERY_CHARGES_KEYS.list(page, page_size, search),
    queryFn: () =>
      deliveryChargesApi.getDeliveryCharges(page, page_size, search),
    placeholderData: previousData => previousData,
  });
};

// Load default values
export const useLoadDefaultValues = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deliveryChargesApi.loadDefaultValues,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DELIVERY_CHARGES_KEYS.all,
      });
    },
  });
};

// Update delivery charge
export const useUpdateDeliveryCharge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateDeliveryChargeRequest) =>
      deliveryChargesApi.updateDeliveryCharge(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DELIVERY_CHARGES_KEYS.all,
      });
    },
  });
};

// Create new delivery charge
export const useCreateDeliveryCharge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDeliveryChargeRequest) =>
      deliveryChargesApi.createDeliveryCharge(data),
    onSuccess: () => {
      // Invalidate all delivery charges queries to reflect the new data
      queryClient.invalidateQueries({
        queryKey: DELIVERY_CHARGES_KEYS.all,
      });
    },
    onError: (error: Error) => {
      console.error("Failed to create delivery charge:", error);
    },
  });
};

// Get delivery charge by ID
export const useDeliveryCharge = (id: number) => {
  return useQuery({
    queryKey: DELIVERY_CHARGES_KEYS.detail(id),
    queryFn: () =>
      deliveryChargesApi.getDeliveryCharges(1, 50).then(response => {
        const charge = response.results.find(item => item.id === id);
        if (!charge) {
          throw new Error("Delivery charge not found");
        }
        return charge;
      }),
    enabled: !!id,
  });
};
