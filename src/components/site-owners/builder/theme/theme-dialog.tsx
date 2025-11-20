"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  useThemeQuery,
  useCreateThemeMutation,
  useUpdateThemeMutation,
} from "@/hooks/owner-site/components/use-theme";
import {
  ThemeData,
  ThemeColors,
  ThemeFonts,
  defaultThemeData,
} from "@/types/owner-site/components/theme";
import { Palette, Save, Type } from "lucide-react";
import { toast } from "sonner";

interface ThemeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
  onSaveComplete?: () => void;
}

const fontOptions = [
  { value: "Public Sans", label: "Public Sans" },
  { value: "Inter", label: "Inter" },
  { value: "DM Sans", label: "DM Sans" },
  { value: "Nunito Sans", label: "Nunito Sans" },
  { value: "Poppins", label: "Poppins" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Merriweather", label: "Merriweather" },
  { value: "Lato", label: "Lato" },
];

const predefinedColors = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#FFFFFF",
  "#6366F1",
  "#14B8A6",
  "#F43F5E",
  "#22C55E",
  "#A855F7",
  "#0EA5E9",
  "#EAB308",
  "#DC2626",
  "#000000",
];

// Memoized ColorPicker component to prevent unnecessary re-renders
const ColorPicker = memo(
  ({
    label,
    colorKey,
    value,
    description,
    onChange,
    previewColors,
  }: {
    label: string;
    colorKey: string;
    value: string;
    description?: string;
    onChange: (value: string) => void;
    previewColors: ThemeColors;
  }) => {
    const [textValue, setTextValue] = useState(value);

    // Sync textValue when value prop changes from outside (like preset clicks)
    useEffect(() => {
      setTextValue(value);
    }, [value]);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setTextValue(newValue);

      // Only update parent if it's a valid color format
      if (
        newValue.startsWith("#") &&
        (newValue.length === 4 || newValue.length === 7)
      ) {
        onChange(newValue);
      } else if (newValue.startsWith("#")) {
        // Still update parent even for incomplete hex codes
        onChange(newValue);
      }
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setTextValue(newValue);
      onChange(newValue);
    };

    const handlePresetClick = (color: string) => {
      setTextValue(color);
      onChange(color);
    };

    const getPreviewColor = () => {
      if (colorKey.includes("Foreground")) return value;
      if (colorKey === "background") return previewColors.text;
      if (colorKey === "text") return previewColors.background;
      return "#fff";
    };

    return (
      <div className="space-y-3">
        <div className="space-y-1">
          <Label className="text-sm font-medium">{label}</Label>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-200 text-xs font-medium shadow-sm"
              style={{
                backgroundColor: value,
                color: getPreviewColor(),
              }}
            >
              Aa
            </div>
          </div>

          <div className="grid grid-cols-6 gap-1">
            {predefinedColors.map(color => (
              <button
                key={color}
                type="button"
                className="relative h-8 w-8 rounded-md border-2 border-gray-200 transition-colors hover:scale-105 hover:border-gray-400"
                style={{ backgroundColor: color }}
                onClick={() => handlePresetClick(color)}
              >
                {value === color && (
                  <svg
                    className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-sm"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="color"
              value={value}
              onChange={handleColorChange}
              className="h-10 w-16 cursor-pointer rounded border p-1"
            />
            <Input
              type="text"
              value={textValue}
              onChange={handleTextChange}
              className="flex-1 font-mono text-sm"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>
    );
  }
);

ColorPicker.displayName = "ColorPicker";

// Memoized FontSelector component
const FontSelector = memo(
  ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
  }) => (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {fontOptions.slice(0, 4).map(font => (
          <button
            key={font.value}
            type="button"
            className={`relative rounded-lg border-2 p-3 text-left transition-all hover:shadow-md ${
              value === font.value
                ? "border-blue-500 bg-blue-50 shadow-sm"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onChange(font.value)}
          >
            <div className="space-y-1">
              <div
                className="text-lg font-medium"
                style={{ fontFamily: font.value }}
              >
                Aa
              </div>
              <div className="text-xs text-gray-600">{font.label}</div>
            </div>
            {value === font.value && (
              <svg
                className="absolute top-2 right-2 h-4 w-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>
        ))}
      </div>

      <div className="max-h-32 overflow-y-auto rounded-md border">
        {fontOptions.slice(4).map(font => (
          <button
            key={font.value}
            type="button"
            className={`w-full border-b px-3 py-2 text-left transition-colors last:border-b-0 hover:bg-gray-50 ${
              value === font.value ? "border-blue-200 bg-blue-50" : ""
            }`}
            onClick={() => onChange(font.value)}
            style={{ fontFamily: font.value }}
          >
            <div className="flex items-center justify-between">
              <span>{font.label}</span>
              {value === font.value && (
                <svg
                  className="h-4 w-4 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
);

FontSelector.displayName = "FontSelector";

export const ThemeDialog: React.FC<ThemeDialogProps> = ({
  open,
  onOpenChange,
  trigger,
  onSaveComplete,
}) => {
  const { data: themesResponse, isLoading } = useThemeQuery();
  const createThemeMutation = useCreateThemeMutation();
  const updateThemeMutation = useUpdateThemeMutation();

  const [currentTheme, setCurrentTheme] = useState<ThemeData>(defaultThemeData);
  const [hasChanges, setHasChanges] = useState(false);

  // Load current theme
  useEffect(() => {
    if (themesResponse?.data && themesResponse.data.length > 0) {
      const firstTheme = themesResponse.data[0];
      setCurrentTheme(firstTheme.data.theme);
    }
  }, [themesResponse]);

  // Memoized color change handler
  const handleColorChange = useCallback(
    (colorKey: keyof ThemeColors, value: string) => {
      setCurrentTheme(prev => ({
        ...prev,
        colors: {
          ...prev.colors,
          [colorKey]: value,
        },
      }));
      setHasChanges(true);
    },
    []
  );

  // Memoized font change handler
  const handleFontChange = useCallback(
    (fontKey: keyof ThemeFonts, value: string) => {
      setCurrentTheme(prev => ({
        ...prev,
        fonts: {
          ...prev.fonts,
          [fontKey]: value,
        },
      }));
      setHasChanges(true);
    },
    []
  );

  const handleSave = () => {
    const saveOperation =
      themesResponse?.data && themesResponse.data.length > 0
        ? updateThemeMutation.mutateAsync({
            id: themesResponse.data[0].id,
            data: { theme: currentTheme },
          })
        : createThemeMutation.mutateAsync({
            data: { theme: currentTheme },
          });

    saveOperation
      .then(() => {
        setHasChanges(false);
        toast.success("Theme saved successfully");
        onOpenChange(false);
        onSaveComplete?.();
      })
      .catch(error => {
        toast.error("Failed to save theme");
        console.error("Error saving theme:", error);
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Settings
          </DialogTitle>
          <DialogDescription>
            Customize your website&apos;s appearance with colors, fonts, and
            sizes.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-6 overflow-auto">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Colors</h3>
            <div className="grid gap-6">
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-700">
                  Primary Colors
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <ColorPicker
                    label="Primary Background"
                    colorKey="primary"
                    value={currentTheme.colors.primary}
                    description="Main brand color for buttons and highlights"
                    onChange={value => handleColorChange("primary", value)}
                    previewColors={currentTheme.colors}
                  />
                  <ColorPicker
                    label="Primary Text"
                    colorKey="primaryForeground"
                    value={currentTheme.colors.primaryForeground}
                    description="Text color on primary background"
                    onChange={value =>
                      handleColorChange("primaryForeground", value)
                    }
                    previewColors={currentTheme.colors}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-700">
                  Secondary Colors
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <ColorPicker
                    label="Secondary Background"
                    colorKey="secondary"
                    value={currentTheme.colors.secondary}
                    description="Accent color for secondary elements"
                    onChange={value => handleColorChange("secondary", value)}
                    previewColors={currentTheme.colors}
                  />
                  <ColorPicker
                    label="Secondary Text"
                    colorKey="secondaryForeground"
                    value={currentTheme.colors.secondaryForeground}
                    description="Text color on secondary background"
                    onChange={value =>
                      handleColorChange("secondaryForeground", value)
                    }
                    previewColors={currentTheme.colors}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-700">
                  General Colors
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <ColorPicker
                    label="Text Color"
                    colorKey="text"
                    value={currentTheme.colors.text}
                    description="Main text color"
                    onChange={value => handleColorChange("text", value)}
                    previewColors={currentTheme.colors}
                  />
                  <ColorPicker
                    label="Background Color"
                    colorKey="background"
                    value={currentTheme.colors.background}
                    description="Main background color"
                    onChange={value => handleColorChange("background", value)}
                    previewColors={currentTheme.colors}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              <h3 className="text-lg font-medium">Typography</h3>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FontSelector
                label="Body Font"
                value={currentTheme.fonts.body}
                onChange={value => handleFontChange("body", value)}
              />
              <FontSelector
                label="Heading Font"
                value={currentTheme.fonts.heading}
                onChange={value => handleFontChange("heading", value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Preview</h3>
            <div
              className="rounded-lg border-2 p-6"
              style={{
                backgroundColor: currentTheme.colors.background,
                color: currentTheme.colors.text,
              }}
            >
              <h4
                className="mb-2 font-bold"
                style={{ fontFamily: currentTheme.fonts.heading }}
              >
                Sample Heading
              </h4>
              <p
                className="mb-4"
                style={{ fontFamily: currentTheme.fonts.body }}
              >
                This is how your content will look with the selected theme. The
                font sizes and line height will be applied consistently across
                your website.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded px-4 py-2 font-medium"
                  style={{
                    backgroundColor: currentTheme.colors.primary,
                    color: currentTheme.colors.primaryForeground,
                    fontFamily: currentTheme.fonts.body,
                  }}
                >
                  Primary Button
                </button>
                <button
                  type="button"
                  className="rounded px-4 py-2 font-medium"
                  style={{
                    backgroundColor: currentTheme.colors.secondary,
                    color: currentTheme.colors.secondaryForeground,
                    fontFamily: currentTheme.fonts.body,
                  }}
                >
                  Secondary Button
                </button>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <DialogFooter className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              disabled={
                !hasChanges ||
                isLoading ||
                updateThemeMutation.isPending ||
                createThemeMutation.isPending
              }
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {hasChanges ? "Save Changes" : "Saved"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
