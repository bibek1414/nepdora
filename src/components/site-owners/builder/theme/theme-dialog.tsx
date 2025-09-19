"use client";

import React, { useState, useEffect } from "react";
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
import { Slider } from "@/components/ui/slider";
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
import { Palette, Save, Check, Type, Minus, Plus } from "lucide-react";
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

const fontSizePresets = [
  { label: "Small", bodySize: 14, headingSize: 20 },
  { label: "Medium", bodySize: 16, headingSize: 24 },
  { label: "Large", bodySize: 18, headingSize: 28 },
  { label: "Extra Large", bodySize: 20, headingSize: 32 },
];

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

  const handleColorChange = (colorKey: keyof ThemeColors, value: string) => {
    setCurrentTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleFontChange = (
    fontKey: keyof ThemeFonts,
    value: string | number
  ) => {
    setCurrentTheme(prev => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [fontKey]: value,
      },
    }));
    setHasChanges(true);
  };

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

  const ColorPicker = ({
    label,
    colorKey,
    value,
    description,
  }: {
    label: string;
    colorKey: keyof ThemeColors;
    value: string;
    description?: string;
  }) => (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-sm font-medium">{label}</Label>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>

      {/* Color Preview & Sample */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-200 text-xs font-medium shadow-sm"
            style={{
              backgroundColor: value,
              color: colorKey.includes("Foreground")
                ? value
                : colorKey === "background"
                  ? currentTheme.colors.text
                  : colorKey === "text"
                    ? currentTheme.colors.background
                    : "#fff",
            }}
          >
            {colorKey.includes("Foreground")
              ? "Aa"
              : colorKey === "text"
                ? "Aa"
                : colorKey === "background"
                  ? "Aa"
                  : "Aa"}
          </div>
        </div>

        {/* Predefined Colors */}
        <div className="grid grid-cols-6 gap-1">
          {predefinedColors.map(color => (
            <button
              key={color}
              className="relative h-8 w-8 rounded-md border-2 border-gray-200 transition-colors hover:scale-105 hover:border-gray-400"
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(colorKey, color)}
            >
              {value === color && (
                <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-sm" />
              )}
            </button>
          ))}
        </div>

        {/* Custom Color Input */}
        <div className="flex gap-2">
          <Input
            type="color"
            value={value}
            onChange={e => handleColorChange(colorKey, e.target.value)}
            className="h-10 w-16 cursor-pointer rounded border p-1"
          />
          <Input
            type="text"
            value={value}
            onChange={e => handleColorChange(colorKey, e.target.value)}
            className="flex-1 font-mono text-sm"
            placeholder="#000000"
          />
        </div>
      </div>
    </div>
  );

  const FontSelector = ({
    label,
    fontKey,
    value,
  }: {
    label: string;
    fontKey: keyof ThemeFonts;
    value: string;
  }) => (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {fontOptions.slice(0, 4).map(font => (
          <button
            key={font.value}
            className={`relative rounded-lg border-2 p-3 text-left transition-all hover:shadow-md ${
              value === font.value
                ? "border-blue-500 bg-blue-50 shadow-sm"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handleFontChange(fontKey, font.value)}
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
              <Check className="absolute top-2 right-2 h-4 w-4 text-blue-600" />
            )}
          </button>
        ))}
      </div>

      {/* Show all fonts dropdown */}
      <div className="max-h-32 overflow-y-auto rounded-md border">
        {fontOptions.slice(4).map(font => (
          <button
            key={font.value}
            className={`w-full border-b px-3 py-2 text-left transition-colors last:border-b-0 hover:bg-gray-50 ${
              value === font.value ? "border-blue-200 bg-blue-50" : ""
            }`}
            onClick={() => handleFontChange(fontKey, font.value)}
            style={{ fontFamily: font.value }}
          >
            <div className="flex items-center justify-between">
              <span>{font.label}</span>
              {value === font.value && (
                <Check className="h-4 w-4 text-blue-600" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

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
          {/* Colors Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Colors</h3>
            <div className="grid gap-6">
              {/* Primary Colors */}
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
                  />
                  <ColorPicker
                    label="Primary Text"
                    colorKey="primaryForeground"
                    value={currentTheme.colors.primaryForeground}
                    description="Text color on primary background"
                  />
                </div>
              </div>

              {/* Secondary Colors */}
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
                  />
                  <ColorPicker
                    label="Secondary Text"
                    colorKey="secondaryForeground"
                    value={currentTheme.colors.secondaryForeground}
                    description="Text color on secondary background"
                  />
                </div>
              </div>

              {/* General Colors */}
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
                  />
                  <ColorPicker
                    label="Background Color"
                    colorKey="background"
                    value={currentTheme.colors.background}
                    description="Main background color"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Typography Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              <h3 className="text-lg font-medium">Typography</h3>
            </div>

            {/* Font Family */}
            <div className="grid gap-6 md:grid-cols-2">
              <FontSelector
                label="Body Font"
                fontKey="body"
                value={currentTheme.fonts.body}
              />
              <FontSelector
                label="Heading Font"
                fontKey="heading"
                value={currentTheme.fonts.heading}
              />
            </div>
          </div>

          {/* Theme Preview */}
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
                style={{
                  fontFamily: currentTheme.fonts.heading,
                }}
              >
                Sample Heading
              </h4>
              <p
                className="mb-4"
                style={{
                  fontFamily: currentTheme.fonts.body,
                }}
              >
                This is how your content will look with the selected theme. The
                font sizes and line height will be applied consistently across
                your website.
              </p>
              <div className="flex gap-2">
                <button
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
