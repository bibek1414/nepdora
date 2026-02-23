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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Palette, Save, Type, Check, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

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

const shadcnPalette = [
  { name: "Slate", value: "#64748b" },
  { name: "Gray", value: "#6b7280" },
  { name: "Zinc", value: "#71717a" },
  { name: "Neutral", value: "#737373" },
  { name: "Stone", value: "#78716c" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Yellow", value: "#eab308" },
  { name: "Lime", value: "#84cc16" },
  { name: "Green", value: "#22c55e" },
  { name: "Emerald", value: "#10b981" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Sky", value: "#0ea5e9" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Fuchsia", value: "#d946ef" },
  { name: "Pink", value: "#ec4899" },
  { name: "Rose", value: "#f43f5e" },
];

// Memoized ColorPicker component
const ColorPicker = memo(
  ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
  }) => {
    return (
      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <div className="flex items-center gap-2">
          <div className="relative h-9 w-9 overflow-hidden rounded-md border shadow-sm">
            <input
              type="color"
              value={value}
              onChange={e => onChange(e.target.value)}
              className="absolute -top-1/2 -left-1/2 h-[200%] w-[200%] cursor-pointer p-0"
            />
          </div>
          <Input
            value={value}
            onChange={e => onChange(e.target.value)}
            className="h-9 flex-1 font-mono text-xs uppercase"
            placeholder="#000000"
            maxLength={7}
          />
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
    <Card className="border-border bg-card/50 shadow-sm">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="grid grid-cols-2 gap-2">
          {fontOptions.slice(0, 6).map(font => (
            <button
              key={font.value}
              type="button"
              className={cn(
                "flex items-center justify-between rounded-md border px-3 py-2 text-sm transition-all hover:border-primary/50",
                value === font.value
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "bg-background"
              )}
              onClick={() => onChange(font.value)}
            >
              <span className="truncate" style={{ fontFamily: font.value }}>
                {font.label}
              </span>
              {value === font.value && (
                <Check className="h-3 w-3 text-primary" />
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
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
        onOpenChange(false);
        onSaveComplete?.();
      })
      .catch(error => {
        console.error("Error saving theme:", error);
      });
  };

  const applyPalette = (color: string) => {
    setCurrentTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        primary: color,
        // Calculate a foreground color or use white/black based on brightness?
        // For simplicity, assuming white for dark colors, but let's stick to theme defaults or current
        primaryForeground: "#FFFFFF",
        // Maybe update secondary to a lighter shade or complementary?
        // Keeping it simple: just update primary for "branding"
      },
    }));
    setHasChanges(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden p-0">
        <div className="flex h-full flex-col">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Theme Settings
            </DialogTitle>
            <DialogDescription>
              Customize your design system. Changes apply globally.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="colors" className="flex-1 overflow-hidden">
            <div className="border-b px-6 bg-muted/30">
              <TabsList className="h-12 w-full justify-start gap-4 bg-transparent p-0">
                <TabsTrigger
                  value="colors"
                  className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Colors
                </TabsTrigger>
                <TabsTrigger
                  value="typography"
                  className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Typography
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="h-[calc(60vh)] overflow-y-auto p-6">
              <TabsContent value="colors" className="m-0 space-y-8">
                {/* Palette Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    Brand Palette
                  </Label>
                  <div className="grid grid-cols-6 gap-3 sm:grid-cols-8 md:grid-cols-11">
                    {shadcnPalette.map(color => (
                      <button
                        key={color.name}
                        onClick={() => applyPalette(color.value)}
                        className={cn(
                          "group relative aspect-square w-full overflow-hidden rounded-full ring-offset-2 transition-all hover:scale-110 focus:ring-2 focus:outline-none",
                          currentTheme.colors.primary === color.value &&
                            "ring-2 ring-primary"
                        )}
                        title={color.name}
                      >
                        <span
                          className="absolute inset-0 h-full w-full"
                          style={{ backgroundColor: color.value }}
                        />
                        {currentTheme.colors.primary === color.value && (
                          <span className="absolute inset-0 flex items-center justify-center text-white">
                            <Check className="h-4 w-4 drop-shadow-md" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Detailed Color Config */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* Primary */}
                  <Card className="border-border bg-card/50 shadow-sm">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Primary
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Brand buttons & links
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <ColorPicker
                          label="Background"
                          value={currentTheme.colors.primary}
                          onChange={v => handleColorChange("primary", v)}
                        />
                        <ColorPicker
                          label="Text"
                          value={currentTheme.colors.primaryForeground}
                          onChange={v =>
                            handleColorChange("primaryForeground", v)
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Secondary */}
                  <Card className="border-border bg-card/50 shadow-sm">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Secondary
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Accent elements
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <ColorPicker
                          label="Background"
                          value={currentTheme.colors.secondary}
                          onChange={v => handleColorChange("secondary", v)}
                        />
                        <ColorPicker
                          label="Text"
                          value={currentTheme.colors.secondaryForeground}
                          onChange={v =>
                            handleColorChange("secondaryForeground", v)
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Global */}
                  <Card className="border-border bg-card/50 shadow-sm">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Global
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Body background & text
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <ColorPicker
                          label="Background"
                          value={currentTheme.colors.background}
                          onChange={v => handleColorChange("background", v)}
                        />
                        <ColorPicker
                          label="Text"
                          value={currentTheme.colors.text}
                          onChange={v => handleColorChange("text", v)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Preview */}
                <Card className="overflow-hidden border-border bg-card/50 shadow-sm">
                  <CardHeader className="p-4 pb-2 border-b">
                    <CardTitle className="text-sm font-medium">
                      Live Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div
                      className="rounded-lg border p-6 shadow-sm transition-all"
                      style={{
                        backgroundColor: currentTheme.colors.background,
                        color: currentTheme.colors.text,
                        borderColor: currentTheme.colors.secondary,
                      }}
                    >
                      <h3
                        className="mb-2 text-2xl font-bold"
                        style={{ fontFamily: currentTheme.fonts.heading }}
                      >
                        Design System
                      </h3>
                      <p
                        className="mb-4 max-w-md opacity-80"
                        style={{ fontFamily: currentTheme.fonts.body }}
                      >
                        This is how your content will appear. The spacing,
                        colors, and typography are applied consistently.
                      </p>
                      <div className="flex gap-3">
                        <button
                          className="rounded-md px-4 py-2 font-medium shadow-sm transition-transform active:scale-95"
                          style={{
                            backgroundColor: currentTheme.colors.primary,
                            color: currentTheme.colors.primaryForeground,
                            fontFamily: currentTheme.fonts.body,
                          }}
                        >
                          Primary Action
                        </button>
                        <button
                          className="rounded-md px-4 py-2 font-medium shadow-sm transition-transform active:scale-95"
                          style={{
                            backgroundColor: currentTheme.colors.secondary,
                            color: currentTheme.colors.secondaryForeground,
                            fontFamily: currentTheme.fonts.body,
                          }}
                        >
                          Secondary
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="typography" className="m-0 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <FontSelector
                      label="Heading Font"
                      value={currentTheme.fonts.heading}
                      onChange={v => handleFontChange("heading", v)}
                    />
                    <div className="rounded-lg border bg-muted/20 p-6">
                      <h1
                        className="text-4xl font-bold"
                        style={{ fontFamily: currentTheme.fonts.heading }}
                      >
                        Heading Display
                      </h1>
                      <h2
                        className="mt-2 text-2xl font-semibold"
                        style={{ fontFamily: currentTheme.fonts.heading }}
                      >
                        Subheading Style
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <FontSelector
                      label="Body Font"
                      value={currentTheme.fonts.body}
                      onChange={v => handleFontChange("body", v)}
                    />
                    <div className="rounded-lg border bg-muted/20 p-6">
                      <p
                        className="leading-relaxed"
                        style={{ fontFamily: currentTheme.fonts.body }}
                      >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="border-t bg-muted/10 px-6 py-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="mr-2"
            >
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
              className="min-w-[100px]"
            >
              {updateThemeMutation.isPending ||
              createThemeMutation.isPending ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {hasChanges ? "Save Changes" : "Saved"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
