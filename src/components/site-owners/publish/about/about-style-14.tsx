"use client";
import React, { useState } from "react";
import {
  AboutUs14Data,
  AboutUs14Service,
} from "@/types/owner-site/components/about";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface AboutUsTemplate14Props {
  aboutUsData: AboutUs14Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<AboutUs14Data>) => void;
}

export function AboutUsTemplate14({
  aboutUsData,
  isEditable = false,
  onUpdate,
}: AboutUsTemplate14Props) {
  const [data, setData] = useState(aboutUsData);
  const [activeService, setActiveService] = useState(0);

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

  return (
    <section id="services" className="bg-white py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-16 flex flex-col items-end justify-between md:flex-row">
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
          <Button className="hidden md:inline-flex">
            <EditableText
              value={data.buttonText}
              onChange={handleTextUpdate("buttonText")}
              as="span"
              isEditable={isEditable}
              placeholder="Button Text"
            />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24">
          {/* Accordion List */}
          <div className="space-y-6">
            {data.services.map((service, idx) => (
              <div
                key={service.id}
                className={`group cursor-pointer border-b border-gray-100 pb-6 transition-all duration-300`}
                onClick={() => setActiveService(idx)}
              >
                <div className="mb-4 flex items-center gap-6">
                  <span
                    className={`text-lg font-medium ${activeService === idx ? "text-blue-700" : "text-gray-400 group-hover:text-gray-600"}`}
                  >
                    [{service.id}]
                  </span>
                  <div
                    className={`text-2xl font-medium ${activeService === idx ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600"}`}
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

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${activeService === idx ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="pl-14">
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
                          <Check size={16} className="text-blue-600" />
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
                </div>
              </div>
            ))}
          </div>

          {/* Right Image */}
          <div className="relative h-[550px] overflow-hidden rounded-2xl shadow-2xl">
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
          </div>
        </div>
      </div>
    </section>
  );
}
