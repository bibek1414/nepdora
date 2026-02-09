import React from "react";
import { Button } from "@/components/ui/site-owners/button";
import { Plus, Sparkles } from "lucide-react";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface PlaceholderManagerProps {
  isLoading: boolean;
  pageComponentsLength: number;
  onAddSection: () => void;
}

export const PlaceholderManager: React.FC<PlaceholderManagerProps> = ({
  isLoading,
  pageComponentsLength,
  onAddSection,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  if (isLoading) return null;

  if (pageComponentsLength === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 rounded-full bg-gray-100 p-6">
          <Sparkles
            className="h-12 w-12"
            style={{ color: theme.colors.primary }}
          />
        </div>
        <h3
          className="text-foreground mb-2 text-xl font-semibold"
          style={{ fontFamily: theme.fonts.heading }}
        >
          No Sections Added Yet
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Start building your page by adding your first section from the
          component library.
        </p>
        <Button onClick={onAddSection} variant="default" className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Section
        </Button>
      </div>
    );
  }

  return null;
};
