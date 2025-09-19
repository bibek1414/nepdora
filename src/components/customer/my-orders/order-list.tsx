import OrderCard from "./order-card";
import { Order } from "@/types/customer/my-orders";

interface OrdersListProps {
  orders: Order[];
}

const OrdersList: React.FC<OrdersListProps> = ({ orders }) => {
  return (
    <div className="space-y-6">
      {orders.map((order: Order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

export default OrdersList;
