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

export const GalleryTemplate4: React.FC<GalleryTemplateProps> = ({
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

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="mx-auto text-center text-3xl font-semibold">
          <EditableText
            value={data.title || "Our Latest Creations"}
            onChange={handleTextUpdate("title")}
            isEditable={isEditable}
          />
        </h1>
        <div className="mx-auto mt-2 max-w-lg text-center text-sm text-slate-500">
          <EditableText
            value={
              data.subtitle ||
              "A visual collection of our most recent works - each piece crafted with intention, emotion, and style."
            }
            onChange={handleTextUpdate("subtitle")}
            isEditable={isEditable}
          />
        </div>

        <div className="mx-auto mt-12 flex max-w-5xl flex-wrap items-center justify-center gap-4">
          {filteredImages.map((image: GalleryImage, index: number) => {
            const actualIndex = data.images.findIndex(
              (img: GalleryImage) => img.id === image.id
            );
            return (
              <div
                key={image.id}
                className="relative overflow-hidden rounded-lg"
              >
                <div className="group relative">
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
                  <div className="relative size-56 overflow-hidden rounded-lg">
                    <Image
                      src={getImageUrl(image.image)}
                      alt={image.image_alt_description || "Gallery image"}
                      fill
                      className="object-cover object-top"
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

                <div className="absolute inset-0 flex flex-col justify-end bg-black/50 p-4 text-white opacity-0 transition-all duration-300 hover:opacity-100">
                  {image.title && (
                    <EditableText
                      value={image.title}
                      onChange={(newTitle: string) =>
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
            <div className="flex h-56 w-56 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-gray-400 hover:bg-gray-100">
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
    </>
  );
};
