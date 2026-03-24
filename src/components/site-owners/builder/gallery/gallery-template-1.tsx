import React, { useState } from "react";
import {
  GalleryData,
  GalleryImage,
} from "@/types/owner-site/components/gallery";
import { ImageEditOverlay } from "@/components/ui/image-edit-overlay";
import { MediaLibraryDialog } from "@/components/ui/media-library-dialog";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { EditableText } from "@/components/ui/editable-text";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2, ZoomIn } from "lucide-react";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import Image from "next/image";

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

  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
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
    const updatedImages = data.images.filter((_: any, idx: number) => idx !== index);
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

  const filteredImages = data.images.filter((img: GalleryImage) => img.is_active);

  const gridClass =
    "grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  return (
    <div className="w-full space-y-8 py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            isEditable={isEditable}
            className="mb-4 text-4xl font-bold"
          />
          {data.subtitle && (
            <EditableText
              value={data.subtitle}
              onChange={handleTextUpdate("subtitle")}
              isEditable={isEditable}
              className="text-lg text-gray-600"
            />
          )}
        </div>

        {/* Gallery Grid */}
        <div className={gridClass}>
          {filteredImages.map((image: GalleryImage, index: number) => {
            const actualIndex = data.images.findIndex(
              (img: GalleryImage) => img.id === image.id
            );
            return (
              <div
                key={image.id}
                className="relative overflow-hidden rounded-lg bg-gray-100 transition-all hover:shadow-xl"
              >
                {/* Image Container */}
                <div className="group relative aspect-square overflow-hidden">
                  <ImageEditOverlay
                    onImageSelect={(imageUrl) =>
                      handleImageUpdateLocal(actualIndex, imageUrl)
                    }
                    imageWidth={800}
                    imageHeight={1000}
                    isEditable={isEditable}
                    folder="gallery-images"
                    label="Change Image"
                  />
                  <div className="relative h-full w-full">
                    <Image
                      src={getImageUrl(image.image)}
                      alt={image.image_alt_description || "Gallery image"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {isEditable && (
                    <div className="absolute top-2 right-2 z-10 flex gap-2">
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
                </div>

                {/* Image Info */}
                <div className="p-4">
                  {image.title && (
                    <EditableText
                      value={image.title}
                      onChange={(newTitle: string) =>
                        handleImageTitleUpdate(actualIndex, newTitle)
                      }
                      isEditable={isEditable}
                      className="font-semibold text-gray-900"
                    />
                  )}
                  {image.description && (
                    <p className="mt-1 text-sm text-gray-600">
                      {image.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add New Image Card */}
          {isEditable && (
            <div className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-gray-400 hover:bg-gray-100">
              <button
                onClick={() => setIsMediaDialogOpen(true)}
                className="flex flex-col items-center gap-2"
              >
                <Plus className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500 font-medium">Add Image</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <MediaLibraryDialog
        open={isMediaDialogOpen}
        onOpenChange={setIsMediaDialogOpen}
        onSelect={(url) => {
          handleAddImage(url);
          setIsMediaDialogOpen(false);
        }}
        folder="gallery-images"
      />

      {/* Lightbox Dialog */}
      {selectedImage && (
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
    </div>
  );
};
