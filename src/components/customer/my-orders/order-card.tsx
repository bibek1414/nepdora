import OrderHeader from "./order-header";
import OrderItems from "./order-items";
import ShippingAddress from "./shipping-address";
import { Order } from "@/types/customer/my-orders";

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <div className="rounded-xl border bg-white shadow-sm transition-all duration-200">
      <OrderHeader order={order} />
      <div className="p-6">
        <OrderItems items={order.order_items} orderStatus={order.status} />
        <ShippingAddress order={order} />
      </div>
    </div>
  );
};

export default OrderCard;
