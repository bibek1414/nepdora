import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listS3Files, uploadToS3, deleteS3Files, S3File } from "@/utils/s3";
import { toast } from "sonner";

export const s3Keys = {
  all: ["s3"] as const,
  files: () => [...s3Keys.all, "files"] as const,
};

export function useS3Files() {
  return useQuery({
    queryKey: s3Keys.files(),
    queryFn: () => listS3Files(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUploadS3() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, folder }: { file: File; folder?: string }) =>
      uploadToS3(file, folder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: s3Keys.files() });
    },
    onError: error => {
      console.error("S3 upload error:", error);
      toast.error("Failed to upload image");
    },
  });
}

export function useDeleteS3() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (urls: string[]) => deleteS3Files(urls),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: s3Keys.all });
      toast.success("Image(s) deleted successfully");
    },
    onError: error => {
      console.error("S3 delete error:", error);
      toast.error("Failed to delete image(s)");
    },
  });
}
