import React, { useState } from "react";
import { Package } from "lucide-react";
import Image from "next/image";
import { OrderItem } from "@/types/customer/my-orders";
import { CreateReviewData } from "@/types/customer/review";
import { useCreateReview, useReviewForm } from "@/hooks/customer/use-reviews";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface OrderItemsProps {
  items: OrderItem[];
  orderStatus: string;
}

const OrderItems: React.FC<OrderItemsProps> = ({ items, orderStatus }) => {
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const createReviewMutation = useCreateReview();

  // Initialize review form with empty data
  const { reviewData, updateReviewData, resetForm, isValid } = useReviewForm();

  const formatCurrency = (amount: number | string): string => {
    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(numericAmount);
  };

  const handleReviewChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateReviewData(name as keyof CreateReviewData, value);
  };

  const submitReview = async (productId: number) => {
    if (!isValid) {
      return;
    }

    const reviewPayload: CreateReviewData = {
      product_id: productId,
      rating: reviewData.rating,
      review: reviewData.review,
    };

    try {
      await createReviewMutation.mutateAsync(reviewPayload);
      setOpenDialogId(null);
      resetForm();
    } catch (error) {
      // Error handling is done in the hook
      console.error("Review submission failed:", error);
    }
  };

  // Check if order is delivered to show review button
  const isDelivered = orderStatus?.toLowerCase() === "delivered";

  return (
    <div className="mb-4 px-2 sm:mb-6 sm:px-0">
      <h4 className="mb-3 text-base font-semibold text-gray-900 sm:mb-4 sm:text-lg">
        Order Items
      </h4>
      <div className="space-y-3 sm:space-y-4">
        {items?.map((item: OrderItem, index: number) => (
          <div
            key={index}
            className="flex items-start gap-3 rounded-lg bg-gray-50 p-3 sm:gap-4 sm:p-4"
          >
            {/* Product Image */}
            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white sm:h-16 sm:w-16 md:h-20 md:w-20">
              {item.product.thumbnail_image ? (
                <div className="relative h-full w-full">
                  <Image
                    src={item.product.thumbnail_image}
                    alt={
                      item.product.thumbnail_alt_description ||
                      item.product.name
                    }
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Package className="h-5 w-5 text-gray-400 sm:h-6 sm:w-6 md:h-8 md:w-8" />
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="min-w-0 flex-1">
              {/* Product Name with Review Button */}
              <div className="mb-2 flex items-start justify-between">
                <h5 className="line-clamp-2 flex-1 pr-2 text-sm leading-tight font-semibold text-gray-900 sm:text-base">
                  {item.product.name}
                </h5>

                {/* Only show Add Review button if order is delivered */}
                {isDelivered && (
                  <Dialog
                    open={openDialogId === item.product.id.toString()}
                    onOpenChange={open => {
                      setOpenDialogId(open ? item.product.id.toString() : null);
                      if (!open) resetForm();
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-shrink-0 text-xs sm:text-sm"
                        onClick={() =>
                          updateReviewData("product_id", item.product.id)
                        }
                      >
                        Add Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Review {item.product.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="rating"
                            className="mb-1 block text-sm font-medium"
                          >
                            Rating (1-5 stars){" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Input
                            id="rating"
                            type="number"
                            name="rating"
                            min="1"
                            max="5"
                            value={reviewData.rating || ""}
                            onChange={handleReviewChange}
                            placeholder="Enter rating (1-5)"
                            className={
                              !isValid && reviewData.rating === 0
                                ? "border-red-500"
                                : ""
                            }
                          />
                          {!isValid && reviewData.rating === 0 && (
                            <p className="mt-1 text-xs text-red-500">
                              Rating is required
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="review"
                            className="mb-1 block text-sm font-medium"
                          >
                            Review
                          </label>
                          <Textarea
                            id="review"
                            name="review"
                            value={reviewData.review}
                            onChange={handleReviewChange}
                            placeholder="Share your experience with this product..."
                            rows={4}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => submitReview(item.product.id)}
                            disabled={
                              createReviewMutation.isPending || !isValid
                            }
                            className="flex-1 text-white"
                          >
                            {createReviewMutation.isPending
                              ? "Submitting..."
                              : "Submit Review"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setOpenDialogId(null);
                              resetForm();
                            }}
                            disabled={createReviewMutation.isPending}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {/* Color and Size - Mobile and Desktop */}
              {(item.color || item.size) && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {item.color && (
                    <span className="rounded-md border bg-white px-2 py-1 text-xs font-medium text-gray-700 sm:text-sm">
                      Color: {item.color}
                    </span>
                  )}
                  {item.size && (
                    <span className="rounded-md border bg-white px-2 py-1 text-xs font-medium text-gray-700 sm:text-sm">
                      Size: {item.size}
                    </span>
                  )}
                </div>
              )}

              {/* Mobile Layout */}
              <div className="space-y-2 sm:hidden">
                <div className="flex items-center justify-between">
                  <span className="rounded border bg-white px-2 py-1 text-xs font-medium">
                    Qty: {item.quantity}
                  </span>
                  <div className="text-base font-bold text-gray-900">
                    {formatCurrency(parseFloat(item.price) * item.quantity)}
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  Unit Price: {formatCurrency(parseFloat(item.price))}
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden flex-col gap-2 sm:flex md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="rounded border bg-white px-2 py-1 font-medium">
                    Qty: {item.quantity}
                  </span>
                  <span>
                    Unit Price: {formatCurrency(parseFloat(item.price))}
                  </span>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(parseFloat(item.price) * item.quantity)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItems;
