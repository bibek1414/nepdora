"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  Layout,
} from "lucide-react";
import { PopUpForm } from "@/types/owner-site/admin/popup";
import { useUpdatePopupForm } from "@/hooks/owner-site/admin/use-popup";

interface PopupFormDetailsDialogProps {
  popupForms: PopUpForm[];
  currentFormId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onFormChange: (formId: number) => void;
}

export function PopupFormDetailsDialog({
  popupForms,
  currentFormId,
  isOpen,
  onClose,
  onFormChange,
}: PopupFormDetailsDialogProps) {
  const [currentForm, setCurrentForm] = useState<PopUpForm | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const updatePopupForm = useUpdatePopupForm();
  const markedAsReadRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (currentFormId && popupForms.length > 0) {
      const index = popupForms.findIndex(f => f.id === currentFormId);
      if (index !== -1) {
        const form = popupForms[index];
        setCurrentForm(form);
        setCurrentIndex(index);

        // Mark as read if not already read
        if (
          isOpen &&
          form &&
          form.id !== undefined &&
          !form.is_read &&
          !markedAsReadRef.current.has(form.id)
        ) {
          markedAsReadRef.current.add(form.id);
          updatePopupForm.mutate({
            id: form.id,
            data: {
              ...form,
              is_read: true,
            },
          });
        }
      }
    }
  }, [currentFormId, popupForms, isOpen, updatePopupForm]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const newForm = popupForms[newIndex];
      setCurrentIndex(newIndex);
      setCurrentForm(newForm);
      if (newForm.id !== undefined) {
        onFormChange(newForm.id);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < popupForms.length - 1) {
      const newIndex = currentIndex + 1;
      const newForm = popupForms[newIndex];
      setCurrentIndex(newIndex);
      setCurrentForm(newForm);
      if (newForm.id !== undefined) {
        onFormChange(newForm.id);
      }
    }
  };

  if (!currentForm) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl overflow-visible bg-black/80 p-0 backdrop-blur-sm">
        {popupForms.length > 1 && (
          <>
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="absolute top-1/2 -left-16 z-50 h-12 w-12 -translate-y-1/2 rounded-full bg-white/90 p-0 shadow-lg hover:bg-white disabled:opacity-0"
            >
              <ChevronLeft className="h-6 w-6 text-black" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleNext}
              disabled={currentIndex === popupForms.length - 1}
              className="absolute top-1/2 -right-16 z-50 h-12 w-12 -translate-y-1/2 rounded-full bg-white/90 p-0 shadow-lg hover:bg-white disabled:opacity-0"
            >
              <ChevronRight className="h-6 w-6 text-black" />
            </Button>
          </>
        )}

        <div className="relative max-h-[90vh] w-full overflow-y-auto rounded-lg bg-white shadow">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-semibold text-gray-900">
                Popup Form Submission
              </h2>
              {popupForms.length > 1 && (
                <div className="text-xs text-gray-500">
                  {currentIndex + 1} of {popupForms.length}
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {currentForm.name || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">
                    {currentForm.email || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">
                    {currentForm.phone_number || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Layout className="mt-0.5 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Popup ID</p>
                  <p className="text-sm font-medium text-gray-900">
                    {currentForm.popup}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:col-span-2">
                <Calendar className="mt-0.5 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Submission Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(currentForm.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
