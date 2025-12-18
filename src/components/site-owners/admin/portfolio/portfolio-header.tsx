import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PortfoliosHeaderProps {
  onCreateNew: () => void;
  portfoliosCount?: number;
}

const PortfoliosHeader: React.FC<PortfoliosHeaderProps> = ({
  onCreateNew,
  portfoliosCount,
}) => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Portfolio
        </h1>
        <p className="text-sm text-slate-500">
          Manage your portfolio items and showcase your work.
          {portfoliosCount !== undefined && (
            <span className="ml-2 font-semibold text-slate-700">
              {portfoliosCount} total item{portfoliosCount !== 1 ? "s" : ""}
            </span>
          )}
        </p>
      </div>

      <Button
        onClick={onCreateNew}
        className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800"
      >
        <Plus className="mr-2 h-4 w-4" />
        Create New
      </Button>
    </div>
  );
};

export default PortfoliosHeader;
