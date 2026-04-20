import { useMutation } from "@tanstack/react-query";
import { marketingNepdoraPopupApi } from "@/services/api/marketing/nepdora-popup";
import {
  NepdoraPopupFormData,
  NepdoraPopupSubmission,
} from "@/types/marketing/nepdora-popup";

export const useSubmitNepdoraPopup = () => {
  return useMutation<NepdoraPopupSubmission, Error, NepdoraPopupFormData>({
    mutationFn: marketingNepdoraPopupApi.submit,
  });
};
