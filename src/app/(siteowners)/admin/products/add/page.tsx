import { ProductForm } from "@/components/site-owners/admin/products/product-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AddProductPage() {
  return (
    <div className="container mx-auto mt-15 py-6">
      <div className="mb-6">
        <div className="mb-4 flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/products" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
      </div>

      <div className="mx-auto">
        <ProductForm />
      </div>
    </div>
  );
}
