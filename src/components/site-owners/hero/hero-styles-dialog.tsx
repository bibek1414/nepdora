import React from "react";
import { useDraggable } from "@dnd-kit/core";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HeroTemplate1 } from "./hero-style-1";
import { HeroTemplate2 } from "./hero-style-2";
import { HeroData } from "@/types/owner-site/components/hero";

interface HeroStyle {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<{
    heroData: HeroData;
  }>;
  template: "hero-1" | "hero-2";
}

interface HeroStylesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStyleSelect: (template: "hero-1" | "hero-2") => void;
  sampleHeroData?: HeroData;
}

const DraggableHeroPreview = ({
  id,
  template,
  children,
}: {
  id: string;
  template: string;
  children: React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id,
      data: {
        type: "hero",
        template: template,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 1000 : undefined,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {/* Hero Preview */}
      <div className="bg-white">
        <div
          className="origin-top-left scale-75 transform"
          style={{ width: "133.33%" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

// Sample hero data for preview
const getSampleHeroData = (): HeroData => ({
  template: "hero-1",
  title: "Welcome to Your Amazing Website",
  subtitle: "Innovation • Excellence • Growth",
  description:
    "Create stunning websites with our powerful platform. Build, customize, and launch your digital presence with ease using our intuitive tools and professional templates.",
  layout: "text-center",
  textColor: "#ffffff",
  backgroundColor: "#1e3a8a",
  backgroundType: "gradient",
  gradientFrom: "#1e3a8a",
  gradientTo: "#7c3aed",
  backgroundImageUrl: "",
  showOverlay: true,
  overlayColor: "#000000",
  overlayOpacity: 0.4,
  showImage: true,
  imageUrl:
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80",
  imageAlt: "Hero Image",
  buttons: [
    {
      id: "1",
      text: "Get Started",
      variant: "primary",
      href: "#get-started",
    },
    {
      id: "2",
      text: "Learn More",
      variant: "outline",
      href: "#learn-more",
    },
  ],
  showSlider: true,
  sliderImages: [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&q=80",
      alt: "Slide 1",
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&h=400&q=80",
      alt: "Slide 2",
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&q=80",
      alt: "Slide 3",
    },
  ],
});

const heroStyles: HeroStyle[] = [
  {
    id: "hero-1",
    name: "Centered Layout",
    description:
      "Clean centered design with image above content, perfect for showcasing your main message with strong visual impact",
    component: HeroTemplate1,
    template: "hero-1",
  },
  {
    id: "hero-2",
    name: "Split Layout",
    description:
      "Dynamic split layout with content on left and image slider on right, ideal for storytelling and multiple visuals",
    component: HeroTemplate2,
    template: "hero-2",
  },
];

export const HeroStylesDialog: React.FC<HeroStylesDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
  sampleHeroData,
}) => {
  const heroData = sampleHeroData || getSampleHeroData();

  const handleStyleClick = (
    template: "hero-1" | "hero-2",
    event: React.MouseEvent
  ) => {
    if (!event.defaultPrevented) {
      onStyleSelect(template);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-6xl overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold">
            Choose Hero Template
          </DialogTitle>
          <p className="mt-1 text-sm text-gray-600">
            Select a hero template or drag to add to your page. Click on any
            preview to select it.
          </p>
        </DialogHeader>

        <div className="space-y-8">
          {heroStyles.map(heroStyle => {
            const HeroComponent = heroStyle.component;
            // Create template-specific hero data
            const templateHeroData = {
              ...heroData,
              template: heroStyle.template,
            };

            return (
              <div key={heroStyle.id} className="space-y-4">
                {/* Style Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{heroStyle.name}</h3>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {heroStyle.template}
                    </span>
                  </div>
                  <p className="max-w-4xl text-sm text-gray-600">
                    {heroStyle.description}
                  </p>
                </div>

                {/* Hero Preview */}
                <div
                  onClick={e => handleStyleClick(heroStyle.template, e)}
                  className="group cursor-pointer"
                >
                  <div className="rounded-lg border-2 border-transparent transition-all duration-200 group-hover:border-blue-200">
                    <DraggableHeroPreview
                      id={`hero-${heroStyle.id}`}
                      template={heroStyle.template}
                    >
                      <HeroComponent heroData={templateHeroData} />
                    </DraggableHeroPreview>
                  </div>
                </div>

                {/* Usage Tips */}
                <div className="ml-1 text-xs text-gray-500">
                  {heroStyle.template === "hero-1"
                    ? "Best for: Landing pages, product showcases, single message focus"
                    : "Best for: Service pages, multi-feature displays, interactive presentations"}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 border-t pt-4 text-xs text-gray-500">
          <p>
            💡 <strong>Tip:</strong> You can customize colors, content, and
            styling after selecting a template.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
