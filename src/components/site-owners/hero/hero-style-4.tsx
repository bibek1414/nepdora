"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PackageCheck, Rocket, ShieldCheck, ImagePlus } from "lucide-react";
import { HeroData } from "@/types/owner-site/components/hero";
import { convertUnsplashUrl, optimizeCloudinaryUrl } from "@/utils/cloudinary";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { cn } from "@/lib/utils";

interface HeroTemplate4Props {
  heroData: HeroData;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<HeroData>) => void;
  siteUser?: string;
}

// BlurPanel component for the info strip
const BlurPanel = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "mx-auto block w-fit rounded-2xl bg-black/60 backdrop-blur-md will-change-transform",
        className
      )}
      role="region"
    >
      {children}
    </div>
  );
};

// Reveal component for animations
const Reveal = ({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// AnimatedText component for character-by-character animation
const AnimatedText = ({
  text,
  delay = 0,
}: {
  text: string;
  delay?: number;
}) => {
  return (
    <span>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + index * 0.03,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
          style={{ display: char === " " ? "inline" : "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};

export const HeroTemplate4: React.FC<HeroTemplate4Props> = ({
  heroData,
  isEditable = false,
  onUpdate,
  siteUser,
}) => {
  const [data, setData] = useState(heroData);
  const [isBackgroundHovered, setIsBackgroundHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Framer Motion scroll animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 0.95]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Handle text field updates
  const handleTextUpdate = (field: keyof HeroData) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<HeroData>);
  };

  // Handle image updates
  const handleImageUpdate = (imageUrl: string, altText?: string) => {
    const updatedData = {
      ...data,
      backgroundImageUrl: imageUrl,
      imageAlt: altText || data.imageAlt,
    };
    setData(updatedData);
    onUpdate?.({
      backgroundImageUrl: imageUrl,
      imageAlt: updatedData.imageAlt,
    });
  };

  // Handle alt text updates
  const handleAltUpdate = (altText: string) => {
    const updatedData = { ...data, imageAlt: altText };
    setData(updatedData);
    onUpdate?.({ imageAlt: altText });
  };

  // Handle button text and href updates
  const handleButtonUpdate = (
    buttonId: string,
    text: string,
    href?: string
  ) => {
    const updatedButtons = data.buttons.map(btn =>
      btn.id === buttonId
        ? { ...btn, text, ...(href !== undefined && { href }) }
        : btn
    );
    const updatedData = { ...data, buttons: updatedButtons };
    setData(updatedData);
    onUpdate?.({ buttons: updatedButtons });
  };

  const getBackgroundImageUrl = () => {
    if (!data.backgroundImageUrl) return "";
    return optimizeCloudinaryUrl(convertUnsplashUrl(data.backgroundImageUrl), {
      width: 1920,
      quality: "auto",
      format: "auto",
    });
  };

  // Default features for the info strip
  const defaultFeatures = [
    { icon: PackageCheck, text: "Free shipping", color: "text-green-400" },
    { icon: Rocket, text: "Delivered in 6 weeks", color: "text-amber-400" },
    { icon: ShieldCheck, text: "Lifetime guarantee", color: "text-blue-400" },
  ];

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Background Image Container - Now with better interaction handling */}
      <motion.div
        className={cn("group absolute inset-0", isEditable && "cursor-pointer")}
        style={{ scale: imageScale, y: imageY }}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}
        onMouseEnter={() => isEditable && setIsBackgroundHovered(true)}
        onMouseLeave={() => isEditable && setIsBackgroundHovered(false)}
      >
        <EditableImage
          src={getBackgroundImageUrl()}
          alt={data.imageAlt || "Hero background"}
          onImageChange={handleImageUpdate}
          onAltChange={handleAltUpdate}
          isEditable={isEditable}
          className="h-full w-full"
          height={1080}
          width={1920}
          cloudinaryOptions={{
            folder: "hero-backgrounds",
            resourceType: "image",
          }}
          showAltEditor={false}
          placeholder={{
            width: 1920,
            height: 1080,
            text: "Click to upload background image",
          }}
        />

        {/* Original Overlay - with pointer-events-none to allow background interaction */}
        {data.showOverlay && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundColor: data.overlayColor,
              opacity: data.overlayOpacity,
            }}
          />
        )}
      </motion.div>

      {/* Content - with pointer-events-none on container, pointer-events-auto on interactive elements */}
      <motion.div
        className="pointer-events-none relative z-10 flex h-full items-center justify-center"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div
          className="container-custom text-center"
          style={{ color: data.textColor }}
        >
          {/* Subtitle Badge */}
          {data.subtitle && (
            <Reveal>
              <Badge variant="secondary" className="pointer-events-auto mb-6">
                <EditableText
                  value={data.subtitle}
                  onChange={handleTextUpdate("subtitle")}
                  as="span"
                  isEditable={isEditable}
                  placeholder="Enter subtitle..."
                />
              </Badge>
            </Reveal>
          )}

          {/* Title with Character Animation */}
          <Reveal>
            <h1 className="pointer-events-auto mb-6 text-6xl leading-none font-bold tracking-tight md:text-7xl lg:text-8xl xl:text-9xl">
              <EditableText
                value={data.title}
                onChange={handleTextUpdate("title")}
                as="span"
                isEditable={isEditable}
                placeholder="Enter your hero title..."
                className="block"
              />
              {!isEditable && (
                <span className="block font-light italic">
                  <AnimatedText
                    text={data.description || "spaces that breathe."}
                    delay={1.1}
                  />
                </span>
              )}
            </h1>
          </Reveal>

          {/* Description for editable mode */}
          {isEditable && data.description && (
            <Reveal delay={0.2}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.7,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                className="pointer-events-auto"
              >
                <EditableText
                  value={data.description}
                  onChange={handleTextUpdate("description")}
                  as="p"
                  className="mb-12 text-lg leading-relaxed opacity-90 md:text-xl"
                  isEditable={isEditable}
                  placeholder="Enter description..."
                  multiline={true}
                />
              </motion.div>
            </Reveal>
          )}

          {/* Buttons with EditableLink */}
          {data.buttons.length > 0 && (
            <Reveal delay={0.3}>
              <div className="pointer-events-auto mt-8 flex flex-wrap justify-center gap-4">
                {data.buttons.map(button => (
                  <Button
                    key={button.id}
                    variant={
                      button.variant === "primary" ? "default" : button.variant
                    }
                    size="lg"
                    className="min-w-[120px]"
                    asChild
                  >
                    <EditableLink
                      text={button.text}
                      href={button.href || "#"}
                      onChange={(text, href) =>
                        handleButtonUpdate(button.id, text, href)
                      }
                      isEditable={isEditable}
                      siteUser={siteUser}
                      textPlaceholder="Button text..."
                      hrefPlaceholder="Enter button URL..."
                    />
                  </Button>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </motion.div>

      {/* Background Image Change Button - Fixed position for better UX */}
      {isEditable && (
        <div className="absolute top-4 right-4 z-30">
          <Button
            variant="secondary"
            size="sm"
            className="mr-15 bg-white/90 text-black shadow-lg backdrop-blur-sm hover:bg-white"
            onClick={() => {
              // Trigger the hidden file input in EditableImage
              const fileInput = document.querySelector(
                'input[type="file"]'
              ) as HTMLInputElement;
              fileInput?.click();
            }}
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            Change Background
          </Button>
        </div>
      )}

      {/* Info Strip */}
      <motion.div
        className="pointer-events-none absolute right-0 bottom-0 left-0 z-20 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 1.2,
          ease: [0.21, 0.47, 0.32, 0.98],
        }}
      >
        <BlurPanel className="mx-6 mb-6 border-white/20 bg-black/24 px-6 py-4 backdrop-blur-md">
          <div
            className="flex items-center justify-center gap-6"
            style={{ color: data.textColor }}
          >
            {defaultFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 opacity-90">
                <feature.icon className={`h-4 w-4 ${feature.color}`} />
                <span className="text-sm">{feature.text}</span>
              </div>
            ))}
          </div>
        </BlurPanel>
      </motion.div>
    </section>
  );
};
