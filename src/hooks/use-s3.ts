import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listS3Files, uploadToS3, deleteS3Files, S3File } from "@/utils/s3";
import { toast } from "sonner";

export const s3Keys = {
  all: ["s3"] as const,
  files: (folder: string) => [...s3Keys.all, "files", folder] as const,
};

export function useS3Files(folder: string = "nepdora") {
  return useQuery({
    queryKey: s3Keys.files(folder),
    queryFn: () => listS3Files(folder),
  });
}

export function useUploadS3() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, folder }: { file: File; folder?: string }) =>
      uploadToS3(file, folder),
    onSuccess: (_, { folder = "nepdora" }) => {
      queryClient.invalidateQueries({ queryKey: s3Keys.files(folder) });
    },
    onError: (error) => {
      console.error("S3 upload error:", error);
      toast.error("Failed to upload image");
    },
  });
}

export function useDeleteS3() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (urls: string[]) => deleteS3Files(urls),
    onSuccess: (_, urls) => {
      // Invalidate all S3 file queries since we don't know which folder they belong to easily from just URLs
      // or we can just invalidate the default one if that's what's mostly used.
      queryClient.invalidateQueries({ queryKey: s3Keys.all });
      toast.success("Image(s) deleted successfully");
    },
    onError: (error) => {
      console.error("S3 delete error:", error);
      toast.error("Failed to delete image(s)");
    },
  });
}
