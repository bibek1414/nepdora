import React, { useState } from "react";
import { BannerData } from "@/types/owner-site/components/banner";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface BannerTemplateProps {
  bannerData: BannerData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<BannerData>) => void;
}

export const BannerTemplate3: React.FC<BannerTemplateProps> = ({
  bannerData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const [data, setData] = useState(bannerData);

  const handleTextUpdate = (field: keyof BannerData) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<BannerData>);
  };

  const handleLinkUpdate = (index: number, href: string) => {
    const updatedImages = [...data.images];
    updatedImages[index] = { ...updatedImages[index], link: href };
    const updatedData = { ...data, images: updatedImages };
    setData(updatedData);
    onUpdate?.({ images: updatedImages });
  };
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getImageSrc = (img: any) => {
    if (typeof img === "string") return img;
    if (img instanceof File || img instanceof Blob)
      return URL.createObjectURL(img);
    return "/placeholder-image.jpg"; // fallback placeholder
  };

  // Filter active images
  const activeImages = data.images.filter(img => img.is_active !== false);

  if (activeImages.length === 0) {
    return (
      <Card className="w-full bg-gray-50 p-6">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">No sidebar content</p>
          <p className="mt-1 text-sm">Sidebar banners will appear here</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="mb-4">
        <EditableText
          value={data.title || "Featured"}
          onChange={handleTextUpdate("title")}
          as="h2"
          className="border-b border-gray-200 pb-2 text-lg font-semibold text-gray-800"
          isEditable={isEditable}
          placeholder="Enter section title..."
        />
      </div>

      <div className="space-y-3">
        {activeImages.map((image, imageIndex) => (
          <Card
            key={imageIndex}
            className="group relative overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg"
          >
            {image.link ? (
              isEditable ? (
                <div className="relative block">
                  <div className="relative h-100">
                    <Image
                      src={getImageSrc(image.image)}
                      alt={image.image_alt_description || "Sidebar image"}
                      fill
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* External link icon */}
                    <div className="absolute top-3 right-3 rounded-full bg-white/90 p-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <ExternalLink className="h-4 w-4 text-gray-700" />
                    </div>

                    {/* Edit link overlay */}
                    <div className="absolute right-2 bottom-2 z-10">
                      <EditableLink
                        text="Edit Link"
                        href={image.link}
                        onChange={(text, href) =>
                          handleLinkUpdate(imageIndex, href)
                        }
                        isEditable={isEditable}
                        siteUser={siteUser}
                        className="rounded bg-black/50 px-2 py-1 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Image description as caption */}
                  {image.image_alt_description && (
                    <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <p className="line-clamp-2 text-sm font-medium text-white">
                        {image.image_alt_description}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={image.link}
                  className="relative block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="relative h-48">
                    <Image
                      src={getImageSrc(image.image)}
                      alt={image.image_alt_description || "Sidebar image"}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* External link icon */}
                    <div className="absolute top-3 right-3 rounded-full bg-white/90 p-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <ExternalLink className="h-4 w-4 text-gray-700" />
                    </div>
                  </div>

                  {/* Image description as caption */}
                  {image.image_alt_description && (
                    <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <p className="line-clamp-2 text-sm font-medium text-white">
                        {image.image_alt_description}
                      </p>
                    </div>
                  )}
                </Link>
              )
            ) : (
              <div className="relative h-48">
                <Image
                  src={getImageSrc(image.image)}
                  alt={image.image_alt_description || "Sidebar image"}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Image description as caption */}
                {image.image_alt_description && (
                  <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="line-clamp-2 text-sm font-medium text-white">
                      {image.image_alt_description}
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
