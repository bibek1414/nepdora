import React, { useState, useEffect, useRef } from "react";
import {
  Testimonial,
  CreateTestimonialData,
} from "@/types/owner-site/testimonial";
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
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          placeholder="Enter customer name"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="designation">Designation</Label>
        <Input
          id="designation"
          name="designation"
          value={formData.designation}
          onChange={handleInputChange}
          placeholder="Enter job title or designation"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="comment">Comment *</Label>
        <Textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleInputChange}
          required
          rows={3}
          placeholder="Enter testimonial comment"
          className="sm:rows-4 mt-1 resize-none"
        />
      </div>

      <div>
        <Label>Profile Image</Label>
        <div className="mt-1">
          <div
            className={`relative cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
              isDragOver
                ? "border-gray-400 bg-gray-50"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
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
                    className="mx-auto h-20 w-20 rounded-full border-2 border-gray-200 object-cover"
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
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drop an image here, or{" "}
                  <span className="font-medium text-gray-900">browse</span>
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-4 sm:flex-row sm:justify-end sm:gap-0 sm:space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gray-600 text-white hover:bg-gray-700 sm:w-auto"
        >
          {isLoading ? "Saving..." : testimonial ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default TestimonialForm;
