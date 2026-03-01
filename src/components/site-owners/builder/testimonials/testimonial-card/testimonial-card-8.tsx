import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Testimonial } from "@/types/owner-site/admin/testimonial";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { toast } from "sonner";

const DEFAULT_BACKGROUND = "/fallback/image-not-found.png";

interface TestimonialCard8Props {
  testimonials: Testimonial[];
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  isEditable?: boolean;
  onTitleChange?: (value: string) => void;
  onSubtitleChange?: (value: string) => void;
  onBackgroundChange?: (imageUrl: string) => void;
  onTestimonialClick?: (testimonial: Testimonial) => void;
}

export const TestimonialCard8: React.FC<TestimonialCard8Props> = ({
  testimonials,
  title,
  subtitle,
  backgroundImage,
  isEditable = false,
  onTitleChange,
  onSubtitleChange,
  onBackgroundChange,
  onTestimonialClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUploadingBackground, setIsUploadingBackground] = useState(false);
  const slides = useMemo(() => testimonials || [], [testimonials]);
  const chunkSize = 2;
  const componentId = React.useId();

  const slideGroups = useMemo(() => {
    if (!slides.length) return [];
    const groups: Testimonial[][] = [];
    for (let i = 0; i < slides.length; i += chunkSize) {
      groups.push(slides.slice(i, i + chunkSize));
    }
    return groups;
  }, [slides]);

  useEffect(() => {
    if (slideGroups.length === 0) {
      setCurrentIndex(0);
      return;
    }

    if (currentIndex > slideGroups.length - 1) {
      setCurrentIndex(0);
    }
  }, [slideGroups, currentIndex]);

  const handlePrev = () => {
    if (slideGroups.length === 0) return;
    setCurrentIndex(
      prev => (prev - 1 + slideGroups.length) % slideGroups.length
    );
  };

  const handleNext = () => {
    if (slideGroups.length === 0) return;
    setCurrentIndex(prev => (prev + 1) % slideGroups.length);
  };

  const handleBackgroundFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        `Please select a valid image file (${allowedTypes.join(", ")})`
      );
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setIsUploadingBackground(true);

    try {
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substr(2, 9);
      const uniqueFilename = `testimonial_bg_${timestamp}_${randomId}_${file.name}`;

      const imageUrl = await uploadToCloudinary(file, {
        folder: "testimonial-backgrounds",
        resourceType: "image",
      });

      onBackgroundChange?.(imageUrl);
      toast.success("Background image uploaded successfully!");
    } catch (error) {
      console.error("Background upload failed:", error);
      toast.error("Failed to upload background image. Please try again.");
    } finally {
      setIsUploadingBackground(false);
      event.target.value = "";
    }
  };

  const backgroundSrc = backgroundImage || DEFAULT_BACKGROUND;
  const hasMultipleGroups = slideGroups.length > 1;

  const renderSubtitle = () => {
    if (isEditable) {
      return (
        <EditableText
          value={subtitle || "People are praising us"}
          onChange={value => onSubtitleChange?.(value)}
          as="p"
          className="mb-4 text-lg font-semibold text-indigo-600"
          placeholder="Enter subtitle..."
          isEditable={isEditable}
        />
      );
    }

    if (!subtitle) return null;
    return (
      <p
        className="mb-4 text-lg font-semibold text-indigo-600"
        dangerouslySetInnerHTML={{ __html: subtitle }}
      />
    );
  };

  const renderTitle = () => {
    if (isEditable) {
      return (
        <EditableText
          value={title}
          onChange={value => onTitleChange?.(value)}
          as="h2"
          className="text-4xl font-extrabold text-gray-900 md:text-5xl"
          placeholder="Enter section title..."
          isEditable={isEditable}
        />
      );
    }

    return (
      <h2
        className="text-4xl font-extrabold text-gray-900 md:text-5xl"
        dangerouslySetInnerHTML={{ __html: title }}
      />
    );
  };

  return (
    <section className="relative w-full py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="relative min-h-[600px] w-full overflow-hidden bg-gray-900/60 sm:min-h-[700px] md:min-h-[800px]">
        {/* Background Change Button */}
        {isEditable && (
          <div className="absolute top-3 right-3 z-30 sm:top-4 sm:right-4 md:top-6 md:right-6">
            <label
              htmlFor={`testimonial-background-upload-${componentId}`}
              className={`cursor-pointer rounded-lg border border-gray-300 bg-white/90 px-3 py-1.5 text-xs font-medium text-black shadow-lg backdrop-blur-sm transition hover:bg-white sm:px-4 sm:py-2 sm:text-sm ${
                isUploadingBackground ? "pointer-events-none opacity-50" : ""
              }`}
            >
              {isUploadingBackground ? (
                <span className="flex items-center gap-1 sm:gap-2">
                  <Loader2 className="h-3 w-3 animate-spin sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Uploading...</span>
                  <span className="sm:hidden">...</span>
                </span>
              ) : (
                <>
                  <span className="hidden sm:inline">Change Background</span>
                  <span className="sm:hidden">Change BG</span>
                </>
              )}
            </label>
            <input
              id={`testimonial-background-upload-${componentId}`}
              type="file"
              accept="image/*"
              onChange={handleBackgroundFileChange}
              className="hidden"
              disabled={isUploadingBackground}
            />
          </div>
        )}

        {/* Background Upload Loading Overlay */}
        {isUploadingBackground && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
            <div className="flex flex-col items-center gap-2 text-white">
              <Loader2 className="h-6 w-6 animate-spin sm:h-8 sm:w-8" />
              <p className="px-4 text-center text-xs font-medium sm:text-sm">
                Uploading background...
              </p>
            </div>
          </div>
        )}

        {/* Background */}
        <div className="absolute inset-0">
          <EditableImage
            src={backgroundSrc}
            alt="Testimonials background"
            onImageChange={imageUrl => onBackgroundChange?.(imageUrl)}
            isEditable={isEditable}
            className="h-full w-full"
            width={1920}
            height={1080}
            priority
            placeholder={{
              width: 1920,
              height: 1080,
              text: "Upload background image",
            }}
            imageOptimization={{
              width: 1920,
              height: 1080,
              quality: "auto",
              format: "auto",
              crop: "fill",
            }}
            cloudinaryOptions={{
              folder: "testimonial-backgrounds",
              resourceType: "image",
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/90 via-white/85 to-white/92" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="mb-12 text-center">
            {renderSubtitle()}
            {renderTitle()}
          </div>

          {slideGroups.length === 0 ? (
            <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-gray-300 bg-white/80 p-12 text-center">
              <p className="text-gray-500">
                Add testimonials to showcase them here.
              </p>
            </div>
          ) : (
            <>
              <div className="group relative flex items-center gap-4">
                <button
                  onClick={handlePrev}
                  className="invisible flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white transition-all group-hover:visible hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none disabled:opacity-50"
                  aria-label="Previous testimonial"
                  disabled={!hasMultipleGroups}
                >
                  <ChevronLeft className="h-6 w-6 text-gray-600" />
                </button>

                <div className="flex-1 overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                  >
                    {slideGroups.map((group, groupIndex) => (
                      <div
                        key={`group-${groupIndex}`}
                        className="w-full flex-shrink-0 px-2 sm:px-4"
                      >
                        <div className="mx-auto max-w-6xl">
                          <div className="grid gap-6 md:grid-cols-2">
                            {group.map(testimonial => (
                              <div
                                key={testimonial.id}
                                className="cursor-pointer rounded-[28px] bg-white p-8 transition md:p-10"
                                onClick={() =>
                                  onTestimonialClick?.(testimonial)
                                }
                              >
                                <div className="mb-6 font-serif text-6xl leading-none text-indigo-600 md:text-7xl">
                                  ❝
                                </div>
                                <p className="mb-8 text-lg leading-relaxed text-gray-600 md:text-xl">
                                  &quot;{testimonial.comment}&quot;
                                </p>
                                <div className="flex items-center gap-4">
                                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-4 border-indigo-50">
                                    <Image
                                      src={
                                        testimonial.image ||
                                        "/images/default-avatar.png"
                                      }
                                      alt={testimonial.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div>
                                    <div className="text-xl font-semibold text-gray-900">
                                      {testimonial.name}
                                    </div>
                                    {testimonial.designation && (
                                      <p className="text-gray-500">
                                        {testimonial.designation}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                            {group.length === 1 && (
                              <div
                                className="hidden rounded-[28px] bg-transparent md:block"
                                aria-hidden="true"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="invisible flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white transition-all group-hover:visible hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none disabled:opacity-50"
                  aria-label="Next testimonial"
                  disabled={!hasMultipleGroups}
                >
                  <ChevronRight className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
