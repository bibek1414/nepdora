import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bulkUploadApi } from "@/services/api/owner-sites/admin/bulk-upload";
import { toast } from "sonner";

// Query Keys
export const bulkUploadKeys = {
  all: ["bulk-upload"] as const,
  upload: () => [...bulkUploadKeys.all, "upload"] as const,
  template: () => [...bulkUploadKeys.all, "template"] as const,
};

// Bulk upload products
export const useBulkUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => bulkUploadApi.bulkUpload(file),
    onSuccess: data => {
      // Invalidate products list to refetch after bulk upload
      queryClient.invalidateQueries({ queryKey: ["products"] });

      if (data.success) {
        toast.success(
          `Bulk upload completed!  products imported successfully.`
        );

        if (data.failed && data.failed > 0) {
          toast.warning(
            `${data.failed} products failed to import. Please check the details.`
          );
        }
      }
    },
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to upload products");
    },
  });
};

// Download template
export const useDownloadTemplate = () => {
  return useMutation({
    mutationFn: () => bulkUploadApi.downloadTemplate(),
    onSuccess: blob => {
      // Create a download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `products_template_${new Date().getTime()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Template downloaded successfully!");
    },
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to download template");
    },
  });
};
