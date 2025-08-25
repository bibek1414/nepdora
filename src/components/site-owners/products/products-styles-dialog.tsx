// Updated ProductsStylesDialog Component with Auto-Add Functionality

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
import { Grid, List, LayoutGrid, ShoppingBag } from "lucide-react";
import { ProductsData } from "@/types/owner-site/components/products";
import { ProductCard1 } from "./product-card1";
import { ProductCard2 } from "./product-card2";
import { ProductCard3 } from "./product-card3";
import { Product } from "@/types/owner-site/product";

interface ProductsStylesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStyleSelect: (style: "grid-1" | "grid-2" | "list-1" | "carousel-1") => void;
  sampleProductsData?: ProductsData;
}

// Enhanced sample product data for better previews
const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    slug: "premium-wireless-headphones",
    price: "199.99",
    market_price: "249.99",
    description:
      "High-quality wireless headphones with noise cancellation and superior sound quality. Perfect for music lovers and professionals.",
    stock: 25,
    thumbnail_image: "https://example.com/images/headphones.jpg",
    thumbnail_alt_description: "Premium Wireless Headphones",
    category: {
      id: 1,
      name: "Electronics",
      slug: "electronics",
    },
    sub_category: {
      id: 1,
      name: "Headphones",
      slug: "headphones",
    },
    is_popular: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Professional Camera Lens",
    slug: "professional-camera-lens",
    price: "599.99",
    market_price: "699.99",
    description:
      "Ultra-sharp 85mm portrait lens with fast autofocus and beautiful bokeh. Ideal for photography enthusiasts and professionals.",
    stock: 8,
    thumbnail_image: "https://example.com/images/camera-lens.jpg",
    thumbnail_alt_description: "Professional Camera Lens",
    category: {
      id: 1,
      name: "Electronics",
      slug: "electronics",
    },
    sub_category: {
      id: 1,
      name: "Cameras",
      slug: "cameras",
    },
    is_popular: false,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  {
    id: 4,
    name: "Bluetooth Portable Speaker",
    slug: "bluetooth-portable-speaker",
    price: "129.99",
    market_price: "159.99",
    description:
      "Compact and powerful portable speaker with deep bass and long battery life. Perfect for outdoor activities and parties.",
    stock: 30,
    thumbnail_image: "https://example.com/images/portable-speaker.jpg",
    thumbnail_alt_description: "Bluetooth Portable Speaker",
    category: {
      id: 1,
      name: "Electronics",
      slug: "electronics",
    },
    sub_category: {
      id: 1,
      name: "Audio",
      slug: "audio",
    },
    is_popular: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Ergonomic Office Chair",
    slug: "ergonomic-office-chair",
    price: "249.99",
    market_price: "299.99",
    description:
      "Comfortable office chair with adjustable height, lumbar support, and breathable mesh design. Ideal for long working hours.",
    stock: 12,
    thumbnail_image: "https://example.com/images/office-chair.jpg",
    thumbnail_alt_description: "Ergonomic Office Chair",
    category: {
      id: 2,
      name: "Furniture",
      slug: "furniture",
    },
    sub_category: {
      id: 1,
      name: "Office",
      slug: "office",
    },
    is_popular: false,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const ProductsStylesDialog: React.FC<ProductsStylesDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
  sampleProductsData,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<
    "grid-1" | "grid-2" | "list-1" | "carousel-1" | null
  >(null);

  const styles = [
    {
      id: "grid-1" as const,
      name: "Colorful Grid",
      description:
        "Modern 4-column grid with colorful gradients and animations",
      icon: <Grid className="h-5 w-5" />,
      preview: (
        <div className="grid h-[300%] w-[300%] origin-top-left scale-[0.3] grid-cols-2 gap-2 overflow-hidden">
          {sampleProducts.slice(0, 4).map(product => (
            <ProductCard1
              key={product.id}
              product={product}
              showPrice={true}
              showDescription={true}
              showStock={true}
            />
          ))}
        </div>
      ),
      features: [
        "Colorful Design",
        "Hover Animations",
        "4 Columns",
        "Mobile Responsive",
      ],
    },
    {
      id: "grid-2" as const,
      name: "Minimal Elegant",
      description:
        "Clean 3-column layout with elegant typography and subtle effects",
      icon: <LayoutGrid className="h-5 w-5" />,
      preview: (
        <div className="grid h-[400%] w-[400%] origin-top-left scale-[0.25] grid-cols-2 gap-2 overflow-hidden">
          {sampleProducts.slice(0, 3).map(product => (
            <ProductCard2
              key={product.id}
              product={product}
              showPrice={true}
              showDescription={true}
              showStock={true}
            />
          ))}
        </div>
      ),
      features: [
        "Minimal Design",
        "Premium Look",
        "3 Columns",
        "Elegant Typography",
      ],
    },
    {
      id: "list-1" as const,
      name: "Horizontal Cards",
      description:
        "Detailed horizontal layout with comprehensive product information",
      icon: <List className="h-5 w-5" />,
      preview: (
        <div className="h-[500%] w-[500%] origin-top-left scale-[0.2] space-y-2 overflow-hidden">
          {sampleProducts.slice(0, 2).map(product => (
            <ProductCard3
              key={product.id}
              product={product}
              showPrice={true}
              showDescription={true}
              showStock={true}
            />
          ))}
        </div>
      ),
      features: [
        "Horizontal Layout",
        "Detailed Info",
        "Large Images",
        "Feature Rich",
      ],
    },
  ];

  // Handle style selection - immediately create component and close dialog
  const handleStyleClick = (
    styleId: "grid-1" | "grid-2" | "list-1" | "carousel-1"
  ) => {
    setSelectedStyle(styleId);
    // Add a small delay for visual feedback, then create component
    setTimeout(() => {
      onStyleSelect(styleId);
      setSelectedStyle(null); // Reset selection for next time
    }, 150);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Choose Products Section Style
          </DialogTitle>
          <DialogDescription>
            Click on any style to instantly add it to your page. Each style
            offers a unique design approach to showcase your products
            effectively.
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
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-lg p-2 transition-colors ${
                        selectedStyle === style.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-primary/10"
                      }`}
                    >
                      {style.icon}
                    </div>
                    <div>
                      <h3 className="text-foreground text-lg font-semibold">
                        {style.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {style.description}
                      </p>
                    </div>
                  </div>
                  {selectedStyle === style.id && (
                    <Badge variant="default" className="ml-2 animate-pulse">
                      Adding...
                    </Badge>
                  )}
                </div>

                {/* Style Preview */}
                <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-3">
                  {style.preview}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                </div>

                {/* Style Features */}
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {style.features.map((feature, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className={`text-xs transition-colors ${
                          selectedStyle === style.id
                            ? "border-primary/50 text-primary bg-primary/10"
                            : "hover:border-primary/30"
                        }`}
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Click to add hint */}
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
