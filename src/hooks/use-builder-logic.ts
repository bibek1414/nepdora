import { useState, useCallback, useEffect } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const useBuilderLogic = <T extends Record<string, any>>(
  initialData: T,
  onUpdate?: (updatedData: Partial<T>) => void
) => {
  const [data, setData] = useState<T>(initialData);

  // Sync state with props when they change externally
  useEffect(() => {
    // We use a JSON stringify for deep comparison to ensure we don't skip updates
    // but avoid unnecessary re-renders.
    if (JSON.stringify(initialData) !== JSON.stringify(data)) {
      setData(initialData);
    }
  }, [initialData]);

  const handleTextUpdate = useCallback(
    (field: keyof T) => (value: string) => {
      const updatedData = { ...data, [field]: value };
      setData(updatedData);
      onUpdate?.({ [field]: value } as Partial<T>);
    },
    [data, onUpdate]
  );

  const handleImageUpdate = useCallback(
    (imageUrlField: keyof T, altField?: keyof T) =>
      (imageUrl: string, altText?: string) => {
        const update: any = { [imageUrlField]: imageUrl };
        if (altField) {
          update[altField] = altText || (data as any)[altField];
        }
        const updatedData = { ...data, ...update };
        setData(updatedData);
        onUpdate?.(update);
      },
    [data, onUpdate]
  );

  const handleAltUpdate = useCallback(
    (altField: keyof T) => (altText: string) => {
      const update = { [altField]: altText } as Partial<T>;
      const updatedData = { ...data, ...update };
      setData(updatedData);
      onUpdate?.(update);
    },
    [data, onUpdate]
  );

  const handleArrayItemUpdate = useCallback(
    (arrayField: keyof T, itemId: string | number) => (itemUpdate: any) => {
      const array = data[arrayField] as any[];
      if (!array) return;
      const updatedArray = array.map((item: any) =>
        item.id === itemId ? { ...item, ...itemUpdate } : item
      );
      const update = { [arrayField]: updatedArray } as Partial<T>;
      const updatedData = { ...data, ...update };
      setData(updatedData);
      onUpdate?.(update);
    },
    [data, onUpdate]
  );

  const handleButtonUpdate = useCallback(
    (buttonsField: keyof T) =>
      (buttonId: string, text: string, href: string) => {
        handleArrayItemUpdate(buttonsField, buttonId)({ text, href });
      },
    [handleArrayItemUpdate]
  );

  const handleLinkUpdate = useCallback(
    (textField: keyof T, hrefField: keyof T) => (text: string, href: string) => {
      const update = { [textField]: text, [hrefField]: href } as Partial<T>;
      const updatedData = { ...data, ...update };
      setData(updatedData);
      onUpdate?.(update);
    },
    [data, onUpdate]
  );

  const handleArrayUpdate = useCallback(
    (field: keyof T) => (value: any[]) => {
      const updatedData = { ...data, [field]: value };
      setData(updatedData);
      onUpdate?.({ [field]: value } as Partial<T>);
    },
    [data, onUpdate]
  );

  const handleMultipleUpdate = useCallback(
    (updates: Partial<T>) => {
      const updatedData = { ...data, ...updates };
      setData(updatedData);
      onUpdate?.(updates);
    },
    [data, onUpdate]
  );

  const getImageUrl = useCallback(
    (
      imageUrl?: string,
      _options: {
        width?: number;
        height?: number;
        quality?: number | "auto";
        format?: "auto" | "webp" | "jpg" | "png";
        crop?: "fill" | "fit" | "scale" | "crop";
      } = { width: 600, quality: "auto", format: "auto" }
    ) => {
      if (!imageUrl) return "";

      // If it's a Cloudinary URL, we can still optimize it for now,
      // but new images will be S3 URLs which don't support these options natively.
      // For now, we'll just return the imageUrl as is if it's not a Cloudinary/Unsplash one.
      return imageUrl;
    },
    []
  );

  return {
    data,
    setData,
    handleTextUpdate,
    handleImageUpdate,
    handleAltUpdate,
    handleArrayItemUpdate,
    handleArrayUpdate,
    handleMultipleUpdate,
    handleButtonUpdate,
    handleLinkUpdate,
    getImageUrl,
  };
};
