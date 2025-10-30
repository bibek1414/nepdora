import { Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  OrderFilters as OrderFiltersType,
  StatusCounts,
} from "@/types/customer/my-orders";

interface StatusOption {
  key: keyof StatusCounts;
  label: string;
  color: string;
}

interface OrderFiltersProps {
  filters: OrderFiltersType;
  statusCounts: StatusCounts;
  onStatusFilter: (status: string) => void;
  onSearchChange: (search: string) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  filters,
  statusCounts,
  onStatusFilter,
  onSearchChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const statusOptions: StatusOption[] = [
    {
      key: "all",
      label: "All Orders",
      color: "bg-secondary text-primary border-gray-300",
    },
    {
      key: "pending",
      label: "Pending",
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    },
    {
      key: "confirmed",
      label: "Confirmed",
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    },
    {
      key: "processing",
      label: "Processing",
      color: "bg-orange-50 text-orange-700 border-orange-200",
    },
    {
      key: "shipped",
      label: "Shipped",
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      key: "delivered",
      label: "Delivered",
      color: "bg-green-50 text-green-700 border-green-200",
    },
    {
      key: "cancelled",
      label: "Cancelled",
      color: "bg-red-50 text-red-700 border-red-200",
    },
  ];

  const currentStatus = statusOptions.find(
    status => status.key === filters.status
  );

  const handleStatusSelect = (statusKey: string): void => {
    onStatusFilter(statusKey);
    setIsDropdownOpen(false);
  };

  // Helper function to safely get status count
  const getStatusCount = (status: string | undefined): number | undefined => {
    if (!status || !(status in statusCounts)) return undefined;
    return statusCounts[status as keyof StatusCounts];
  };

  return (
    <div className="mx-2 mb-4 rounded-xl border bg-white p-3 shadow-sm sm:mx-0 sm:mb-8 sm:p-6">
      {/* Search Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4">
            <Search className="h-4 w-4 text-gray-400 sm:h-5 sm:w-5" />
          </div>
          <input
            type="text"
            placeholder="Search orders..."
            value={filters.search || ""} // Handle undefined search
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onSearchChange(e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 py-2.5 pr-3 pl-10 text-sm transition-colors sm:py-3 sm:pr-4 sm:pl-12 sm:text-base"
          />
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-700 sm:mb-3">
          Filter by Status
        </h3>

        {/* Mobile Dropdown (screens < 640px) */}
        <div className="relative sm:hidden">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              currentStatus
                ? currentStatus.color + " shadow-sm"
                : "border-gray-200 bg-gray-50 text-gray-700"
            }`}
          >
            <div className="flex items-center">
              <span>{currentStatus?.label || "All Orders"}</span>
              {(() => {
                const count = getStatusCount(filters.status);
                return (
                  count !== undefined && (
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                        currentStatus ? "bg-opacity-70 bg-white" : "bg-gray-200"
                      }`}
                    >
                      {count}
                    </span>
                  )
                );
              })()}
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
              {statusOptions.map((status: StatusOption) => (
                <button
                  key={status.key}
                  onClick={() => handleStatusSelect(status.key)}
                  className={`w-full px-3 py-2.5 text-left text-sm font-medium transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50 ${
                    filters.status === status.key
                      ? "text-primary bg-gray-50"
                      : "text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{status.label}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        filters.status === status.key
                          ? "bg-gray-100"
                          : "bg-gray-200"
                      }`}
                    >
                      {statusCounts[status.key]}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Button Layout (screens >= 640px) */}
        <div className="hidden flex-wrap gap-2 sm:flex md:gap-3">
          {statusOptions.map((status: StatusOption) => (
            <button
              key={status.key}
              onClick={() => onStatusFilter(status.key)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 md:px-4 md:py-2.5 ${
                filters.status === status.key
                  ? status.color + " shadow-sm"
                  : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100"
              }`}
            >
              {status.label}
              <span
                className={`ml-1 rounded-full px-1.5 py-0.5 text-xs md:ml-2 md:px-2 ${
                  filters.status === status.key
                    ? "bg-opacity-70 bg-white"
                    : "bg-gray-200"
                }`}
              >
                {statusCounts[status.key]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;
