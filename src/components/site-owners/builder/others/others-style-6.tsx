import React from "react";
import { OthersTemplate6Data } from "@/types/owner-site/components/others";
import { EditableText } from "@/components/ui/editable-text";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { ShieldCheck, Truck, RotateCcw, Eye } from "lucide-react";

interface OthersTemplate6Props {
  othersData: OthersTemplate6Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<OthersTemplate6Data>) => void;
}

const getIconComponent = (iconName: string | undefined, className: string) => {
  switch (iconName) {
    case "Eye":
      return <Eye className={className} />;
    case "Truck":
      return <Truck className={className} />;
    case "RotateCcw":
      return <RotateCcw className={className} />;
    case "ShieldCheck":
      return <ShieldCheck className={className} />;
    default:
      return <ShieldCheck className={className} />;
  }
};

export const OthersTemplate6: React.FC<OthersTemplate6Props> = ({
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
    <section className="border-y border-gray-100 bg-white py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 text-center md:grid-cols-4">
        {(othersData.items || []).map((item, index) => (
          <div
            key={item.id || index}
            className="flex cursor-default flex-col items-center gap-2 rounded-xl p-4 transition-all hover:bg-gray-50"
          >
            <div className="mb-2" style={{ color: theme.colors.secondary }}>
              {getIconComponent(item.icon, "w-6 h-6")}
            </div>
            <p
              className="text-sm font-semibold"
              style={{ color: theme.colors.primary }}
            >
              <EditableText
                value={item.title}
                onChange={val =>
                  handleItemUpdate(index, "title", val as string)
                }
                as="span"
                isEditable={isEditable}
                multiline
              />
            </p>
            <p className="text-xs text-gray-500">
              <EditableText
                value={item.description}
                onChange={val =>
                  handleItemUpdate(index, "description", val as string)
                }
                as="span"
                isEditable={isEditable}
                multiline
              />
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
