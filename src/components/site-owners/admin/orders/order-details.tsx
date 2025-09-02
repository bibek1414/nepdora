import React from "react";
import Image from "next/image";
import { Order } from "@/types/owner-site/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Package2 } from "lucide-react";

interface OrderDetailsProps {
  order: Order;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const orderItems = order.order_items || order.items || [];

  return (
    <div className="grid grid-cols-1 gap-6 rounded-lg bg-gray-50 p-4 lg:grid-cols-2">
      {/* Customer Information - Left Side */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Package2 className="h-5 w-5" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Order Number</p>
              <p className="text-xs font-semibold text-[#4D7399]">
                {order.order_number}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Customer Name</p>
              <p className="text-xs font-medium">{order.customer_name}</p>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-xs">{order.customer_email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-xs">{order.customer_phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="mt-1 h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Customer Address
                </p>
                <p className="text-xs">{order.customer_address}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="mt-1 h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Shipping Address
                </p>
                <p className="text-xs">{order.shipping_address}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Order Date</p>
              <p className="text-xs">
                {new Date(order.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items - Right Side */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Package2 className="h-5 w-5" />
            Order Items ({orderItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orderItems.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-lg bg-white p-3"
              >
                {/* Product Image */}
                <div className="flex-shrink-0">
                  {item.product?.thumbnail_image ? (
                    <Image
                      src={item.product.thumbnail_image}
                      alt={
                        item.product.thumbnail_alt_description ||
                        item.product.name
                      }
                      width={60}
                      height={60}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-15 w-15 items-center justify-center rounded-md bg-gray-200">
                      <Package2 className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-grow">
                  <h4 className="font-medium text-[#4D7399]">
                    {item.product?.name || `Product #${item.product_id}`}
                  </h4>

                  <div className="mt-1 flex items-center gap-4">
                    <Badge variant="outline" className="text-xs">
                      Qty: {item.quantity}
                    </Badge>
                    <span className="text-sm font-medium">
                      ${item.price} each
                    </span>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}

            {orderItems.length === 0 && (
              <div className="py-6 text-center text-gray-500">
                <Package2 className="mx-auto mb-2 h-12 w-12 text-gray-300" />
                <p>No items found for this order</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
