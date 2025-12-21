import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PortfoliosHeaderProps {
  onCreateNew?: () => void;
  portfoliosCount?: number;
}

const PortfoliosHeader: React.FC<PortfoliosHeaderProps> = () => {
  return (
    <div className="mb-5">
      <h1 className="text-xl font-bold text-[#003d79]">Portfolio</h1>
    </div>
  );
};

export default PortfoliosHeader;
