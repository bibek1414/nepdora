import { MapPin, User, Phone } from "lucide-react";
import { Order } from "@/types/customer/my-orders";

interface ShippingAddressProps {
  order: Order;
}

const ShippingAddress: React.FC<ShippingAddressProps> = ({ order }) => {
  return (
    <div className="border-t border-gray-200 px-2 pt-4 sm:px-0 sm:pt-6">
      <h4 className="mb-3 text-base font-semibold text-gray-900 sm:mb-4 sm:text-lg">
        Shipping Information
      </h4>
      <div className="rounded-lg border p-3 sm:p-4">
        <div className="space-y-3 sm:space-y-3">
          {/* Customer Name */}
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="mt-0.5 flex-shrink-0">
              <User className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-600 sm:text-sm">
                Recipient
              </p>
              <p className="text-sm font-semibold break-words text-gray-900 sm:text-base">
                {order.customer_name}
              </p>
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="mt-0.5 flex-shrink-0">
              <Phone className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-600 sm:text-sm">
                Phone
              </p>
              <p className="text-sm break-all text-gray-900 sm:text-base">
                {order.customer_phone}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="mt-0.5 flex-shrink-0">
              <MapPin className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-600 sm:text-sm">
                Delivery Address
              </p>
              <div className="mt-1 space-y-1 text-sm text-gray-900 sm:text-base">
                <p className="leading-tight font-medium break-words">
                  {order.shipping_address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingAddress;
