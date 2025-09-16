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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
import { Palette, RefreshCw, Save, Undo2, Eye, Type } from "lucide-react";
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

const containerWidthOptions = [
  { value: "1200px", label: "Standard (1200px)" },
  { value: "1400px", label: "Wide (1400px)" },
  { value: "1600px", label: "Extra Wide (1600px)" },
  { value: "100%", label: "Full Width" },
];

const spacingOptions = [
  { value: "0.5rem", label: "Tight (0.5rem)" },
  { value: "1rem", label: "Normal (1rem)" },
  { value: "1.5rem", label: "Relaxed (1.5rem)" },
  { value: "2rem", label: "Loose (2rem)" },
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
  const [activeTab, setActiveTab] = useState("colors");
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

      <DialogContent className="max-h-[90vh] max-w-6xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Settings
          </DialogTitle>
          <DialogDescription>
            Customize your website&apos;s appearance with colors, fonts, and
            layout settings.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-6 overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="colors" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Colors
                </TabsTrigger>
                <TabsTrigger
                  value="typography"
                  className="flex items-center gap-2"
                >
                  <Type className="h-4 w-4" />
                  Typography
                </TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="mt-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
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
              </TabsContent>

              <TabsContent value="typography" className="mt-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Heading Font</Label>
                    <Select
                      value={currentTheme.fonts.heading}
                      onValueChange={value =>
                        handleFontChange("heading", value)
                      }
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
              </TabsContent>
            </Tabs>
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
