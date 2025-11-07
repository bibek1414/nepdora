import React, { useState } from "react";
import {
  GalleryData,
  GalleryImage,
} from "@/types/owner-site/components/gallery";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableText } from "@/components/ui/editable-text";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2, ZoomIn } from "lucide-react";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

interface GalleryTemplateProps {
  galleryData: GalleryData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<GalleryData>) => void;
}

export const GalleryTemplate4: React.FC<GalleryTemplateProps> = ({
  galleryData,
  isEditable = false,
  onUpdate,
}) => {
  const [data, setData] = useState(galleryData);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const componentId = React.useId();

  const handleTitleUpdate = (newTitle: string) => {
    const updatedData = { ...data, title: newTitle };
    setData(updatedData);
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleUpdate = (newSubtitle: string) => {
    const updatedData = { ...data, subtitle: newSubtitle };
    setData(updatedData);
    onUpdate?.({ subtitle: newSubtitle });
  };

  const handleImageUpdate = (
    index: number,
    imageUrl: string,
    altText?: string
  ) => {
    const updatedImages = [...data.images];
    updatedImages[index] = {
      ...updatedImages[index],
      image: imageUrl,
      image_alt_description:
        altText || updatedImages[index].image_alt_description,
    };
    const updatedData = { ...data, images: updatedImages };
    setData(updatedData);
    onUpdate?.({ images: updatedImages });
  };

  const handleImageFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const imageUrl = await uploadToCloudinary(file, {
        folder: "gallery-images",
        resourceType: "image",
      });

      if (index !== undefined) {
        handleImageUpdate(index, imageUrl, `Gallery image: ${file.name}`);
      } else {
        handleAddImage(imageUrl);
      }

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleAddImage = (imageUrl?: string) => {
    const newImage: GalleryImage = {
      id: Date.now(),
      image:
        imageUrl ||
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      image_alt_description: "New gallery image",
      title: "New Image",
      description: "Add description here",
      category: data.categories[0] || "Uncategorized",
      is_active: true,
    };
    const updatedImages = [...data.images, newImage];
    const updatedData = { ...data, images: updatedImages };
    setData(updatedData);
    onUpdate?.({ images: updatedImages });
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = data.images.filter((_, idx) => idx !== index);
    const updatedData = { ...data, images: updatedImages };
    setData(updatedData);
    onUpdate?.({ images: updatedImages });
  };

  const handleImageTitleUpdate = (index: number, title: string) => {
    const updatedImages = [...data.images];
    updatedImages[index] = { ...updatedImages[index], title };
    const updatedData = { ...data, images: updatedImages };
    setData(updatedData);
    onUpdate?.({ images: updatedImages });
  };

  const getImageUrl = (image: string | File): string => {
    if (typeof image === "string") return image;
    return URL.createObjectURL(image);
  };

  const filteredImages = data.images.filter(img => img.is_active);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="mx-auto text-center text-3xl font-semibold">
          <EditableText
            value={data.title || "Our Latest Creations"}
            onChange={handleTitleUpdate}
            isEditable={isEditable}
          />
        </h1>
        <div className="mx-auto mt-2 max-w-lg text-center text-sm text-slate-500">
          <EditableText
            value={
              data.subtitle ||
              "A visual collection of our most recent works - each piece crafted with intention, emotion, and style."
            }
            onChange={handleSubtitleUpdate}
            isEditable={isEditable}
          />
        </div>

        {isUploading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="flex flex-col items-center gap-2 text-white">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm font-medium">Uploading image...</p>
            </div>
          </div>
        )}

        <div className="mx-auto mt-12 flex max-w-5xl flex-wrap items-center justify-center gap-4">
          {filteredImages.map((image, index) => {
            const actualIndex = data.images.findIndex(
              img => img.id === image.id
            );
            return (
              <div
                key={image.id}
                className="relative overflow-hidden rounded-lg"
              >
                <div className="relative">
                  <EditableImage
                    src={getImageUrl(image.image)}
                    alt={image.image_alt_description}
                    onImageChange={(imageUrl, altText) =>
                      handleImageUpdate(actualIndex, imageUrl, altText)
                    }
                    isEditable={isEditable}
                    className="size-56 object-cover object-top"
                    cloudinaryOptions={{
                      folder: "gallery-images",
                      resourceType: "image",
                    }}
                    disableImageChange={true}
                    showAltEditor={isEditable}
                  />

                  {isEditable && (
                    <div className="absolute top-2 right-2 z-10 flex gap-2">
                      <label
                        htmlFor={`gallery4-upload-${componentId}-${actualIndex}`}
                        className="cursor-pointer rounded-lg bg-white/90 px-2 py-1 text-xs font-medium text-black shadow-lg hover:bg-white"
                      >
                        Change
                      </label>
                      <input
                        id={`gallery4-upload-${componentId}-${actualIndex}`}
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageFileChange(e, actualIndex)}
                        className="hidden"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveImage(actualIndex)}
                        className="h-6 px-2"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="absolute inset-0 flex flex-col justify-end bg-black/50 p-4 text-white opacity-0 transition-all duration-300 hover:opacity-100">
                  {image.title && (
                    <EditableText
                      value={image.title}
                      onChange={newTitle =>
                        handleImageTitleUpdate(actualIndex, newTitle)
                      }
                      isEditable={isEditable}
                      className="text-xl font-medium"
                    />
                  )}
                </div>
              </div>
            );
          })}

          {isEditable && (
            <div className="flex h-56 w-56 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
              <label
                htmlFor={`gallery4-add-${componentId}`}
                className="flex cursor-pointer flex-col items-center gap-2"
              >
                <Plus className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500">Add Image</span>
                <input
                  id={`gallery4-add-${componentId}`}
                  type="file"
                  accept="image/*"
                  onChange={e => handleImageFileChange(e)}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {data.enableLightbox && selectedImage && (
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-4xl">
            <img
              src={getImageUrl(selectedImage.image)}
              alt={selectedImage.image_alt_description}
              className="h-auto w-full rounded-lg"
            />
            {(selectedImage.title || selectedImage.description) && (
              <div className="mt-4">
                {selectedImage.title && (
                  <h3 className="text-xl font-semibold">
                    {selectedImage.title}
                  </h3>
                )}
                {selectedImage.description && (
                  <p className="mt-2 text-gray-600">
                    {selectedImage.description}
                  </p>
                )}
              </div>
            )}
            <DialogClose className="absolute top-2 right-2" />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
