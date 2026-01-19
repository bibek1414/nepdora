"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Tiptap from "@/components/ui/tip-tap";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useCreateTeamMember,
  useUpdateTeamMember,
} from "@/hooks/owner-site/admin/use-team-member";
import { TEAM } from "@/types/owner-site/admin/team-member";
import { toast } from "sonner";
import { ImageUploader } from "@/components/ui/image-uploader";
import { validateFile, validateSocialUrls, ApiError } from "@/utils/api-error";

interface TeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingMember?: TEAM | null;
  onSuccess?: () => void;
}

interface FieldErrors {
  [fieldName: string]: string[];
}

export const TeamMemberDialog: React.FC<TeamMemberDialogProps> = ({
  open,
  onOpenChange,
  editingMember,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    order: 1,
    about: "",
    email: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | string | null>(
    null
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [imageError, setImageError] = useState<string>("");

  const createMutation = useCreateTeamMember();
  const updateMutation = useUpdateTeamMember();

  useEffect(() => {
    if (editingMember) {
      setFormData({
        name: editingMember.name || "",
        role: editingMember.role || "",
        order: editingMember.order || 1,
        about: editingMember.about || "",
        email: editingMember.email || "",
        facebook: editingMember.facebook || "",
        instagram: editingMember.instagram || "",
        linkedin: editingMember.linkedin || "",
        twitter: editingMember.twitter || "",
      });
      setSelectedImage(editingMember.photo || null);
    } else {
      resetForm();
    }
  }, [editingMember, open]);

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      order: 1,
      about: "",
      email: "",
      facebook: "",
      instagram: "",
      linkedin: "",
      twitter: "",
    });
    setSelectedImage(null);
    setFieldErrors({});
    setImageError("");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    setFormData(prev => ({
      ...prev,
      [name]: name === "order" ? parseInt(value) || 0 : value,
    }));
  };

  const handleAboutChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      about: content,
    }));

    if (fieldErrors.about) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.about;
        return newErrors;
      });
    }
  };

  const handleImageChange = (files: File | File[] | null) => {
    setImageError("");

    if (files === null) {
      setSelectedImage(null);
      return;
    }

    const fileToValidate =
      files instanceof File ? files : Array.isArray(files) ? files[0] : null;

    if (!fileToValidate) {
      setSelectedImage(null);
      return;
    }

    // Validate file before setting
    const validation = validateFile(fileToValidate);
    if (!validation.valid) {
      setImageError(validation.error || "Invalid file");
      setSelectedImage(null);
      toast.error(validation.error);
      return;
    }

    setSelectedImage(fileToValidate);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setFieldErrors({});
    setImageError("");

    // Client-side validation for social URLs
    const socialValidation = validateSocialUrls({
      facebook: formData.facebook,
      instagram: formData.instagram,
      linkedin: formData.linkedin,
      twitter: formData.twitter,
    });

    if (!socialValidation.valid) {
      setFieldErrors(socialValidation.errors);
      toast.error("Please fix the validation errors");
      return;
    }

    // Validate image if it's a new file
    if (selectedImage instanceof File) {
      const validation = validateFile(selectedImage);
      if (!validation.valid) {
        setImageError(validation.error || "Invalid file");
        toast.error(validation.error);
        return;
      }
    }

    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value.toString());
    });

    if (selectedImage instanceof File) {
      submitData.append("photo", selectedImage);
    }

    try {
      if (editingMember) {
        await updateMutation.mutateAsync({
          id: editingMember.id,
          memberData: submitData,
        });
        toast.success("Team member updated successfully!");
      } else {
        await createMutation.mutateAsync(submitData);
        toast.success("Team member added successfully!");
      }

      resetForm();
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving team member:", error);

      // Handle API errors with field errors
      if (error && typeof error === "object" && "fieldErrors" in error) {
        const apiError = error as ApiError;
        if (apiError.fieldErrors) {
          setFieldErrors(apiError.fieldErrors);
          toast.error("Please fix the validation errors");
          return;
        }
      }

      // Handle status-specific errors
      if (error && typeof error === "object" && "status" in error) {
        const apiError = error as ApiError;

        switch (apiError.status) {
          case 413:
            setImageError("File size too large. Maximum allowed size is 5MB.");
            toast.error(
              "File size too large. Please upload a smaller image (max 5MB)"
            );
            return;
          case 415:
            setImageError(
              "Invalid file type. Please upload a valid image file."
            );
            toast.error(
              "Invalid file type. Please upload a JPEG, PNG, or WebP image"
            );
            return;
          case 400:
            // Already handled by fieldErrors above
            break;
          case 409:
            toast.error(
              "This entry already exists. Please use different values."
            );
            return;
        }
      }

      // Handle generic error message
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to save team member");
      }
    }
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingMember ? "Edit Team Member" : "Add New Team Member"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Section with ImageUploader */}
          <div className="space-y-4">
            <Label>Profile Photo</Label>
            <ImageUploader
              value={selectedImage}
              onChange={handleImageChange}
              disabled={isLoading}
              multiple={false}
              maxFileSize={5 * 1024 * 1024} // 5MB
            />
            {imageError && <p className="text-sm text-red-500">{imageError}</p>}
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter full name"
                className={fieldErrors.name ? "border-red-500" : ""}
              />
              {fieldErrors.name && (
                <p className="text-sm text-red-500">
                  {fieldErrors.name.join(", ")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Input
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                placeholder="Enter job title/role"
                className={fieldErrors.role ? "border-red-500" : ""}
              />
              {fieldErrors.role && (
                <p className="text-sm text-red-500">
                  {fieldErrors.role.join(", ")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                name="order"
                type="number"
                value={formData.order}
                onChange={handleInputChange}
                required
                min="1"
                placeholder="1"
                className={fieldErrors.order ? "border-red-500" : ""}
              />
              {fieldErrors.order && (
                <p className="text-sm text-red-500">
                  {fieldErrors.order.join(", ")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="email@example.com"
                className={fieldErrors.email ? "border-red-500" : ""}
              />
              {fieldErrors.email && (
                <p className="text-sm text-red-500">
                  {fieldErrors.email.join(", ")}
                </p>
              )}
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-2">
            <Label htmlFor="about">About</Label>
            <Tiptap
              value={formData.about}
              onChange={handleAboutChange}
              placeholder="Brief description about the team member..."
              minHeight="500px"
              className={fieldErrors.about ? "border-red-500" : ""}
              uploadFolder="team-members"
            />
            {fieldErrors.about && (
              <p className="text-sm text-red-500">
                {fieldErrors.about.join(", ")}
              </p>
            )}
          </div>

          {/* Social Media Links */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Social Media Links</Label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  placeholder="https://facebook.com/username"
                  className={fieldErrors.facebook ? "border-red-500" : ""}
                />
                {fieldErrors.facebook && (
                  <p className="text-sm text-red-500">
                    {fieldErrors.facebook.join(", ")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/username"
                  className={fieldErrors.instagram ? "border-red-500" : ""}
                />
                {fieldErrors.instagram && (
                  <p className="text-sm text-red-500">
                    {fieldErrors.instagram.join(", ")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/username"
                  className={fieldErrors.linkedin ? "border-red-500" : ""}
                />
                {fieldErrors.linkedin && (
                  <p className="text-sm text-red-500">
                    {fieldErrors.linkedin.join(", ")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  placeholder="https://twitter.com/username"
                  className={fieldErrors.twitter ? "border-red-500" : ""}
                />
                {fieldErrors.twitter && (
                  <p className="text-sm text-red-500">
                    {fieldErrors.twitter.join(", ")}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : editingMember
                  ? "Update Member"
                  : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
