"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/site-owners/button";
import { LucideIcon, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";

interface BuilderEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionLink?: string;
  isEditable?: boolean;
  isEmpty?: boolean;
  onRefresh?: () => void | Promise<any>;
}

export const BuilderEmptyState: React.FC<BuilderEmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionLink,
  isEditable = false,
  isEmpty = true,
  onRefresh,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
    } finally {
      setIsRefreshing(false);
    }
  };
  if (!isEditable && !isEmpty) return null;

  if (isEmpty) {
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
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="default" className="gap-2">
              <Link href={actionLink} target="_blank" rel="noopener noreferrer">
                <Plus className="h-4 w-4" />
                {actionLabel}
              </Link>
            </Button>
            {onRefresh && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
                title="Refresh Data"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  if (isEditable && actionLabel && actionLink) {
    return (
      <div className="mt-8 flex justify-center">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="default" className="gap-2">
            <Link href={actionLink} target="_blank" rel="noopener noreferrer">
              <Plus className="h-4 w-4" />
              {actionLabel}
            </Link>
          </Button>
          {onRefresh && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh Data"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return null;
};
