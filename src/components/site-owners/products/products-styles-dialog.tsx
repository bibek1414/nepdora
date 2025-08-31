// ProductsStylesDialog.tsx
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
import { ShoppingBag } from "lucide-react";
import Image from "next/image";

interface ProductsStylesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStyleSelect: (style: "grid-1" | "grid-2" | "list-1") => void;
}

export const ProductsStylesDialog: React.FC<ProductsStylesDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<
    "grid-1" | "grid-2" | "list-1" | null
  >(null);

  const styles = [
    {
      id: "grid-1" as const,
      name: "Grid Style 1",
      description: "Simple grid layout for products.",
      preview: (
        <Image
          src="/images/site-owners/products/product1.png"
          alt="Product grid 1"
          width={120}
          height={120}
        />
      ),
    },
    {
      id: "grid-2" as const,
      name: "Grid Style 2",
      description: "Alternative grid layout for products.",
      preview: (
        <Image
          src="/images/site-owners/products/product2.png"
          alt="Product grid 2"
          width={120}
          height={120}
        />
      ),
    },
    {
      id: "list-1" as const,
      name: "List Style",
      description: "List layout for products.",
      preview: (
        <Image
          src="/images/site-owners/products/product3.png"
          alt="Product list"
          width={120}
          height={120}
        />
      ),
    },
  ];

  const handleStyleClick = (styleId: "grid-1" | "grid-2" | "list-1") => {
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
            <ShoppingBag className="h-5 w-5" />
            Choose Products Section Style
          </DialogTitle>
          <DialogDescription>
            Click on a style to add it to your page.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 py-6 lg:grid-cols-2">
          {styles.map(style => (
            <Card
              key={style.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                selectedStyle === style.id
                  ? "ring-primary border-primary bg-primary/5 shadow-md ring-2"
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
