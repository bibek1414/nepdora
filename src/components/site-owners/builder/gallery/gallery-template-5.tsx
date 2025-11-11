import React, { useState } from "react";
import {
  GalleryData,
  GalleryImage,
} from "@/types/owner-site/components/gallery";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableText } from "@/components/ui/editable-text";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2 } from "lucide-react";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { toast } from "sonner";

interface GalleryTemplateProps {
  galleryData: GalleryData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<GalleryData>) => void;
}

export const GalleryTemplate5: React.FC<GalleryTemplateProps> = ({
  galleryData,
  isEditable = false,
  onUpdate,
}) => {
  const [data, setData] = useState(galleryData);
  const [isUploading, setIsUploading] = useState(false);

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

  const getImageUrl = (image: string | File): string => {
    if (typeof image === "string") return image;
    return URL.createObjectURL(image);
  };

  const filteredImages = data.images.filter(img => img.is_active);

  return (
    <>
      <h1 className="mx-auto text-center text-3xl font-semibold">
        <EditableText
          value={data.title || "Our Latest Creations"}
          onChange={handleTitleUpdate}
          isEditable={isEditable}
        />
      </h1>
      <p className="mx-auto mt-2 max-w-lg text-center text-sm text-slate-500">
        <EditableText
          value={
            data.subtitle ||
            "A visual collection of our most recent works - each piece crafted with intention, emotion, and style."
          }
          onChange={handleSubtitleUpdate}
          isEditable={isEditable}
        />
      </p>

      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center gap-2 text-white">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm font-medium">Uploading image...</p>
          </div>
        </div>
      )}

      <div className="mx-auto mt-10 flex h-[400px] w-full max-w-4xl items-center gap-2">
        {filteredImages.map((image, index) => {
          const actualIndex = data.images.findIndex(img => img.id === image.id);
          return (
            <div
              key={image.id}
              className="group relative h-[400px] w-56 flex-grow overflow-hidden rounded-lg transition-all duration-500 hover:w-full"
            >
              {!isEditable ? (
                <img
                  className="h-full w-full object-cover object-center"
                  src={getImageUrl(image.image)}
                  alt={image.image_alt_description}
                />
              ) : (
                <div className="h-full w-full [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:object-center [&>div]:!relative [&>div]:h-full [&>div]:w-full">
                  <EditableImage
                    src={getImageUrl(image.image)}
                    alt={image.image_alt_description}
                    onImageChange={(imageUrl, altText) =>
                      handleImageUpdate(actualIndex, imageUrl, altText)
                    }
                    isEditable={isEditable}
                    className="h-full w-full"
                    width={800}
                    height={800}
                    imageOptimization={{
                      width: 800,
                      height: 800,
                      quality: "auto",
                      format: "auto",
                      crop: "fill",
                    }}
                    cloudinaryOptions={{
                      folder: "gallery-images",
                      resourceType: "image",
                    }}
                    disableImageChange={true}
                    showAltEditor={false}
                  />
                </div>
              )}
              {isEditable && (
                <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <label
                    htmlFor={`gallery5-upload-${componentId}-${actualIndex}`}
                    className="cursor-pointer rounded-lg bg-white/90 px-2 py-1 text-xs font-medium text-black shadow-lg hover:bg-white"
                  >
                    Change
                  </label>
                  <input
                    id={`gallery5-upload-${componentId}-${actualIndex}`}
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
          );
        })}

        {isEditable && (
          <div className="relative flex h-[400px] w-56 flex-grow items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
            <label
              htmlFor={`gallery5-add-${componentId}`}
              className="flex cursor-pointer flex-col items-center gap-2"
            >
              <Plus className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-500">Add Image</span>
              <input
                id={`gallery5-add-${componentId}`}
                type="file"
                accept="image/*"
                onChange={e => handleImageFileChange(e)}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>
    </>
  );
};
