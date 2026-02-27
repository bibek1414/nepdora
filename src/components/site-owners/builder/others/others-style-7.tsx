import React from "react";
import { OthersTemplate7Data } from "@/types/owner-site/components/others";
import { EditableText } from "@/components/ui/editable-text";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { Eye, Shield, MapPin, Sparkles } from "lucide-react";

interface OthersTemplate7Props {
  othersData: OthersTemplate7Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<OthersTemplate7Data>) => void;
}

const getIconComponent = (iconName: string | undefined, className: string) => {
  switch (iconName) {
    case "Sparkles":
      return <Sparkles className={className} />;
    case "Eye":
      return <Eye className={className} />;
    case "MapPin":
      return <MapPin className={className} />;
    case "Shield":
      return <Shield className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};

export const OthersTemplate7: React.FC<OthersTemplate7Props> = ({
  othersData,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#000000",
      primary: "#111827",
      secondary: "#374151",
      background: "#FFFFFF",
    },
  };

  const handleUpdate =
    (field: keyof OthersTemplate7Data) => (value: string | any) => {
      onUpdate?.({ [field]: value });
    };

  const handleItemUpdate = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const newItems = [...(othersData.items || [])];
    if (newItems[index]) {
      newItems[index] = { ...newItems[index], [field]: value };
      onUpdate?.({ items: newItems });
    }
  };

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Heading */}
        <div className="mb-14 max-w-5xl">
          <EditableText
            value={othersData.heading}
            onChange={handleUpdate("heading")}
            as="h4"
            className="mb-2"
            style={{ color: theme.colors.primary }}
            isEditable={isEditable}
            multiline
          />
          <EditableText
            value={othersData.description}
            onChange={handleUpdate("description")}
            as="span"
            isEditable={isEditable}
            multiline
          />
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {(othersData.items || []).map((item, index) => (
            <div
              key={item.id || index}
              className="group rounded-2xl border border-gray-100 p-6 transition-all hover:border-gray-300"
            >
              <div
                className="mb-4 inline-flex rounded-xl bg-gray-50 p-3 transition group-hover:bg-gray-100"
                style={{ color: theme.colors.secondary }}
              >
                {getIconComponent(item.icon, "w-7 h-7")}
              </div>

              <EditableText
                value={item.title}
                onChange={val =>
                  handleItemUpdate(index, "title", val as string)
                }
                as="h5"
                style={{
                  color: theme.colors.primary,
                }}
                isEditable={isEditable}
                multiline
              />
              <EditableText
                value={item.description}
                onChange={val =>
                  handleItemUpdate(index, "description", val as string)
                }
                as="span"
                className="text-gray-600"
                isEditable={isEditable}
                multiline
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
