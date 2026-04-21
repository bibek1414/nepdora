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
import { Skeleton } from "@/components/ui/skeleton";
import { ProductStat } from "@/types/owner-site/admin/stats";
import { PackageSearch } from "lucide-react";
import Image from "next/image";

interface TopSellingProductsProps {
  title: string;
  products: ProductStat[];
  isLoading?: boolean;
  showPercentage?: boolean;
  totalRevenue?: number;
}

function RankBadge({ rank }: { rank: number }) {
  const base =
    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold";
  if (rank === 1)
    return <span className={`${base} bg-amber-50 text-amber-600`}>1</span>;
  if (rank === 2)
    return <span className={`${base} bg-slate-100 text-slate-500`}>2</span>;
  if (rank === 3)
    return <span className={`${base} bg-orange-50 text-orange-500`}>3</span>;
  return <span className={`${base} bg-gray-50 text-gray-400`}>{rank}</span>;
}

export default function TopSellingProducts({
  title,
  products,
  isLoading,
  showPercentage,
  totalRevenue,
}: TopSellingProductsProps) {
  const maxAmount = products.length > 0 ? products[0].amount : 1;

  if (isLoading) {
    return (
      <div className="-[0_1px_3px_rgba(0,0,0,0.04)] rounded-xl border border-black/7 bg-white">
        <div className="border-b border-black/6 px-6 py-4">
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="space-y-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-b border-black/4 px-6 py-3.5 last:border-0"
            >
              <Skeleton className="h-9 w-9 shrink-0 rounded-md" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-2 w-24" />
              </div>
              <Skeleton className="h-3.5 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="-[0_1px_3px_rgba(0,0,0,0.04)] rounded-xl border border-black/7 bg-white">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-black/6 px-6 py-4">
        <p className="text-[15px] font-semibold text-gray-900">{title}</p>
        {products.length > 0 && (
          <span className="text-[12px] font-medium text-gray-400">
            {products.length} products
          </span>
        )}
      </div>

      {/* Empty state */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
            <PackageSearch className="h-5 w-5 text-gray-300" />
          </div>
          <p className="text-[13px] text-gray-400">
            No data available for this period
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-black/5 hover:bg-transparent">
                <TableHead className="w-8 pl-6 text-[12px] font-medium text-gray-400">
                  #
                </TableHead>
                <TableHead className="text-[12px] font-medium text-gray-400">
                  Product
                </TableHead>
                <TableHead className="text-right text-[12px] font-medium text-gray-400">
                  Qty
                </TableHead>
                <TableHead className="text-right text-[12px] font-medium text-gray-400">
                  Amount
                </TableHead>
                {showPercentage && (
                  <TableHead className="pr-6 text-right text-[12px] font-medium text-gray-400">
                    Share
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, i) => {
                const revPct =
                  showPercentage && totalRevenue
                    ? ((product.amount / totalRevenue) * 100).toFixed(1)
                    : null;
                const barPct = Math.min(
                  (product.amount / maxAmount) * 100,
                  100
                );

                return (
                  <TableRow
                    key={i}
                    className="group border-black/4 transition-colors hover:bg-gray-50/60"
                  >
                    {/* Rank */}
                    <TableCell className="py-3 pl-6">
                      <RankBadge rank={i + 1} />
                    </TableCell>

                    {/* Product */}
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border border-black/6 bg-gray-50">
                          <Image unoptimized
                            src={
                              product.product__thumbnail_image ||
                              "/fallback/image-not-found.png"
                            }
                            alt={product.product__name || "Product"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex min-w-0 flex-col gap-1">
                          <span className="line-clamp-1 text-[13px] font-medium text-gray-800">
                            {product.product__name || "Unknown Product"}
                          </span>
                          {/* Relative bar */}
                          <div className="h-1 w-20 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-blue-400 transition-all duration-500"
                              style={{ width: `${barPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Qty */}
                    <TableCell className="py-3 text-right text-[13px] text-gray-500">
                      {product.qty_sold}
                    </TableCell>

                    {/* Amount */}
                    <TableCell
                      className={`py-3 text-right text-[13px] font-semibold text-gray-800 ${!showPercentage ? "pr-6" : ""}`}
                    >
                      Rs. {product.amount.toLocaleString()}
                    </TableCell>

                    {/* % Share */}
                    {showPercentage && (
                      <TableCell className="py-3 pr-6 text-right text-[13px] font-semibold text-blue-600">
                        {revPct}%
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
