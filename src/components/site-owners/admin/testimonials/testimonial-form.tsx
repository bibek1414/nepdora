import React, { useState, useEffect, useRef } from "react";
import {
  Testimonial,
  CreateTestimonialData,
} from "@/types/owner-site/admin/testimonial";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface TestimonialFormProps {
  testimonial?: Testimonial | null;
  onSubmit: (data: CreateTestimonialData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({
  testimonial,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [formData, setFormData] = useState<CreateTestimonialData>({
    name: "",
    designation: "",
    comment: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (testimonial) {
      setFormData({
        name: testimonial.name || "",
        designation: testimonial.designation || "",
        comment: testimonial.comment || "",
        image: null,
      });
      if (testimonial.image) {
        setImagePreview(testimonial.image);
      }
    }
  }, [testimonial]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (file: File) => {
    setFormData(prev => ({
      ...prev,
      image: file,
    }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    const file = files[0];

    if (file && file.type.startsWith("image/")) {
      handleImageChange(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-h-[calc(100vh-200px)] space-y-4 overflow-y-auto sm:space-y-6"
    >
      <div>
        <Label htmlFor="name" className="text-sm font-semibold text-[#003d79]">
          Name *
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          placeholder="Enter customer name"
          className="mt-1.5 h-9 bg-black/5 text-sm placeholder:text-black/40 focus:bg-white focus:shadow-sm focus:outline-none"
        />
      </div>

      <div>
        <Label
          htmlFor="designation"
          className="text-sm font-semibold text-[#003d79]"
        >
          Designation
        </Label>
        <Input
          id="designation"
          name="designation"
          value={formData.designation}
          onChange={handleInputChange}
          placeholder="Enter job title or designation"
          className="mt-1.5 h-9 bg-black/5 text-sm placeholder:text-black/40 focus:bg-white focus:shadow-sm focus:outline-none"
        />
      </div>

      <div>
        <Label
          htmlFor="comment"
          className="text-sm font-semibold text-[#003d79]"
        >
          Comment *
        </Label>
        <Textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleInputChange}
          required
          rows={3}
          placeholder="Enter testimonial comment"
          className="sm:rows-4 mt-1.5 resize-none bg-black/5 text-sm placeholder:text-black/40 focus:bg-white focus:shadow-sm focus:outline-none"
        />
      </div>

      <div>
        <Label className="text-sm font-semibold text-[#003d79]">
          Profile Image
        </Label>
        <div className="mt-1.5">
          <div
            className={`relative cursor-pointer rounded-lg border border-dashed p-6 text-center transition-colors ${
              isDragOver
                ? "border-black/20 bg-black/5"
                : "border-black/5 bg-black/2 hover:border-black/20 hover:bg-black/5"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileInputChange}
              accept="image/*"
              className="hidden"
            />

            {imagePreview ? (
              <div className="relative">
                <div className="flex justify-center">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={80}
                    height={80}
                    className="mx-auto h-20 w-20 rounded-full border border-black/5 object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute top-0 right-0 h-8 w-8 rounded-full border-gray-300 bg-white p-0 shadow-sm hover:bg-gray-50"
                  onClick={e => {
                    e.stopPropagation();
                    removeImage();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div>
                <Upload className="mx-auto h-12 w-12 text-black/20" />
                <p className="mt-2 text-sm text-black">
                  Drop an image here, or{" "}
                  <span className="font-medium text-black/60">browse</span>
                </p>
                <p className="text-xs text-black/40">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-black/5 pt-6 sm:flex-row sm:justify-end sm:gap-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
          className="w-full text-black/40 hover:bg-black/5 hover:text-black sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white hover:bg-black/90 sm:w-auto"
        >
          {isLoading ? "Saving..." : testimonial ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default TestimonialForm;
