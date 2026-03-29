import React, { useState } from "react";
import {
  GalleryBaseData,
  GalleryImage,
} from "@/types/owner-site/components/gallery";
import { ImageEditOverlay } from "@/components/ui/image-edit-overlay";
import { MediaLibraryDialog } from "@/components/ui/media-library-dialog";
import { EditableText } from "@/components/ui/editable-text";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2 } from "lucide-react";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import Image from "next/image";

interface GalleryTemplateProps {
  galleryData: GalleryBaseData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<GalleryBaseData>) => void;
}

export const GalleryTemplate3: React.FC<GalleryTemplateProps> = ({
  galleryData,
  isEditable = false,
  onUpdate,
}) => {
  const { data, setData, handleTextUpdate, handleArrayItemUpdate } =
    useBuilderLogic(galleryData, onUpdate);

  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);

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
    const updatedImages = data.images.filter(
      (_: any, idx: number) => idx !== index
    );
    setData({ ...data, images: updatedImages });
    onUpdate?.({ images: updatedImages });
  };

  const getImageUrl = (image: string | File): string => {
    if (typeof image === "string") return image;
    return URL.createObjectURL(image);
  };

  const filteredImages = data.images.filter(
    (img: GalleryImage) => img.is_active
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-20">
      <EditableText
        value={data.title || "Our Latest Creations"}
        onChange={handleTextUpdate("title")}
        isEditable={isEditable}
        className="mb-2"
        as="h1"
      />
      <EditableText
        value={
          data.subtitle ||
          "A visual collection of our most recent works - each piece crafted with intention, emotion, and style."
        }
        as="p"
        onChange={handleTextUpdate("subtitle")}
        isEditable={isEditable}
      />
      <div className="mx-auto mt-10 flex h-[400px] w-full max-w-7xl items-center gap-2">
        {filteredImages.map((image: GalleryImage, index: number) => {
          const actualIndex = data.images.findIndex(
            (img: GalleryImage) => img.id === image.id
          );
          return (
            <div
              key={image.id}
              className="group relative h-[400px] w-56 grow overflow-hidden rounded-lg transition-all duration-500 hover:w-full"
            >
              {!isEditable ? (
                <Image
                  className="h-full w-full object-cover object-center"
                  src={getImageUrl(image.image)}
                  alt={image.image_alt_description || "Gallery image"}
                  fill
                />
              ) : (
                <div className="h-full w-full">
                  <ImageEditOverlay
                    onImageSelect={imageUrl =>
                      handleImageUpdateLocal(actualIndex, imageUrl)
                    }
                    imageWidth={800}
                    imageHeight={800}
                    isEditable={isEditable}
                    folder="gallery-images"
                    label="Change Image"
                  />
                  <div className="relative h-full w-full">
                    <Image
                      src={getImageUrl(image.image)}
                      alt={image.image_alt_description || "Gallery image"}
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                </div>
              )}
              {isEditable && (
                <div className="absolute right-2 top-2 z-10 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
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
          );
        })}

        {isEditable && (
          <div className="relative flex h-[400px] w-56 grow items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-gray-400 hover:bg-gray-100">
            <button
              onClick={() => setIsMediaDialogOpen(true)}
              className="flex flex-col items-center gap-2"
            >
              <Plus className="h-8 w-8 text-gray-400" />
              <span className="text-sm font-medium text-gray-500">
                Add Image
              </span>
            </button>
          </div>
        )}
      </div>

      <MediaLibraryDialog
        open={isMediaDialogOpen}
        onOpenChange={setIsMediaDialogOpen}
        onSelect={url => {
          handleAddImage(url);
          setIsMediaDialogOpen(false);
        }}
        folder="gallery-images"
      />
    </div>
  );
};
