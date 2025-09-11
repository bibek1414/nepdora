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
import { Mail } from "lucide-react";
import Image from "next/image";

interface ContactStylesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStyleSelect: (style: "form-1" | "form-2" | "form-3" | "form-4") => void;
}

export const ContactStylesDialog: React.FC<ContactStylesDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<
    "form-1" | "form-2" | "form-3" | "form-4" | null
  >(null);

  const styles = [
    {
      id: "form-1" as const,
      name: "Contact Form 1",
      description: "Two-column layout with contact information sidebar.",
      preview: (
        <Image
          src="/images/site-owners/contact/contact1.png"
          alt="Contact form 1"
          width={240}
          height={180}
          className="object-cover"
        />
      ),
    },
    {
      id: "form-2" as const,
      name: "Contact Form 2",
      description: "Gradient background with simplified form layout.",
      preview: (
        <Image
          src="/images/site-owners/contact/contact2.png"
          alt="Contact form 2"
          width={240}
          height={180}
          className="object-cover"
        />
      ),
    },
    {
      id: "form-3" as const,
      name: "Contact Form 3",
      description: "Centered card design with premium styling.",
      preview: (
        <Image
          src="/images/site-owners/contact/contact3.png"
          alt="Contact form 3"
          width={240}
          height={180}
          className="object-cover"
        />
      ),
    },
    {
      id: "form-4" as const,
      name: "Contact Form 4",
      description: "Centered card design with premium styling.",
      preview: (
        <Image
          src="/images/site-owners/contact/contact4.png"
          alt="Contact form 4"
          width={280}
          height={180}
          className="object-cover"
        />
      ),
    },
  ];

  const handleStyleClick = (
    styleId: "form-1" | "form-2" | "form-3" | "form-4"
  ) => {
    setSelectedStyle(styleId);
    setTimeout(() => {
      onStyleSelect(styleId);
      setSelectedStyle(null);
    }, 150);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Choose Contact Section Style
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
              <CardContent className="">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-foreground text-lg font-semibold">
                      {style.name}
                    </h3>
                  </div>
                  {selectedStyle === style.id && (
                    <Badge variant="default" className="ml-2 animate-pulse">
                      Adding...
                    </Badge>
                  )}
                </div>

                <div className="relative flex h-64 items-center justify-center overflow-hidden">
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
