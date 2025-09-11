import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { popupApi } from "@/services/api/owner-sites/popup";
import {
  PopupFormFilters,
  PopUpForm,
  PopupFormData,
} from "@/types/owner-site/popup";

export const usePopups = () => {
  return useQuery({
    queryKey: ["popups"],
    queryFn: popupApi.getPopups,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePopup = (id: number) => {
  return useQuery({
    queryKey: ["popup", id],
    queryFn: () => popupApi.getPopup(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useActivePopup = () => {
  return useQuery({
    queryKey: ["popup", "active"],
    queryFn: popupApi.getActivePopup,
    staleTime: 2 * 60 * 1000, // 2 minutes for active popup
    gcTime: 5 * 60 * 1000,
  });
};

export const useCreatePopup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: popupApi.createPopup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["popups"] });
      queryClient.invalidateQueries({ queryKey: ["popup", "active"] });
    },
  });
};

export const useUpdatePopup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      popupApi.updatePopup(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["popups"] });
      queryClient.invalidateQueries({ queryKey: ["popup", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["popup", "active"] });
    },
  });
};

export const useDeletePopup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: popupApi.deletePopup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["popups"] });
      queryClient.invalidateQueries({ queryKey: ["popup", "active"] });
    },
  });
};

// PopupForm hooks with pagination
export const usePopupForms = (filters?: PopupFormFilters) => {
  return useQuery({
    queryKey: ["popup-forms", filters],
    queryFn: () => popupApi.getPopupForms(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const usePopupForm = (id: number) => {
  return useQuery({
    queryKey: ["popup-form", id],
    queryFn: () => popupApi.getPopupForm(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreatePopupForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: popupApi.createPopupForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["popup-forms"] });
    },
  });
};

export const useUpdatePopupForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PopUpForm }) =>
      popupApi.updatePopupForm(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["popup-forms"] });
      queryClient.invalidateQueries({ queryKey: ["popup-form", variables.id] });
    },
  });
};

export const useDeletePopupForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: popupApi.deletePopupForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["popup-forms"] });
    },
  });
};

// Frontend form submission hook
export const usePopupSubmit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      popupId,
      formData,
    }: {
      popupId: number;
      formData: PopupFormData;
    }) => popupApi.submitForm(popupId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["popup-forms"] });
    },
  });
};
