"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductStat } from "@/types/owner-site/admin/stats";
import Image from "next/image";

interface TopSellingProductsProps {
  title: string;
  products: ProductStat[];
  isLoading?: boolean;
  showPercentage?: boolean;
  totalRevenue?: number;
}

export default function TopSellingProducts({
  title,
  products,
  isLoading,
  showPercentage,
  totalRevenue,
}: TopSellingProductsProps) {
  if (isLoading) {
    return (
      <Card className="border-none shadow-sm">
        <CardHeader className="px-0!">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="px-0!">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="text-muted-foreground flex h-32 flex-col items-center justify-center">
            <div className="mb-2 rounded-full bg-slate-100 p-3">
              <Image
                src="/images/site-owners/dashboard/dashboard1.svg"
                alt="No data"
                width={24}
                height={24}
                className="opacity-20"
              />
            </div>
            <p className="text-sm">No data available for this range</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Product</TableHead>
                  <TableHead className="text-left">Qty Sold</TableHead>
                  <TableHead className="text-left">Amount</TableHead>
                  {showPercentage && (
                    <TableHead className="text-left">% Revenue</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-slate-50">
                          <Image
                            src={
                              product.product__thumbnail_image ||
                              "/fallback/image-not-found.png"
                            }
                            alt={product.product__name || "Product"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="line-clamp-1">
                          {product.product__name || "Unknown Product"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-left">
                      {product.qty_sold}
                    </TableCell>
                    <TableCell className="text-left font-semibold">
                      Rs. {product.amount.toLocaleString()}
                    </TableCell>
                    {showPercentage && totalRevenue && (
                      <TableCell className="text-left font-medium text-blue-600">
                        {((product.amount / totalRevenue) * 100).toFixed(1)}%
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
