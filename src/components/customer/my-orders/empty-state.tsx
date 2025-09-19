import { ShoppingBag } from "lucide-react";
import { OrderFilters } from "@/types/customer/my-orders";

interface EmptyStateProps {
  filters: OrderFilters;
}

const EmptyState: React.FC<EmptyStateProps> = ({ filters }) => {
  return (
    <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
      <div className="mb-6 text-gray-300">
        <ShoppingBag className="mx-auto h-16 w-16" />
      </div>
      <h3 className="mb-3 text-xl font-semibold text-gray-900">
        No orders found
      </h3>
      <p className="mx-auto max-w-md text-gray-500">
        {filters.search
          ? `No orders found matching "${filters.search}". Try adjusting your search terms.`
          : filters.status === "all"
            ? "You haven't placed any orders yet. Start shopping to see your orders here!"
            : `No ${filters.status} orders found. Try selecting a different status filter.`}
      </p>
      {(filters.search || filters.status !== "all") && (
        <button
          onClick={() => window.location.reload()}
          className="text-primary hover:text-primary/80 mt-4 px-4 py-2 text-sm underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;
