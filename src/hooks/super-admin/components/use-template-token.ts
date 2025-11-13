import { useMutation } from "@tanstack/react-query";
import {
  templateTokenApi,
  TemplateTokenRequest,
} from "@/services/api/super-admin/components/template-token";

export const useTemplateToken = () => {
  return useMutation({
    mutationFn: (payload: TemplateTokenRequest) =>
      templateTokenApi.verifyTemplate(payload.client_id),
  });
};
