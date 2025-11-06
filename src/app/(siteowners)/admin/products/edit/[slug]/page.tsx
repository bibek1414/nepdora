"use client";

import { ProductForm } from "@/components/site-owners/admin/products/product-form";
import type { ProductFormRefApi } from "@/components/site-owners/admin/products/product-form";
import ProductPreviewDetail from "@/components/site-owners/admin/products/product-preview-detail";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks/owner-site/admin/use-product";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import React, { use } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface EditProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { slug } = use(params);
  const { data: product, isLoading, error } = useProduct(slug);
  const router = useRouter();
  const formRef = React.useRef<ProductFormRefApi>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [previewData, setPreviewData] = React.useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto">
        <div className="mx-auto">
          <div className="sticky top-16 z-30 flex items-center justify-between bg-white px-6 py-3 shadow-none md:px-8 lg:px-16">
            <div className="flex items-center gap-3">
              <Link href="/admin/products">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
              <Skeleton className="h-6 w-40" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-28" />
            </div>
          </div>

          <div className="mx-auto">
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
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto">
        <div className="mx-auto">
          <div className="sticky top-16 z-30 flex items-center justify-between bg-white px-6 py-3 shadow-none md:px-8 lg:px-16">
            <div className="flex items-center gap-3">
              <Link href="/admin/products">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-lg font-semibold">Product Not Found</h1>
            </div>
            <div className="flex items-center gap-2" />
          </div>

          <Card>
            <CardContent className="p-6">
              <p className="text-destructive">
                {error instanceof Error ? error.message : "Product not found"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto bg-gray-50">
      <div className="mx-auto">
        {/* Header to match Add Product UI */}
        <div className="sticky top-15 z-30 flex items-center justify-between bg-white px-6 py-3 shadow-none md:px-8 lg:px-16">
          <div className="flex items-center gap-3">
            <Link href="/admin/products">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-base font-semibold">Edit Product</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl bg-gray-100 px-4 py-2 text-gray-600"
              onClick={() => {
                const data = formRef.current?.getPreviewProduct();
                if (data) {
                  setPreviewData(data);
                  setIsPreviewOpen(true);
                }
              }}
            >
              Preview
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl bg-gray-100 px-4 py-2 text-gray-600"
                >
                  Discard
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently discard any unsaved changes to this
                    product.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => router.push("/admin/products")}
                  >
                    Discard
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              type="submit"
              form="product-form"
              size="sm"
              className="rounded-xl bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
            >
              Save Changes
            </Button>
          </div>
        </div>

        <ProductForm ref={formRef} product={product} />
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="h-[90vh] max-w-[90vw] overflow-y-auto p-0 sm:max-w-5xl">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle>Product Preview</DialogTitle>
            </DialogHeader>
            {previewData && <ProductPreviewDetail product={previewData} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
