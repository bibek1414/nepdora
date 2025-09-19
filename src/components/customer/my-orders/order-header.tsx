import StatusBadge from "./status-badge";
import { Order } from "@/types/customer/my-orders";

interface OrderHeaderProps {
  order: Order;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({ order }) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number | string): string => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

    if (isNaN(numAmount)) {
      return "₹0.00";
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(numAmount);
  };

  return (
    <div className="mx-2 rounded-t-xl border-b border-gray-100 bg-gray-50 p-3 sm:mx-0 sm:p-6">
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Mobile: Stack everything vertically */}
        <div className="sm:hidden">
          {/* Order number and status */}
          <div className="mb-3 flex flex-col gap-2">
            <h3 className="text-sm leading-tight font-bold text-gray-900">
              Order #{order.order_number}
            </h3>
            <div className="flex items-center justify-between">
              <StatusBadge status={order.status} />
              <div className="text-right">
                <p className="mb-1 text-xs text-gray-500">Total</p>
                <p className="text-sm font-bold text-gray-900">
                  {formatCurrency(order.total_amount)}
                </p>
              </div>
            </div>
          </div>

          {/* Date */}
          <p className="text-xs text-gray-600">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>

        {/* Desktop: Original horizontal layout */}
        <div className="hidden flex-row items-center justify-between gap-4 sm:flex">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <h3 className="text-xl font-bold text-gray-900">
                Order #{order.order_number}
              </h3>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-sm text-gray-600">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(order.total_amount)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHeader;
