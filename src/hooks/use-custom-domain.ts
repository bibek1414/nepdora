import { useQuery } from "@tanstack/react-query";
import { getCustomDomains } from "@/lib/actions/custom-domain-actions";

export function useCustomDomain() {
  const { data, isLoading } = useQuery({
    queryKey: ["custom-domains"],
    queryFn: async () => {
      const result = await getCustomDomains();
      if (result.success && result.domains) {
        return result.domains;
      }
      return [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Find the first domain that is NOT a system domain (.nepdora.com or .localhost)
  const customDomain = data?.find(
    d =>
      !d.domain.endsWith(".nepdora.com") &&
      !d.domain.endsWith(".localhost") &&
      !d.domain.endsWith(".nepdora.baliyoventures.com")
  );

  return {
    customDomain: customDomain?.domain || null,
    isLoading,
  };
}
