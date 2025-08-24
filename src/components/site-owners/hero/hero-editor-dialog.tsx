import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  X,
  Trash2,
  Upload,
  Loader2,
  Type,
  Palette,
  MousePointer,
  Images,
} from "lucide-react";
import {
  HeroData,
  HeroButton,
  HeroSliderImage,
} from "@/types/owner-site/components/hero";
import {
  useUpdateHeroMutation,
  useCreateHeroMutation,
} from "@/hooks/owner-site/components/use-hero";
import { uploadToCloudinary } from "@/utils/cloudinary";

interface HeroSettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  heroData: HeroData;
  componentId?: string; // Make optional for create mode
  pageSlug: string;
  mode?: "create" | "edit"; // Add mode prop
  onSave?: () => void; // Add callback for create mode
}

export const HeroSettingsDialog: React.FC<HeroSettingsDialogProps> = ({
  isOpen,
  onOpenChange,
  heroData,
  componentId,
  pageSlug,
  mode = "edit",
  onSave,
}) => {
  const [localData, setLocalData] = useState<HeroData>(heroData);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingField, setUploadingField] = useState<string>("");

  // Conditionally use mutations based on mode
  const updateHeroMutation = useUpdateHeroMutation(pageSlug, componentId || "");
  const createHeroMutation = useCreateHeroMutation(pageSlug);

  useEffect(() => {
    setLocalData(heroData);
  }, [heroData]);
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: keyof HeroData, value: any) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "imageUrl" | "backgroundImageUrl" | string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadingField(field);

    try {
      const imageUrl = await uploadToCloudinary(file, {
        folder: "hero-images",
        resourceType: "image",
      });

      if (field === "imageUrl" || field === "backgroundImageUrl") {
        handleChange(field, imageUrl);
      } else {
        // Handle slider image upload
        const imageId = field.replace("slider-", "");
        handleSliderImageUpdate(imageId, { url: imageUrl });
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadingField("");
    }
  };

  const handleButtonUpdate = (id: string, updates: Partial<HeroButton>) => {
    const updatedButtons = localData.buttons.map(button =>
      button.id === id ? { ...button, ...updates } : button
    );
    handleChange("buttons", updatedButtons);
  };

  const addButton = () => {
    const newButton: HeroButton = {
      id: Date.now().toString(),
      text: "New Button",
      variant: "primary",
      href: "#",
    };
    handleChange("buttons", [...localData.buttons, newButton]);
  };

  const removeButton = (id: string) => {
    const filteredButtons = localData.buttons.filter(
      button => button.id !== id
    );
    handleChange("buttons", filteredButtons);
  };

  const handleSliderImageUpdate = (
    id: string,
    updates: Partial<HeroSliderImage>
  ) => {
    const updatedImages = localData.sliderImages.map(img =>
      img.id === id ? { ...img, ...updates } : img
    );
    handleChange("sliderImages", updatedImages);
  };

  const addSliderImage = () => {
    const newImage: HeroSliderImage = {
      id: Date.now().toString(),
      url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80",
      alt: "New image",
    };
    handleChange("sliderImages", [...localData.sliderImages, newImage]);
  };

  const removeSliderImage = (id: string) => {
    const filteredImages = localData.sliderImages.filter(img => img.id !== id);
    handleChange("sliderImages", filteredImages);
  };

  const handleSaveChanges = () => {
    if (mode === "create") {
      // Create new hero component
      const createPayload = {
        component_id: `hero-${Date.now()}`,
        component_type: "hero" as const,
        data: localData,
        order: 1,
      };

      createHeroMutation.mutate(createPayload, {
        onSuccess: () => {
          onOpenChange(false);
          onSave?.(); // Call optional callback
        },
      });
    } else {
      // Update existing hero component
      const updatePayload = {
        data: localData,
      };

      updateHeroMutation.mutate(updatePayload, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  const isLoading =
    mode === "create"
      ? createHeroMutation.isPending
      : updateHeroMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            {mode === "create" ? "Create Hero Section" : "Edit Hero Section"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content" className="flex items-center gap-1">
                <Type className="h-3 w-3" />
                Content
              </TabsTrigger>
              <TabsTrigger value="buttons" className="flex items-center gap-1">
                <MousePointer className="h-3 w-3" />
                Buttons
              </TabsTrigger>
              <TabsTrigger
                value="background"
                className="flex items-center gap-1"
              >
                <Palette className="h-3 w-3" />
                Background
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-1">
                <Images className="h-3 w-3" />
                Media
              </TabsTrigger>
            </TabsList>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="template">Template</Label>
                    <Select
                      value={localData.template}
                      onValueChange={(value: "hero-1" | "hero-2") =>
                        handleChange("template", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hero-1">Hero Template 1</SelectItem>
                        <SelectItem value="hero-2">Hero Template 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={localData.title}
                      onChange={e => handleChange("title", e.target.value)}
                      placeholder="Enter hero title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={localData.subtitle}
                      onChange={e => handleChange("subtitle", e.target.value)}
                      placeholder="Enter subtitle"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={localData.description}
                      onChange={e =>
                        handleChange("description", e.target.value)
                      }
                      placeholder="Enter description"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="layout">Layout</Label>
                    <Select
                      value={localData.layout}
                      onValueChange={(
                        value: "text-left" | "text-center" | "text-right"
                      ) => handleChange("layout", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text-left">Left Aligned</SelectItem>
                        <SelectItem value="text-center">
                          Center Aligned
                        </SelectItem>
                        <SelectItem value="text-right">
                          Right Aligned
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="textColor">Text Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={localData.textColor}
                        onChange={e =>
                          handleChange("textColor", e.target.value)
                        }
                        className="h-10 w-16 p-1"
                      />
                      <Input
                        value={localData.textColor}
                        onChange={e =>
                          handleChange("textColor", e.target.value)
                        }
                        placeholder="#FFFFFF"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Hero Image Settings */}
                  <div className="space-y-3 rounded-lg border p-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="showImage"
                        checked={localData.showImage}
                        onCheckedChange={checked =>
                          handleChange("showImage", checked)
                        }
                      />
                      <Label htmlFor="showImage">Show Hero Image</Label>
                    </div>

                    {localData.showImage && (
                      <div className="space-y-3">
                        <div>
                          <Label>Upload Hero Image</Label>
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => handleImageUpload(e, "imageUrl")}
                              className="hidden"
                              id="heroImageUpload"
                              disabled={isUploading}
                            />
                            <Button
                              variant="outline"
                              onClick={() =>
                                document
                                  .getElementById("heroImageUpload")
                                  ?.click()
                              }
                              disabled={
                                isUploading && uploadingField === "imageUrl"
                              }
                              className="w-full"
                            >
                              {isUploading && uploadingField === "imageUrl" ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Upload className="mr-2 h-4 w-4" />
                              )}
                              Upload Image
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="imageUrl">Image URL</Label>
                          <Input
                            id="imageUrl"
                            value={localData.imageUrl}
                            onChange={e =>
                              handleChange("imageUrl", e.target.value)
                            }
                            placeholder="Enter image URL"
                          />
                        </div>

                        <div>
                          <Label htmlFor="imageAlt">Alt Text</Label>
                          <Input
                            id="imageAlt"
                            value={localData.imageAlt}
                            onChange={e =>
                              handleChange("imageAlt", e.target.value)
                            }
                            placeholder="Describe the image"
                          />
                        </div>

                        {localData.imageUrl && (
                          <div>
                            <Label>Preview</Label>
                            <img
                              src={localData.imageUrl}
                              alt="Hero Preview"
                              className="mt-1 h-16 max-w-24 rounded border object-cover"
                              onError={e => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Buttons Tab */}
            <TabsContent value="buttons" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <Label>Call-to-Action Buttons</Label>
                <Button variant="outline" size="sm" onClick={addButton}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add Button
                </Button>
              </div>

              <div className="max-h-64 space-y-3 overflow-y-auto">
                {localData.buttons.map((button, index) => (
                  <div
                    key={button.id}
                    className="bg-muted/30 flex items-center gap-2 rounded-lg border p-3"
                  >
                    <Badge variant="outline" className="text-xs">
                      {index + 1}
                    </Badge>
                    <Input
                      value={button.text}
                      onChange={e =>
                        handleButtonUpdate(button.id, { text: e.target.value })
                      }
                      placeholder="Button text"
                      className="flex-1"
                    />
                    <Select
                      value={button.variant}
                      onValueChange={(
                        value: "primary" | "secondary" | "outline"
                      ) => handleButtonUpdate(button.id, { variant: value })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                        <SelectItem value="outline">Outline</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={button.href || ""}
                      onChange={e =>
                        handleButtonUpdate(button.id, { href: e.target.value })
                      }
                      placeholder="URL"
                      className="w-32"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeButton(button.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Background Tab */}
            <TabsContent value="background" className="space-y-4 pt-4">
              <div>
                <Label>Background Type</Label>
                <Select
                  value={localData.backgroundType}
                  onValueChange={(value: "color" | "gradient" | "image") =>
                    handleChange("backgroundType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="color">Solid Color</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                    <SelectItem value="image">Background Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {localData.backgroundType === "color" && (
                <div>
                  <Label>Background Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={localData.backgroundColor}
                      onChange={e =>
                        handleChange("backgroundColor", e.target.value)
                      }
                      className="h-10 w-16 p-1"
                    />
                    <Input
                      value={localData.backgroundColor}
                      onChange={e =>
                        handleChange("backgroundColor", e.target.value)
                      }
                      placeholder="#1e3a8a"
                      className="flex-1"
                    />
                  </div>
                </div>
              )}

              {localData.backgroundType === "gradient" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>From Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={localData.gradientFrom}
                        onChange={e =>
                          handleChange("gradientFrom", e.target.value)
                        }
                        className="h-10 w-16 p-1"
                      />
                      <Input
                        value={localData.gradientFrom}
                        onChange={e =>
                          handleChange("gradientFrom", e.target.value)
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>To Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={localData.gradientTo}
                        onChange={e =>
                          handleChange("gradientTo", e.target.value)
                        }
                        className="h-10 w-16 p-1"
                      />
                      <Input
                        value={localData.gradientTo}
                        onChange={e =>
                          handleChange("gradientTo", e.target.value)
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {localData.backgroundType === "image" && (
                <div className="space-y-4">
                  <div>
                    <Label>Upload Background Image</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e =>
                          handleImageUpload(e, "backgroundImageUrl")
                        }
                        className="hidden"
                        id="backgroundImageUpload"
                        disabled={isUploading}
                      />
                      <Button
                        variant="outline"
                        onClick={() =>
                          document
                            .getElementById("backgroundImageUpload")
                            ?.click()
                        }
                        disabled={
                          isUploading && uploadingField === "backgroundImageUrl"
                        }
                        className="w-full"
                      >
                        {isUploading &&
                        uploadingField === "backgroundImageUrl" ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="mr-2 h-4 w-4" />
                        )}
                        Upload Background Image
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="backgroundImageUrl">
                      Background Image URL
                    </Label>
                    <Input
                      id="backgroundImageUrl"
                      value={localData.backgroundImageUrl}
                      onChange={e =>
                        handleChange("backgroundImageUrl", e.target.value)
                      }
                      placeholder="Enter image URL"
                    />
                  </div>

                  {localData.backgroundImageUrl && (
                    <div>
                      <Label>Preview</Label>
                      <img
                        src={localData.backgroundImageUrl}
                        alt="Background Preview"
                        className="mt-1 h-20 max-w-32 rounded border object-cover"
                        onError={e => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  <div className="space-y-3 rounded-lg border p-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="showOverlay"
                        checked={localData.showOverlay}
                        onCheckedChange={checked =>
                          handleChange("showOverlay", checked)
                        }
                      />
                      <Label htmlFor="showOverlay">Show Overlay</Label>
                    </div>

                    {localData.showOverlay && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Overlay Color</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="color"
                              value={localData.overlayColor}
                              onChange={e =>
                                handleChange("overlayColor", e.target.value)
                              }
                              className="h-10 w-16 p-1"
                            />
                            <Input
                              value={localData.overlayColor}
                              onChange={e =>
                                handleChange("overlayColor", e.target.value)
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>
                            Opacity:{" "}
                            {Math.round(localData.overlayOpacity * 100)}%
                          </Label>
                          <Input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={localData.overlayOpacity}
                            onChange={e =>
                              handleChange(
                                "overlayOpacity",
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="space-y-4 pt-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="showSlider"
                  checked={localData.showSlider}
                  onCheckedChange={checked =>
                    handleChange("showSlider", checked)
                  }
                />
                <Label htmlFor="showSlider">Show Image Slider</Label>
              </div>

              {localData.showSlider && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Slider Images</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addSliderImage}
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Add Image
                    </Button>
                  </div>

                  <div className="max-h-64 space-y-3 overflow-y-auto">
                    {localData.sliderImages.map((image, index) => (
                      <div
                        key={image.id}
                        className="bg-muted/30 space-y-2 rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {index + 1}
                          </Badge>
                          <Input
                            value={image.url}
                            onChange={e =>
                              handleSliderImageUpdate(image.id, {
                                url: e.target.value,
                              })
                            }
                            placeholder="Image URL"
                            className="flex-1"
                          />
                          <Input
                            value={image.alt}
                            onChange={e =>
                              handleSliderImageUpdate(image.id, {
                                alt: e.target.value,
                              })
                            }
                            placeholder="Alt text"
                            className="w-32"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSliderImage(image.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e =>
                              handleImageUpload(e, `slider-${image.id}`)
                            }
                            className="hidden"
                            id={`sliderImageUpload-${image.id}`}
                            disabled={isUploading}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              document
                                .getElementById(`sliderImageUpload-${image.id}`)
                                ?.click()
                            }
                            disabled={
                              isUploading &&
                              uploadingField === `slider-${image.id}`
                            }
                          >
                            {isUploading &&
                            uploadingField === `slider-${image.id}` ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Upload className="mr-2 h-4 w-4" />
                            )}
                            Upload
                          </Button>

                          {image.url && (
                            <img
                              src={image.url}
                              alt="Slider Preview"
                              className="h-12 w-16 rounded border object-cover"
                              onError={e => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveChanges}
            disabled={isLoading || isUploading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Create Hero" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
