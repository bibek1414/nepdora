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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Palette, Save } from "lucide-react";
import { toast } from "sonner";

interface ThemeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
  onSaveComplete?: () => void;
}

const fontOptions = [
  { value: "Inter", label: "Inter" },
  { value: "Poppins", label: "Poppins" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Merriweather", label: "Merriweather" },
  { value: "Lato", label: "Lato" },
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

  const handleFontChange = (fontKey: keyof ThemeFonts, value: string) => {
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

  const ColorInput = ({
    label,
    colorKey,
    value,
  }: {
    label: string;
    colorKey: keyof ThemeColors;
    value: string;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={colorKey} className="text-sm font-medium">
        {label}
      </Label>
      <div className="flex flex-wrap gap-2">
        <Input
          id={colorKey}
          type="color"
          value={value}
          onChange={e => handleColorChange(colorKey, e.target.value)}
          className="h-10 w-20 rounded border p-1"
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
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="max-h-[90vh] max-w-3xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Settings
          </DialogTitle>
          <DialogDescription>
            Customize your website&apos;s appearance with colors and fonts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 overflow-auto">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Colors</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <ColorInput
                label="Primary Color"
                colorKey="primary"
                value={currentTheme.colors.primary}
              />
              <ColorInput
                label="Secondary Color"
                colorKey="secondary"
                value={currentTheme.colors.secondary}
              />
              <ColorInput
                label="Text Color"
                colorKey="text"
                value={currentTheme.colors.text}
              />
              <ColorInput
                label="Background Color"
                colorKey="background"
                value={currentTheme.colors.background}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Fonts</h3>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Body Font</Label>
              <Select
                value={currentTheme.fonts.body}
                onValueChange={value => handleFontChange("body", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map(font => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value }}>
                        {font.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
