import React from "react";

interface FeatureCardProps {
  children: React.ReactNode;
  className?: string;
  idx: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  children,
  className,
  idx: _idx,
}) => {
  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-4xl border ${className}`}
    >
      {children}
    </div>
  );
};
