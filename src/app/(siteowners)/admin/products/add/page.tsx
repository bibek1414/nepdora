import { ProductForm } from "@/components/site-owners/admin/products/product-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AddProductPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
        <p className="text-muted-foreground">
          Create a new product for your inventory
        </p>
      </div>

      <div className="max-w-4xl">
        <ProductForm />
      </div>
    </div>
  );
}
