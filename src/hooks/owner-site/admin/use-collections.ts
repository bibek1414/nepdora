import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { collectionAPI } from "@/services/api/owner-sites/admin/collection";
import {
  Collection,
  Collections,
  CollectionData,
  CollectionDataListResponse,
  CreateCollectionDataInput,
  CreateCollectionInput,
  UpdateCollectionDataInput,
  UpdateCollectionInput,
} from "@/types/owner-site/admin/collection";

// Collection Hooks
export const useCollections = () => {
  return useQuery<Collections, Error>({
    queryKey: ["collections"],
    queryFn: () => collectionAPI.getCollections(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCollection = (slug: string) => {
  return useQuery<Collection, Error>({
    queryKey: ["collection", slug],
    queryFn: () => collectionAPI.getCollection(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collectionData: CreateCollectionInput) =>
      collectionAPI.createCollection(collectionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      slug,
      collectionData,
    }: {
      slug: string;
      collectionData: UpdateCollectionInput;
    }) => collectionAPI.updateCollection(slug, collectionData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.invalidateQueries({
        queryKey: ["collection", variables.slug],
      });
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => collectionAPI.deleteCollection(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });
};

// Collection Data Hooks
export const useCollectionData = (
  slug: string,
  filters?: Record<string, string>
) => {
  return useQuery<CollectionDataListResponse, Error>({
    queryKey: ["collection-data", slug, filters],
    queryFn: () => collectionAPI.getCollectionData(slug, filters),
    enabled: !!slug,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCollectionDataItem = (slug: string, id: number) => {
  return useQuery<CollectionData, Error>({
    queryKey: ["collection-data-item", slug, id],
    queryFn: () => collectionAPI.getCollectionDataItem(slug, id),
    enabled: !!slug && !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useCreateCollectionData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      slug,
      dataInput,
    }: {
      slug: string;
      dataInput: CreateCollectionDataInput;
    }) => collectionAPI.createCollectionData(slug, dataInput),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["collection-data", variables.slug],
      });
    },
  });
};

export const useUpdateCollectionData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      slug,
      id,
      dataInput,
    }: {
      slug: string;
      id: number;
      dataInput: UpdateCollectionDataInput;
    }) => collectionAPI.updateCollectionData(slug, id, dataInput),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["collection-data", variables.slug],
      });
      queryClient.invalidateQueries({
        queryKey: ["collection-data-item", variables.slug, variables.id],
      });
    },
  });
};

export const useDeleteCollectionData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, id }: { slug: string; id: number }) =>
      collectionAPI.deleteCollectionData(slug, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["collection-data", variables.slug],
      });
    },
  });
};

// Booking Collection Data Hook (specific to booking collection)
export const useBookingData = (filters?: Record<string, string>) => {
  return useCollectionData("booking", filters);
};

// Tour Bookings Collection Data Hook (specific to tour-bookings collection)
export const useTourBookingsData = (filters?: Record<string, string>) => {
  return useCollectionData("tour-bookings", filters);
};
