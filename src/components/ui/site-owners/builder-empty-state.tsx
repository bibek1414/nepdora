"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/site-owners/button";
import { LucideIcon, Plus } from "lucide-react";

interface BuilderEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionLink?: string;
  isEditable?: boolean;
}

export const BuilderEmptyState: React.FC<BuilderEmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionLink,
  isEditable = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-muted mb-6 flex h-20 w-20 items-center justify-center rounded-full">
        <Icon className="text-muted-foreground h-10 w-10" />
      </div>
      <h3 className="text-foreground mb-2 text-2xl font-semibold">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-8 max-w-sm">{description}</p>
      )}
      {isEditable && actionLabel && actionLink && (
        <Button asChild variant="default" className="gap-2">
          <Link href={actionLink} target="_blank" rel="noopener noreferrer">
            <Plus className="h-4 w-4" />
            {actionLabel}
          </Link>
        </Button>
      )}
    </div>
  );
};
