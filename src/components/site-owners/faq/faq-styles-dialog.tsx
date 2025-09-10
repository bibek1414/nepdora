import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
import Image from "next/image";

interface FAQStylesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStyleSelect: (style: "accordion" | "plus-minus" | "card-grid") => void;
}

export const FAQStylesDialog: React.FC<FAQStylesDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<
    "accordion" | "plus-minus" | "card-grid" | null
  >(null);

  const styles = [
    {
      id: "accordion" as const,
      name: "Accordion Style",
      description:
        "Classic expandable accordion layout with smooth transitions.",
      preview: (
        <Image
          src="/images/site-owners/faq/faq-accordion.png"
          alt="FAQ accordion"
          width={120}
          height={120}
        />
      ),
    },
    {
      id: "plus-minus" as const,
      name: "Plus/Minus Style",
      description: "Card-based layout with plus/minus toggle indicators.",
      preview: (
        <Image
          src="/images/site-owners/faq/faq-plus-minus.png"
          alt="FAQ plus minus"
          width={120}
          height={120}
        />
      ),
    },
    {
      id: "card-grid" as const,
      name: "Card Grid Style",
      description: "Modern card grid with expandable content areas.",
      preview: (
        <Image
          src="/images/site-owners/faq/faq-card-grid.png"
          alt="FAQ card grid"
          width={120}
          height={120}
        />
      ),
    },
  ];

  const handleStyleClick = (
    styleId: "accordion" | "plus-minus" | "card-grid"
  ) => {
    setSelectedStyle(styleId);
    setTimeout(() => {
      onStyleSelect(styleId);
      setSelectedStyle(null);
    }, 150);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Choose FAQ Section Style
          </DialogTitle>
          <DialogDescription>
            Click on a style to add it to your page.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 py-6 lg:grid-cols-3">
          {styles.map(style => (
            <Card
              key={style.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                selectedStyle === style.id
                  ? "ring-primary border-primary bg-primary/5 ring-2"
                  : "hover:border-primary/50"
              }`}
              onClick={() => handleStyleClick(style.id)}
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-foreground text-lg font-semibold">
                      {style.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {style.description}
                    </p>
                  </div>
                  {selectedStyle === style.id && (
                    <Badge variant="default" className="ml-2 animate-pulse">
                      Adding...
                    </Badge>
                  )}
                </div>

                <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white">
                  {style.preview}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
                </div>

                <div className="text-muted-foreground mt-3 text-center text-xs font-medium">
                  {selectedStyle === style.id
                    ? "Adding to your page..."
                    : "Click to add this style"}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
