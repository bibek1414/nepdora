import React, { useState } from "react";
import {
  GalleryData,
  GalleryImage,
} from "@/types/owner-site/components/gallery";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableText } from "@/components/ui/editable-text";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2, ZoomIn } from "lucide-react";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

interface GalleryTemplateProps {
  galleryData: GalleryData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<GalleryData>) => void;
}

export const GalleryTemplate1: React.FC<GalleryTemplateProps> = ({
  galleryData,
  isEditable = false,
  onUpdate,
}) => {
  const { data, setData, handleTextUpdate, handleArrayItemUpdate } =
    useBuilderLogic(galleryData, onUpdate);

  const [isAddingImage, setIsAddingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

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

  const handleImageTitleUpdate = (index: number, title: string) => {
    const imgId = data.images[index].id;
    handleArrayItemUpdate("images", imgId)({ title });
  };

  const getImageUrl = (image: string | File): string => {
    if (typeof image === "string") return image;
    return URL.createObjectURL(image);
  };

  const filteredImages = data.images.filter(img => img.is_active);

  const gridClass =
    "grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  return (
    <div className="bg-background w-full space-y-12 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            isEditable={isEditable}
            as="h2"
            className="text-foreground mb-4 text-4xl font-bold tracking-tight sm:text-5xl"
            placeholder="Gallery Title"
          />
          {data.subtitle && (
            <EditableText
              value={data.subtitle}
              onChange={handleTextUpdate("subtitle")}
              isEditable={isEditable}
              as="p"
              className="text-muted-foreground text-lg leading-relaxed"
              placeholder="Gallery subtitle..."
            />
          )}
        </div>

        {/* Gallery Grid */}
        <div className={gridClass}>
          {filteredImages.map((image, index) => {
            const actualIndex = data.images.findIndex(
              img => img.id === image.id
            );
            return (
              <div
                key={image.id}
                className="group bg-muted relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image Container */}
                <div
                  className="relative aspect-square cursor-pointer overflow-hidden"
                  onClick={() => !isEditable && setSelectedImage(image)}
                >
                  <EditableImage
                    src={getImageUrl(image.image)}
                    alt={image.image_alt_description}
                    onImageChange={(imageUrl, altText) =>
                      handleImageUpdateLocal(actualIndex, imageUrl, altText)
                    }
                    isEditable={isEditable}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    cloudinaryOptions={{
                      folder: "gallery-images",
                      resourceType: "image",
                    }}
                    disableImageChange={true}
                    showAltEditor={isEditable}
                    inputId={`gallery-upload-${componentId}-${actualIndex}`}
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {!isEditable && (
                      <ZoomIn className="h-8 w-8 text-white drop-shadow-lg" />
                    )}
                  </div>

                  {isEditable && (
                    <div className="absolute top-2 right-2 z-10 flex gap-2">
                      <label
                        htmlFor={`gallery-upload-${componentId}-${actualIndex}`}
                        className="cursor-pointer rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-black shadow-lg transition-colors hover:bg-white"
                      >
                        Change
                      </label>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={e => {
                          e.stopPropagation();
                          handleRemoveImage(actualIndex);
                        }}
                        className="h-7 w-7 rounded-full shadow-lg"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Image Info */}
                <div className="bg-card border-t p-4">
                  {image.title && (
                    <EditableText
                      value={image.title}
                      onChange={newTitle =>
                        handleImageTitleUpdate(actualIndex, newTitle)
                      }
                      isEditable={isEditable}
                      className="text-foreground truncate font-semibold"
                      placeholder="Image Title"
                    />
                  )}
                  {image.description && (
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                      {image.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add New Image Card */}
          {isEditable && (
            <div className="border-muted-foreground/25 bg-muted/50 hover:bg-muted/80 flex aspect-square items-center justify-center rounded-2xl border-2 border-dashed transition-colors">
              <label
                htmlFor={`gallery-add-${componentId}`}
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3 p-4 text-center"
              >
                {isAddingImage ? (
                  <div className="text-muted-foreground flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="text-sm font-medium">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <div className="bg-background rounded-full p-3 shadow-sm">
                      <Plus className="text-primary h-6 w-6" />
                    </div>
                    <span className="text-muted-foreground text-sm font-medium">
                      Add New Image
                    </span>
                    <input
                      id={`gallery-add-${componentId}`}
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

      {/* Lightbox Dialog */}
      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-5xl overflow-hidden border-none bg-transparent p-0 shadow-none sm:max-w-fit">
            <div className="group relative">
              <img
                src={getImageUrl(selectedImage.image)}
                alt={selectedImage.image_alt_description}
                className="mx-auto max-h-[85vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
              />
              <DialogClose className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70">
                <X className="h-5 w-5" />
              </DialogClose>
            </div>

            {(selectedImage.title || selectedImage.description) && (
              <div className="bg-background/90 mx-auto mt-4 max-w-2xl rounded-xl border p-6 shadow-lg backdrop-blur-md">
                {selectedImage.title && (
                  <h3 className="text-foreground mb-2 text-xl font-bold">
                    {selectedImage.title}
                  </h3>
                )}
                {selectedImage.description && (
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedImage.description}
                  </p>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
