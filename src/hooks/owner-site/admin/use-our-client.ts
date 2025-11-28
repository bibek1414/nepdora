import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ourClientAPI } from "@/services/api/owner-sites/admin/our-client";
import {
  OurClientFormData,
  OurClientFilters,
  OurClient,
} from "@/types/owner-site/admin/our-client";
import { toast } from "sonner";

export const useGetOurClients = (filters: OurClientFilters = {}) => {
  return useQuery<OurClient[]>({
    queryKey: ["our-clients", filters],
    queryFn: () => ourClientAPI.getOurClients(filters),
  });
};

export const useCreateOurClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: OurClientFormData) => ourClientAPI.createOurClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["our-clients"] });
      toast.success("Client added successfully");
    },
    onError: error => {
      toast.error("Failed to add client");
      console.error("Failed to add client:", error);
    },
  });
};

export const useUpdateOurClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<OurClientFormData>;
    }) => ourClientAPI.updateOurClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["our-clients"] });
      toast.success("Client updated successfully");
    },
    onError: error => {
      toast.error("Failed to update client");
      console.error("Failed to update client:", error);
    },
  });
};

export const useDeleteOurClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ourClientAPI.deleteOurClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["our-clients"] });
      toast.success("Client deleted successfully");
    },
    onError: error => {
      toast.error("Failed to delete client");
      console.error("Failed to delete client:", error);
    },
  });
};
