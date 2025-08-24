"use client";
import React from "react";
import { X } from "lucide-react";
import { AboutUsTemplate1 } from "./about-style-1";
import { AboutUsTemplate2 } from "./about-style-2";
import {
  defaultAboutUs1Data,
  defaultAboutUs2Data,
} from "@/types/owner-site/components/about";

interface AboutUsStylesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStyleSelect: (template: "about-1" | "about-2") => void;
}

const PreviewCard = ({
  title,
  description,
  children,
  onClick,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="group relative cursor-pointer rounded-xl border-2 border-gray-200 bg-white p-4 transition-all duration-200 hover:border-blue-500 hover:shadow-lg"
  >
    <div className="mb-3">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>

    <div className="relative h-48 overflow-hidden rounded-lg border bg-gray-50">
      <div className="h-[600px] w-[800px] origin-top-left scale-[0.28] transform-gpu">
        <div className="bg-white">{children}</div>
      </div>
    </div>

    <div className="absolute inset-0 rounded-xl bg-blue-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
  </div>
);

export const AboutUsStylesDialog: React.FC<AboutUsStylesDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <div className="relative mx-4 max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Choose About Us Template
            </h2>
            <p className="mt-1 text-gray-600">
              Select a template for your &quot;About Us&quot; section. Click a
              preview to add it.
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-120px)] overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <PreviewCard
              title="Split Layout with Stats"
              description="A classic layout featuring an image and statistics."
              onClick={() => onStyleSelect("about-1")}
            >
              <AboutUsTemplate1 aboutUsData={defaultAboutUs1Data} />
            </PreviewCard>

            <PreviewCard
              title="Team Showcase"
              description="Introduce the people behind your brand with profile cards."
              onClick={() => onStyleSelect("about-2")}
            >
              <AboutUsTemplate2 aboutUsData={defaultAboutUs2Data} />
            </PreviewCard>
          </div>
        </div>
      </div>
    </div>
  );
};
