import React, { useState } from "react";
import {
  GalleryData,
  GalleryImage,
} from "@/types/owner-site/components/gallery";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableText } from "@/components/ui/editable-text";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2 } from "lucide-react";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
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
  const { data, setData, handleTextUpdate, handleArrayItemUpdate } =
    useBuilderLogic(galleryData, onUpdate);

  const [isAddingImage, setIsAddingImage] = useState(false);

  const componentId = React.useId();

  const handleImageUpdateLocal = (
    index: number,
    imageUrl: string,
    altText?: string
  ) => {
    const imgId = data.images[index].id;
    handleArrayItemUpdate(
      "images",
      imgId
    )({
      image: imageUrl,
      image_alt_description: altText,
    });
  };

  const handleImageFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file");
      return;
    }

    setIsAddingImage(true);

    try {
      const imageUrl = await uploadToCloudinary(file, {
        folder: "gallery-images",
        resourceType: "image",
      });

      handleAddImage(imageUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image."
      );
    } finally {
      setIsAddingImage(false);
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
    setData({ ...data, images: updatedImages });
    onUpdate?.({ images: updatedImages });
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = data.images.filter((_, idx) => idx !== index);
    setData({ ...data, images: updatedImages });
    onUpdate?.({ images: updatedImages });
  };

  const getImageUrl = (image: string | File): string => {
    if (typeof image === "string") return image;
    return URL.createObjectURL(image);
  };

  const filteredImages = data.images.filter(img => img.is_active);

  return (
    <div className="w-full py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-left">
          <EditableText
            value={data.title || "Our Latest Creations"}
            onChange={handleTextUpdate("title")}
            isEditable={isEditable}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4"
          />
          <EditableText
            value={
              data.subtitle ||
              "A visual collection of our most recent works - each piece crafted with intention, emotion, and style."
            }
            onChange={handleTextUpdate("subtitle")}
            isEditable={isEditable}
            className="text-lg text-muted-foreground leading-relaxed max-w-3xl"
          />
        </div>

        <div className="flex w-full flex-wrap items-center gap-4">
          {filteredImages.map((image, index) => {
            const actualIndex = data.images.findIndex(img => img.id === image.id);
            return (
              <div
                key={image.id}
                className="group relative h-[450px] w-64 grow overflow-hidden rounded-2xl transition-all duration-700 hover:w-[400px] hover:grow-[2]"
              >
                {!isEditable ? (
                  <img
                    className="h-full w-full object-cover object-center"
                    src={getImageUrl(image.image)}
                    alt={image.image_alt_description}
                  />
                ) : (
                  <div className="h-full w-full [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:object-center [&>div]:relative! [&>div]:h-full [&>div]:w-full">
                    <EditableImage
                      src={getImageUrl(image.image)}
                      alt={image.image_alt_description}
                      onImageChange={(imageUrl, altText) =>
                        handleImageUpdateLocal(actualIndex, imageUrl, altText)
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
                      inputId={`gallery5-upload-${componentId}-${actualIndex}`}
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
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={e => {
                        e.stopPropagation();
                        handleRemoveImage(actualIndex);
                      }}
                      className="h-6 px-2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                {/* Overlay Text */}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {image.title && (
                        <h3 className="text-white text-xl font-bold mb-1">{image.title}</h3>
                    )}
                    {image.description && (
                        <p className="text-white/80 text-sm line-clamp-2">{image.description}</p>
                    )}
                </div>
              </div>
            );
          })}

          {isEditable && (
            <div className="relative flex h-[450px] w-64 grow items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors">
              <label
                htmlFor={`gallery5-add-${componentId}`}
                className="flex cursor-pointer flex-col items-center gap-2"
              >
                {isAddingImage ? (
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="text-sm font-medium">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <Plus className="h-8 w-8 text-gray-400" />
                    <span className="text-sm text-gray-500 font-medium">Add Image</span>
                    <input
                      id={`gallery5-add-${componentId}`}
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageFileChange(e)}
                      className="hidden"
                    />
                  </>
                )}
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
