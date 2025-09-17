"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

interface TeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingMember?: TEAM | null;
  onSuccess?: () => void;
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
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "order" ? parseInt(value) || 0 : value,
    }));
  };

  const handleImageChange = (files: File | File[] | null) => {
    // Since we're using single file mode (multiple={false}),
    // we expect either a single File or null
    if (files === null) {
      setSelectedImage(null);
    } else if (files instanceof File) {
      setSelectedImage(files);
    } else if (Array.isArray(files) && files.length > 0) {
      // Handle the case where an array is returned (shouldn't happen with multiple=false)
      setSelectedImage(files[0]);
    } else {
      setSelectedImage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      toast.error("Failed to save team member");
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
              />
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
              />
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
              />
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
              />
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-2">
            <Label htmlFor="about">About</Label>
            <Textarea
              id="about"
              name="about"
              value={formData.about}
              onChange={handleInputChange}
              placeholder="Brief description about the team member..."
              rows={3}
            />
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
                  placeholder="Facebook profile URL"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  placeholder="Instagram profile URL"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  placeholder="LinkedIn profile URL"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  placeholder="Twitter profile URL"
                />
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
