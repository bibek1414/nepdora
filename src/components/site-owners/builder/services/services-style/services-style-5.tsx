"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, AlertCircle, Briefcase } from "lucide-react";
import { useServices } from "@/hooks/owner-site/admin/use-services";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EditableText } from "@/components/ui/editable-text";
import { ServicesComponentData } from "@/types/owner-site/components/services";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import { ServicesCard5 } from "../services-card/services-card5";
import { hexToRgba } from "@/lib/utils";

interface ServicesStyleProps {
  data: ServicesComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<ServicesComponentData["data"]>) => void;
  onServiceClick?: (serviceSlug: string) => void;
}

export const ServicesStyle5: React.FC<ServicesStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onServiceClick,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const { title = "", trustBadge = "Trust", trustText = "" } = data || {};

  const {
    data: servicesData,
    isLoading,
    error,
  } = useServices({
    page: 1,
    page_size: 4,
  });

  const services = servicesData?.results || [];

  const handleUpdate = (updates: Partial<ServicesComponentData["data"]>) => {
    onUpdate?.(updates);
  };

  const primaryColor = theme?.colors?.primary || "#3B82F6";

  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <EditableText
            as="h2"
            value={title}
            onChange={val => handleUpdate({ title: val })}
            isEditable={isEditable}
            className="text-[2rem] leading-[1.2] font-bold tracking-tight md:text-[2.6rem]"
            style={{
              fontFamily: theme?.fonts?.heading,
            }}
          />
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Services</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load services."}
            </AlertDescription>
          </Alert>
        ) : services.length === 0 ? (
          <BuilderEmptyState
            icon={Briefcase}
            title="No Services Available"
            description="List your services to attract clients. Add services from the admin dashboard."
            actionLabel="Manage Services"
            actionLink="/admin/services"
            isEditable={isEditable}
          />
        ) : (
          /* White card - overflow visible so image escapes */
          <div
            style={{
              position: "relative",
              borderRadius: "1.75rem",
              background: "#fff",
              overflow: "visible",
            }}
          >
            {services.map((service, index) => (
              <ServicesCard5
                key={service.id}
                service={service}
                isFirst={index === 0}
                isLast={index === services.length - 1}
                onServiceClick={onServiceClick}
                isEditable={isEditable}
              />
            ))}
          </div>
        )}

        {/* Trust Bar */}
        <div className="mt-16 flex justify-center">
          <div
            className="flex items-center gap-4 rounded-full px-3 py-2 pr-8"
            style={{ backgroundColor: hexToRgba(primaryColor, 0.1) }}
          >
            <span
              className="rounded-full px-5 py-2 text-center text-sm font-bold"
              style={{
                backgroundColor: primaryColor,
                color: theme?.colors?.primaryForeground || "#FFFFFF",
              }}
            >
              <EditableText
                value={trustBadge}
                onChange={val => handleUpdate({ trustBadge: val })}
                isEditable={isEditable}
                placeholder="Trust"
              />
            </span>
            <div className="text-sm font-medium">
              <EditableText
                value={
                  trustText ||
                  "Join the 850+ partners funding our essential child safety initiatives"
                }
                onChange={val => handleUpdate({ trustText: val })}
                isEditable={isEditable}
                placeholder="Join the 850+ partners..."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
