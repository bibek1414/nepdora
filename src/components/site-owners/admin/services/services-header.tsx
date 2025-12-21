import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";

interface ServicesHeaderProps {
  onCreateNew: () => void;
  onRefresh?: () => void;
  servicesCount?: number;
}

const ServicesHeader: React.FC = () => {
  return (
    <div className="mb-5">
      <h1 className="text-xl font-bold text-[#003d79]">Services</h1>
    </div>
  );
};

export default ServicesHeader;
