import React from "react";
import { OthersTemplate4Data } from "@/types/owner-site/components/others";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface OthersTemplate4Props {
  othersData: OthersTemplate4Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<OthersTemplate4Data>) => void;
}

export const OthersTemplate4: React.FC<OthersTemplate4Props> = ({
  othersData,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#000000",
      primary: "#111827",
      secondary: "#6B7280",
      background: "#F9FAFB",
    },
  };

  const handleUpdate =
    (field: keyof OthersTemplate4Data) => (value: string | any) => {
      onUpdate?.({ [field]: value });
    };

  const handleStepUpdate = (
    index: number,
    field: "title" | "description" | "image",
    value: string | { url: string; alt: string }
  ) => {
    const newSteps = [...(othersData.steps || [])];
    if (newSteps[index]) {
      newSteps[index] = { ...newSteps[index], [field]: value };
      onUpdate?.({ steps: newSteps });
    }
  };

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center md:text-left">
          <span>
            <EditableText
              value={othersData.subtitle}
              onChange={handleUpdate("subtitle")}
              as="h3"
              className="mb-2 text-sm font-bold tracking-widest uppercase"
              style={{ color: theme.colors.secondary }}
              isEditable={isEditable}
            />
          </span>
          <EditableText
            value={othersData.heading}
            onChange={handleUpdate("heading")}
            as="h4"
            style={{ color: theme.colors.primary }}
            isEditable={isEditable}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {(othersData.steps || []).map((step, index) => (
            <div
              key={step.id || index}
              className="flex flex-col items-start rounded-2xl bg-white p-6 text-left border "
            >
              <div className="mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-gray-100 ring-4 ring-gray-50">
                <EditableImage
                  src={step.image.url}
                  alt={step.image.alt}
                  onImageChange={url => {
                    if (url)
                      handleStepUpdate(index, "image", { ...step.image, url });
                  }}
                  onAltChange={alt => {
                    handleStepUpdate(index, "image", { ...step.image, alt });
                  }}
                  className="h-full w-full rounded-full object-cover"
                  isEditable={isEditable}
                />
              </div>
              <h3
                className="mb-3 text-xl font-bold"
                style={{ color: theme.colors.primary }}
              >
                <EditableText
                  value={step.title}
                  onChange={val =>
                    handleStepUpdate(index, "title", val as string)
                  }
                  as="h6"
                  isEditable={isEditable}
                  multiline
                />
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                <EditableText
                  value={step.description}
                  onChange={val =>
                    handleStepUpdate(index, "description", val as string)
                  }
                  as="p"
                  isEditable={isEditable}
                  multiline
                />
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
