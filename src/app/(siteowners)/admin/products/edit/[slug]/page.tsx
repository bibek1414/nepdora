"use client";

import { ProductForm } from "@/components/site-owners/admin/products/product-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks/owner-site/use-product";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { use } from "react";
interface EditProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { slug } = use(params);
  const { data: product, isLoading, error } = useProduct(slug);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/products" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Products
              </Link>
            </Button>
          </div>
          <Skeleton className="mb-2 h-9 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>

        <div className="max-w-4xl">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/products" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Products
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Product Not Found
          </h1>
        </div>

        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">
              {error instanceof Error ? error.message : "Product not found"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="mb-4 flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/products" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-muted-foreground">
          Update &apos;{product.name}&apos; information
        </p>
      </div>

      <div className="max-w-4xl">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
