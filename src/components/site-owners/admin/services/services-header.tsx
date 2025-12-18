import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";

interface ServicesHeaderProps {
  onCreateNew: () => void;
  onRefresh?: () => void;
  servicesCount?: number;
}

const ServicesHeader: React.FC<ServicesHeaderProps> = ({
  onCreateNew,
  servicesCount,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Services
        </h1>
        <p className="text-sm text-slate-500">
          Manage your services.{" "}
          <span className="font-semibold text-slate-700">{servicesCount}</span>{" "}
          {servicesCount === 1 ? "service" : "services"} available.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={onCreateNew}
          className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>
    </div>
  );
};

export default ServicesHeader;
