"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AboutUs14Data,
  AboutUs14Service,
} from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { Check, ArrowUpRight } from "lucide-react";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface AboutUsTemplate14Props {
  aboutUsData: AboutUs14Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs14Data>) => void;
  siteUser?: string;
}

export function AboutUsTemplate14({
  aboutUsData,
  isEditable = false,
  onUpdate,
  siteUser,
}: AboutUsTemplate14Props) {
  const [data, setData] = useState(aboutUsData);
  const [activeService, setActiveService] = useState(0);
  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with fallback to defaults
  const theme = useMemo(
    () =>
      themeResponse?.data?.[0]?.data?.theme || {
        colors: {
          text: "#0F172A",
          primary: "#3C32E7",
          primaryForeground: "#FFFFFF",
          secondary: "#F59E0B",
          secondaryForeground: "#1F2937",
          background: "#FFFFFF",
        },
        fonts: {
          body: "Inter",
          heading: "Poppins",
        },
      },
    [themeResponse]
  );

  // Handle text field updates
  const handleTextUpdate = (field: keyof AboutUs14Data) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<AboutUs14Data>);
  };

  // Handle service updates
  const handleServiceUpdate =
    (serviceId: string, field: keyof AboutUs14Service, pointIndex?: number) =>
    (value: string) => {
      const updatedServices = data.services.map(service => {
        if (service.id === serviceId) {
          if (field === "points" && typeof pointIndex === "number") {
            const newPoints = [...service.points];
            newPoints[pointIndex] = value;
            return { ...service, points: newPoints };
          }
          return { ...service, [field]: value };
        }
        return service;
      });
      const updatedData = { ...data, services: updatedServices };
      setData(updatedData);
      onUpdate?.({ services: updatedServices });
    };

  // Handle image updates
  const handleImageUpdate = (serviceId: string) => (imageUrl: string) => {
    const updatedServices = data.services.map(service =>
      service.id === serviceId ? { ...service, image: imageUrl } : service
    );
    const updatedData = { ...data, services: updatedServices };
    setData(updatedData);
    onUpdate?.({ services: updatedServices });
  };

  // Handle button link updates
  const handleButtonLinkUpdate = (text: string, href: string) => {
    const updatedData = {
      ...data,
      buttonText: text,
      buttonLink: href,
    };
    setData(updatedData);
    onUpdate?.({
      buttonText: text,
      buttonLink: href,
    });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.section
      id="services"
      className="bg-white py-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: 0.15 }}
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          className="mb-16 flex flex-col items-end justify-between md:flex-row"
          variants={fadeInUp}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="mb-0 max-w-xl">
            <div className="flex flex-wrap gap-2 text-3xl font-bold text-gray-900 md:text-4xl">
              <EditableText
                value={data.title}
                onChange={handleTextUpdate("title")}
                as="span"
                isEditable={isEditable}
                placeholder="Enter title..."
              />
            </div>
          </div>
          <EditableLink
            text={data.buttonText}
            href={data.buttonLink || "#"}
            onChange={handleButtonLinkUpdate}
            style={{
              backgroundColor: theme.colors.primary,
              fontFamily: theme.fonts.body,
            }}
            className="group flex w-full items-center justify-between rounded-full py-2 pr-2 pl-8 text-[15px] font-medium text-white shadow-lg shadow-blue-900/10 transition-colors hover:opacity-90 md:w-auto md:min-w-[180px]"
            textPlaceholder="Button Text"
            hrefPlaceholder="#"
            isEditable={isEditable}
            siteUser={siteUser}
          >
            <>
              <span>{data.buttonText || "Button Text"}</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight
                  className="h-5 w-5"
                  style={{ color: theme.colors.primary }}
                />
              </span>
            </>
          </EditableLink>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16"
          variants={fadeIn}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Accordion List */}
          <motion.div
            className="space-y-6"
            variants={fadeInUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {data.services.map((service, idx) => {
              const isActive = activeService === idx;
              return (
                <motion.div
                  key={service.id}
                  className="group cursor-pointer border-b border-gray-100 pb-6"
                  onClick={() => setActiveService(idx)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeInUp}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <div className="mb-4 flex items-center gap-6">
                    <span
                      className={`text-lg font-medium transition-colors duration-300 ${
                        isActive
                          ? "text-gray-900"
                          : "text-gray-400 group-hover:text-gray-600"
                      }`}
                      style={
                        isActive ? { color: theme.colors.primary } : undefined
                      }
                    >
                      [{service.id}]
                    </span>
                    <div
                      className={`text-lg transition-colors duration-300 ${
                        isActive
                          ? "text-gray-900"
                          : "text-gray-400 group-hover:text-gray-600"
                      }`}
                    >
                      <EditableText
                        value={service.title}
                        onChange={handleServiceUpdate(service.id, "title")}
                        as="h4"
                        isEditable={isEditable}
                        placeholder="Service Title"
                      />
                    </div>
                  </div>

                  <motion.div
                    className="overflow-hidden"
                    initial={false}
                    animate={{
                      height: isActive ? "auto" : 0,
                      opacity: isActive ? 1 : 0,
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div className="pt-1 pb-4 pl-14">
                      <div className="mb-6 max-w-md text-sm leading-relaxed text-gray-500">
                        <EditableText
                          value={service.description}
                          onChange={handleServiceUpdate(
                            service.id,
                            "description"
                          )}
                          as="p"
                          isEditable={isEditable}
                          multiline
                          placeholder="Service Description"
                        />
                      </div>
                      <ul className="space-y-3">
                        {service.points.map((point, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-3 text-sm font-medium text-gray-800"
                          >
                            <Check
                              size={16}
                              className="text-blue-600"
                              style={{ color: theme.colors.primary }}
                            />
                            <EditableText
                              value={point}
                              onChange={handleServiceUpdate(
                                service.id,
                                "points",
                                i
                              )}
                              as="span"
                              isEditable={isEditable}
                              placeholder="Point"
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Right Image */}
          <motion.div
            className="relative h-[550px] overflow-hidden rounded-2xl shadow-2xl"
            variants={fadeInUp}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            {data.services[activeService] && (
              <EditableImage
                src={data.services[activeService].image}
                alt={data.services[activeService].title}
                onImageChange={handleImageUpdate(
                  data.services[activeService].id
                )}
                isEditable={isEditable}
                className="h-full w-full object-cover transition-opacity duration-500"
                width={800}
                height={800}
                priority
                cloudinaryOptions={{
                  folder: "about-us-images",
                  resourceType: "image",
                }}
              />
            )}
            {/* Gradient Overlay for subtle text contrast if needed */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
