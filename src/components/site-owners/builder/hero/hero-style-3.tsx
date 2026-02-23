"use client";

import React from "react";
import { Button } from "@/components/ui/site-owners/button";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import { HeroTemplate3Data } from "@/types/owner-site/components/hero";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { cn } from "@/lib/utils";

interface HeroTemplate3Props {
  heroData: HeroTemplate3Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<HeroTemplate3Data>) => void;
  siteUser?: string;
}

export const HeroTemplate3: React.FC<HeroTemplate3Props> = ({
  heroData,
  isEditable = false,
  onUpdate,
  siteUser,
}) => {
  const {
    data,
    handleTextUpdate,
    handleImageUpdate,
    handleAltUpdate,
    handleButtonUpdate,
    getImageUrl,
  } = useBuilderLogic(heroData, onUpdate);

  return (
    <section className="relative flex min-h-screen w-full items-center overflow-hidden bg-background py-16 lg:py-24 font-body">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="flex flex-col items-start text-left gap-8">
            {/* Subtitle Badge */}
            {data.subtitle && (
              <Badge
                variant="secondary"
                className="w-fit rounded-full px-4 py-1.5 bg-secondary text-secondary-foreground font-body"
              >
                <EditableText
                  value={data.subtitle}
                  onChange={handleTextUpdate("subtitle")}
                  as="span"
                  className="text-sm font-medium tracking-wide uppercase"
                  isEditable={isEditable}
                  placeholder="Enter subtitle..."
                />
              </Badge>
            )}

            {/* Title */}
            <EditableText
              value={data.title}
              onChange={handleTextUpdate("title")}
              as="h1"
              className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl text-foreground font-heading"
              isEditable={isEditable}
              placeholder="Enter your hero title..."
              multiline={true}
            />

            {/* Description */}
            {data.description && (
              <EditableText
                value={data.description}
                onChange={handleTextUpdate("description")}
                as="p"
                className="max-w-xl text-lg text-muted-foreground leading-relaxed sm:text-xl font-body"
                isEditable={isEditable}
                placeholder="Enter description..."
                multiline={true}
              />
            )}

            {/* Buttons with theme styling */}
            {data.buttons.length > 0 && (
              <div className="flex flex-wrap items-center gap-4">
                {data.buttons.map((button, index) => (
                  <EditableLink
                    key={button.id}
                    className={cn(
                      "flex items-center gap-2 px-8 py-4 rounded-lg text-base font-medium transition-transform hover:scale-105 font-body",
                      button.variant === "primary"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    )}
                    text={button.text}
                    href={button.href || "#"}
                    onChange={(text, href) =>
                      handleButtonUpdate("buttons")(button.id, text, href)
                    }
                    isEditable={isEditable}
                    siteUser={siteUser}
                    textPlaceholder="Button text..."
                    hrefPlaceholder="Enter button URL..."
                  >
                    {index === 1 && (
                      <Play size={20} className="fill-current" />
                    )}
                    <span>{button.text}</span>
                  </EditableLink>
                ))}
              </div>
            )}

            {/* Users Stats */}
            <div className="mt-4 flex items-center gap-4 border-l-4 border-primary pl-6">
              <div className="flex flex-col">
                <EditableText
                  value={data.statsNumber || "12k+"}
                  onChange={handleTextUpdate("statsNumber")}
                  as="span"
                  className="text-2xl font-bold text-foreground font-heading"
                  isEditable={isEditable}
                  placeholder="Enter stats number..."
                />
                <EditableText
                  value={data.statsLabel || "Used by teams and professionals."}
                  onChange={handleTextUpdate("statsLabel")}
                  as="span"
                  className="text-sm font-medium text-muted-foreground font-body"
                  isEditable={isEditable}
                  placeholder="Add stats description..."
                />
              </div>
            </div>
          </div>

          {/* Right Side Image/Illustration */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full aspect-square max-w-lg lg:max-w-xl">
              {data.showImage && data.imageUrl ? (
                  <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl transition-all hover:shadow-3xl">
                    <EditableImage
                      src={getImageUrl(data.imageUrl, { width: 800 })}
                      alt={data.imageAlt || "Hero image"}
                      onImageChange={handleImageUpdate("imageUrl", "imageAlt")}
                      onAltChange={handleAltUpdate("imageAlt")}
                      isEditable={isEditable}
                      className="object-cover w-full h-full transform transition-transform duration-700 hover:scale-105"
                      width={800}
                      height={800}
                      cloudinaryOptions={{
                        folder: "hero-images",
                        resourceType: "image",
                      }}
                      showAltEditor={isEditable}
                      placeholder={{
                        width: 800,
                        height: 800,
                        text: "Upload hero image",
                      }}
                    />
                  </div>
              ) : (
                <div className="w-full h-full rounded-3xl border-2 border-dashed border-muted-foreground/20 bg-muted/10 flex items-center justify-center relative overflow-hidden">
                    <EditableImage
                        src=""
                        alt="Hero illustration"
                        onImageChange={handleImageUpdate("imageUrl", "imageAlt")}
                        onAltChange={handleAltUpdate("imageAlt")}
                        isEditable={isEditable}
                        className="w-full h-full object-cover opacity-0"
                        width={800}
                        height={800}
                        cloudinaryOptions={{
                        folder: "hero-images",
                        resourceType: "image",
                        }}
                        showAltEditor={isEditable}
                        placeholder={{
                        width: 800,
                        height: 800,
                        text: "Upload hero image",
                        }}
                    />
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-muted-foreground">
                        Upload Image
                    </div>
                </div>
              )}
               {/* Decorative elements */}
               <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full rounded-3xl bg-primary/10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
