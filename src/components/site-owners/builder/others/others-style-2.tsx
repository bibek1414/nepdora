import React from "react";
import { OthersTemplate2Data } from "@/types/owner-site/components/others";
import { EditableText } from "@/components/ui/editable-text";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { ShieldCheck, Truck, RotateCcw, Eye } from "lucide-react";

interface OthersTemplate2Props {
  othersData: OthersTemplate2Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<OthersTemplate2Data>) => void;
}

export const OthersTemplate2: React.FC<OthersTemplate2Props> = ({
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
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 text-center md:grid-cols-4">
        {(othersData.items || []).map((item, index) => (
          <div
            key={item.id || index}
            className="flex flex-col items-center gap-2 rounded-xl p-4 transition-all hover:bg-gray-50"
          >
            <EditableText
              value={item.title}
              onChange={val => handleItemUpdate(index, "title", val as string)}
              style={{ color: theme.colors.primary }}
              as="h5"
              isEditable={isEditable}
              multiline
            />
            <EditableText
              value={item.description}
              onChange={val =>
                handleItemUpdate(index, "description", val as string)
              }
              as="p"
              isEditable={isEditable}
              multiline
            />
          </div>
        ))}
      </div>
    </section>
  );
};
