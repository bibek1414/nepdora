"use client";

import React from "react";
import { motion } from "framer-motion";
import { useServices } from "@/hooks/owner-site/admin/use-services";
import { EditableText } from "@/components/ui/editable-text";
import { ServicesComponentData } from "@/types/owner-site/components/services";
import { ServicesCard4 } from "../services-card/services-card4";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import { Briefcase } from "lucide-react";

interface ServicesStyle4Props {
  data: ServicesComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<ServicesComponentData["data"]>) => void;
  onServiceClick?: (serviceSlug: string) => void;
}

export const ServicesStyle4: React.FC<ServicesStyle4Props> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onServiceClick,
}) => {
  const {
    title = "Accounting & Finance Services for Your Business",
    tag = "[What We Offer]",
    italicWord = "Business",
  } = data || {};
  const { data: servicesData, isLoading , refetch } = useServices({
    page: 1,
    page_size: 6,
  });

  const services = servicesData?.results || [];

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleTagChange = (newTag: string) => {
    onUpdate?.({ tag: newTag });
  };

  const handleItalicWordChange = (newItalicWord: string) => {
    onUpdate?.({ italicWord: newItalicWord });
  };

  const renderTitle = () => {
    if (!italicWord || !title.includes(italicWord)) {
      return title;
    }
    const parts = title.split(italicWord);
    return (
      <>
        {parts[0]}
        <em className="text-primary-600 italic">{italicWord}</em>
        {parts[1]}
      </>
    );
  };

  return (
    <section id="services-8" className="bg-gray-50/50 py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          className="mx-auto mb-16 max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <EditableText
            value={tag}
            onChange={handleTagChange}
            as="p"
            className="text-primary-600 mb-2 text-sm font-medium tracking-wider uppercase"
            isEditable={isEditable}
            placeholder="Enter tag..."
          />
          <div className="space-y-4">
            <EditableText
              value={title}
              onChange={handleTitleChange}
              as="h2"
              isEditable={isEditable}
              placeholder="Enter title..."
            />
          </div>
        </motion.div>

        {isLoading && (
          <div className="py-10 text-center text-gray-500">
            Loading services...
          </div>
        )}
        {!isLoading && services.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, idx) => (
              <ServicesCard4
                key={service.id}
                service={service}
                idx={idx}
                siteUser={siteUser}
                isEditable={isEditable}
                onServiceClick={onServiceClick}
              />
            ))}
          </div>
        )}
        {!isLoading && (
          <BuilderEmptyState
            icon={Briefcase}
            title="No Services Found"
            description="List your services to attract clients. Add services from the admin dashboard."
            actionLabel="Add New Services"
            actionLink="/admin/services"
            isEditable={isEditable}
           isEmpty={services.length === 0} onRefresh={refetch}
          />
        )}
      </div>
    </section>
  );
};
