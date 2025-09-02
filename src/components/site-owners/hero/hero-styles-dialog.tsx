import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface HeroStylesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStyleSelect: (template: "hero-1" | "hero-2") => void;
}

export const HeroStylesDialog: React.FC<HeroStylesDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<
    "hero-1" | "hero-2" | null
  >(null);

  const styles = [
    {
      id: "hero-1" as const,
      name: "Hero Template 1",
      preview: (
        <Image
          src="/images/site-owners/hero/hero1.png"
          alt="Hero Template 1"
          width={600}
          height={300}
          className="rounded-lg"
        />
      ),
    },
    {
      id: "hero-2" as const,
      name: "Hero Template 2",
      preview: (
        <Image
          src="/images/site-owners/hero/hero2.png"
          alt="Hero Template 2"
          width={600}
          height={300}
          className="rounded-lg"
        />
      ),
    },
  ];

  const handleStyleClick = (template: "hero-1" | "hero-2") => {
    setSelectedStyle(template);
    setTimeout(() => {
      onStyleSelect(template);
      setSelectedStyle(null);
      onOpenChange(false);
    }, 150);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-5xl overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold">
            Choose Hero Template
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 py-6 lg:grid-cols-2">
          {styles.map(style => (
            <Card
              key={style.id}
              className={`hover: cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                selectedStyle === style.id
                  ? "ring-primary border-primary bg-primary/5 ring-2"
                  : "hover:border-primary/50"
              }`}
              onClick={() => handleStyleClick(style.id)}
            >
              <CardContent className="flex flex-col items-center p-4">
                <h3 className="mb-2 text-lg font-medium">{style.name}</h3>
                <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white">
                  {style.preview}
                </div>
                {selectedStyle === style.id && (
                  <Badge variant="default" className="mt-2 animate-pulse">
                    Adding...
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
