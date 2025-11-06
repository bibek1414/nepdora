"use client";

import { ProductForm } from "@/components/site-owners/admin/products/product-form";
import type { ProductFormRefApi } from "@/components/site-owners/admin/products/product-form";
import ProductPreviewDetail from "@/components/site-owners/admin/products/product-preview-detail";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
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

export default function AddProductPage() {
  const router = useRouter();
  const formRef = React.useRef<ProductFormRefApi>(null);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [previewData, setPreviewData] = React.useState<any>(null);

  return (
    <div className="mx-auto bg-gray-50">
      <div className="mx-auto">
        {/* Header */}
        <div className="sticky top-16 z-30 flex items-center justify-between bg-white px-6 py-3 shadow-none md:px-8 lg:px-16">
          <div className="flex items-center gap-3">
            <Link href="/admin/products">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <ChevronLeft className="h-10 w-10" />
              </Button>
            </Link>
            <h1 className="text-base font-semibold">Add New Product</h1>
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

        <ProductForm ref={formRef} />
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
