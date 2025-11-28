import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image, { type ImageProps } from "next/image";
import { type Ref, forwardRef } from "react";
import { cn } from "@/lib/utils";
import {
  GalleryData,
  GalleryImage,
} from "@/types/owner-site/components/gallery";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { ZoomIn } from "lucide-react";
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

export const GalleryTemplate3: React.FC<GalleryTemplateProps> = ({
  galleryData,
  isEditable = false,
  onUpdate,
}) => {
  const [data, setData] = useState(galleryData);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const componentId = React.useId();

  useEffect(() => {
    const visibilityTimer = setTimeout(() => setIsVisible(true), 500);
    const animationTimer = setTimeout(() => setIsLoaded(true), 900);
    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(animationTimer);
    };
  }, []);

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

  const activeImages = useMemo(
    () => data.images.filter(img => img.is_active),
    [data.images]
  );

  const displayed = useMemo(() => activeImages.slice(0, 5), [activeImages]);

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  type Position = {
    id: number | string;
    order: number;
    x: string;
    y: string;
    zIndex: number;
    direction: "left" | "right";
  };

  const positions: Position[] = useMemo(() => {
    // Fallback placeholders if fewer than 5 images
    const count = displayed.length;
    const base: Position[] = [
      {
        id: 1,
        order: 0,
        x: "-320px",
        y: "15px",
        zIndex: 5,
        direction: "left",
      },
      {
        id: 2,
        order: 1,
        x: "-160px",
        y: "32px",
        zIndex: 4,
        direction: "left",
      },
      { id: 3, order: 2, x: "0px", y: "8px", zIndex: 3, direction: "right" },
      {
        id: 4,
        order: 3,
        x: "160px",
        y: "22px",
        zIndex: 2,
        direction: "right",
      },
      { id: 5, order: 4, x: "320px", y: "44px", zIndex: 1, direction: "left" },
    ];
    return base
      .slice(0, Math.max(1, count))
      .map((p, idx) => ({ ...p, order: idx }));
  }, [displayed.length]);

  const photoVariants = {
    hidden: () => ({ x: 0, y: 0, rotate: 0, scale: 1 }),
    visible: (custom: { x: string; y: string; order: number }) => ({
      x: custom.x,
      y: custom.y,
      rotate: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 70,
        damping: 12,
        mass: 1,
        delay: custom.order * 0.15,
      },
    }),
  };

  return (
    <div className="w-full space-y-8 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 text-center">
          <EditableText
            value={data.title}
            onChange={handleTitleUpdate}
            isEditable={isEditable}
            className="mb-2 text-4xl font-bold"
          />
          {data.subtitle && (
            <EditableText
              value={data.subtitle}
              onChange={handleSubtitleUpdate}
              isEditable={isEditable}
              className="text-sm text-gray-600"
            />
          )}
        </div>

        <div className="relative mb-8 w-full lg:min-h-[350px]">
          <motion.div
            className="relative mx-auto hidden w-full max-w-7xl justify-center lg:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div
              className="relative flex w-full justify-center"
              variants={containerVariants}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
            >
              <div className="relative h-[220px] w-[220px]">
                {[...displayed].reverse().map((image, idx) => {
                  const pos = positions[idx] ?? positions[positions.length - 1];
                  const actualIndex = data.images.findIndex(
                    img => img.id === image.id
                  );
                  return (
                    <motion.div
                      key={image.id}
                      className="absolute top-0 left-0"
                      style={{ zIndex: pos.zIndex }}
                      variants={photoVariants}
                      custom={{ x: pos.x, y: pos.y, order: pos.order }}
                    >
                      <div className="relative">
                        <PhotoCard
                          image={image}
                          isEditable={isEditable}
                          onOpenLightbox={() => setSelectedImage(image)}
                        />
                        {isEditable && (
                          <div className="absolute top-2 right-2 z-10 flex gap-2">
                            <label
                              htmlFor={`gallery-upload-${componentId}-${actualIndex}`}
                              className="cursor-pointer rounded-lg bg-white/90 px-2 py-1 text-xs font-medium text-black shadow-lg hover:bg-white"
                            >
                              Change
                            </label>
                            <input
                              id={`gallery-upload-${componentId}-${actualIndex}`}
                              type="file"
                              accept="image/*"
                              onChange={e =>
                                handleImageFileChange(e, actualIndex)
                              }
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
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
          <div className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto px-2 py-4 lg:hidden">
            {activeImages.map(image => {
              const actualIndex = data.images.findIndex(
                img => img.id === image.id
              );
              return (
                <div key={image.id} className="relative flex-shrink-0">
                  <PhotoCard
                    image={image}
                    isEditable={isEditable}
                    onOpenLightbox={() => setSelectedImage(image)}
                    size={180}
                    enableHover={!isEditable}
                    enableRandomRotation={false}
                  />
                  {isEditable && (
                    <div className="absolute top-2 right-2 z-10 flex gap-2">
                      <label
                        htmlFor={`gallery-upload-${componentId}-${actualIndex}`}
                        className="cursor-pointer rounded-lg bg-white/90 px-2 py-1 text-xs font-medium text-black shadow-lg hover:bg-white"
                      >
                        Change
                      </label>
                      <input
                        id={`gallery-upload-${componentId}-${actualIndex}`}
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
          </div>
        </div>
      </div>

      {isEditable && (
        <div className="mt-4 text-center">
          <label
            htmlFor={`gallery-add-${componentId}`}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-2 hover:bg-gray-100"
          >
            <Plus className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">Add Image</span>
            <input
              id={`gallery-add-${componentId}`}
              type="file"
              accept="image/*"
              onChange={e => handleImageFileChange(e)}
              className="hidden"
            />
          </label>
        </div>
      )}

      {selectedImage && !isEditable && (
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-4xl">
            <img
              src={getImageUrl(selectedImage.image)}
              alt={selectedImage.image_alt_description}
              className="h-[480px] w-full rounded-lg object-cover"
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

      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center gap-2 text-white">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm font-medium">Uploading image...</p>
          </div>
        </div>
      )}
    </div>
  );
};

function getRandomNumberInRange(min: number, max: number): number {
  if (min >= max) {
    throw new Error("Min value should be less than max value");
  }
  return Math.random() * (max - min) + min;
}

const MotionImage = motion(
  forwardRef(function MotionImage(
    props: ImageProps,
    ref: Ref<HTMLImageElement>
  ) {
    return <Image ref={ref} {...props} />;
  })
);

type Direction = "left" | "right";

const PhotoCard = ({
  image,
  isEditable,
  onOpenLightbox,
  size = 220,
  enableHover = true,
  enableRandomRotation = true,
}: {
  image: GalleryImage;
  isEditable: boolean;
  onOpenLightbox: () => void;
  size?: number;
  enableHover?: boolean;
  enableRandomRotation?: boolean;
}) => {
  const [rotation, setRotation] = useState<number>(0);
  useEffect(() => {
    if (!enableRandomRotation) {
      setRotation(0);
      return;
    }
    const randomRotation =
      getRandomNumberInRange(1, 4) * (Math.random() > 0.5 ? -1 : 1);
    setRotation(randomRotation);
  }, [enableRandomRotation]);

  return (
    <motion.div
      whileHover={
        enableHover
          ? {
              scale: 1.1,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }
          : undefined
      }
      initial={{ rotate: rotation }}
      animate={{ rotate: rotation }}
      transition={{ type: "spring", stiffness: 70, damping: 12, mass: 1 }}
      style={{ width: size, height: size, perspective: 400 }}
      className={cn("relative mx-auto shrink-0")}
      draggable={false}
      tabIndex={0}
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-sm">
        {isEditable ? (
          <EditableImage
            src={getImageUrl(image.image)}
            alt={image.image_alt_description}
            className="h-full w-full rounded-3xl object-cover"
            width={size}
            height={size}
            disableImageChange={true}
            showAltEditor={true}
          />
        ) : (
          <MotionImage
            fill
            src={getImageUrl(image.image)}
            alt={image.image_alt_description}
            className={cn("rounded-3xl object-cover")}
            draggable={false}
            onClick={() => onOpenLightbox()}
          />
        )}
        {!isEditable && (
          <button
            type="button"
            className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity hover:bg-black/40 hover:opacity-100"
            onClick={onOpenLightbox}
          >
            <ZoomIn className="h-6 w-6 text-white" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

function getImageUrl(image: string | File): string {
  if (typeof image === "string") return image;
  return URL.createObjectURL(image);
}
