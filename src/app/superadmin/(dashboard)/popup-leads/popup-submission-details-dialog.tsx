"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  User,
  ChevronLeft,
  ChevronRight,
  Globe,
  Mail,
  Phone,
  Clock,
} from "lucide-react";
import { NepdoraPopupSubmission } from "@/types/marketing/nepdora-popup";
import { format } from "date-fns";

interface PopupSubmissionDetailsDialogProps {
  submissions: NepdoraPopupSubmission[];
  currentId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmissionChange: (id: number) => void;
}

export default function PopupSubmissionDetailsDialog({
  submissions,
  currentId,
  isOpen,
  onClose,
  onSubmissionChange,
}: PopupSubmissionDetailsDialogProps) {
  const [currentSubmission, setCurrentSubmission] =
    useState<NepdoraPopupSubmission | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentId && submissions.length > 0) {
      const index = submissions.findIndex(s => s.id === currentId);
      if (index !== -1) {
        setCurrentSubmission(submissions[index]);
        setCurrentIndex(index);
      }
    }
  }, [currentId, submissions]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen || submissions.length <= 1) return;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          handlePrevious();
          break;
        case "ArrowRight":
          event.preventDefault();
          handleNext();
          break;
        case "Escape":
          event.preventDefault();
          onClose();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, currentIndex, submissions.length]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const nextSubmission = submissions[newIndex];
      setCurrentIndex(newIndex);
      setCurrentSubmission(nextSubmission);
      onSubmissionChange(nextSubmission.id);
    }
  };

  const handleNext = () => {
    if (currentIndex < submissions.length - 1) {
      const newIndex = currentIndex + 1;
      const nextSubmission = submissions[newIndex];
      setCurrentIndex(newIndex);
      setCurrentSubmission(nextSubmission);
      onSubmissionChange(nextSubmission.id);
    }
  };

  if (!currentSubmission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="-none max-w-3xl overflow-visible border-none bg-transparent p-0">
        {/* Navigation Arrows */}
        {submissions.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="-lg absolute top-1/2 -left-16 z-50 h-12 w-12 -translate-y-1/2 rounded-full bg-white/90 p-0 transition-all hover:bg-white disabled:opacity-0"
            >
              <ChevronLeft className="h-6 w-6 text-gray-900" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex === submissions.length - 1}
              className="-lg absolute top-1/2 -right-16 z-50 h-12 w-12 -translate-y-1/2 rounded-full bg-white/90 p-0 transition-all hover:bg-white disabled:opacity-0"
            >
              <ChevronRight className="h-6 w-6 text-gray-900" />
            </Button>
          </>
        )}

        <div className="-2xl relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-3xl bg-white">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-gray-50/50 px-8 py-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Lead Details
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-3 w-3" />
                  Submitted on{" "}
                  {format(new Date(currentSubmission.created_at), "PPP p")}
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-y-auto p-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Visitor Info */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-800">
                    Visitor Information
                  </h3>

                  <div className="group flex items-start gap-3">
                    <div className="mt-1 rounded-lg bg-gray-50 p-2 text-gray-800 transition-colors group-hover:bg-red-50 group-hover:text-red-600">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Full Name</p>
                      <p className="font-semibold text-gray-900">
                        {currentSubmission.name}
                      </p>
                    </div>
                  </div>

                  <div className="group flex items-start gap-3">
                    <div className="mt-1 rounded-lg bg-gray-50 p-2 text-gray-800 transition-colors group-hover:bg-red-50 group-hover:text-red-600">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email Address</p>
                      <p className="font-semibold text-gray-900">
                        {currentSubmission.email || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="group flex items-start gap-3">
                    <div className="mt-1 rounded-lg bg-gray-50 p-2 text-gray-800 transition-colors group-hover:bg-red-50 group-hover:text-red-600">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone Number</p>
                      <p className="font-semibold text-gray-900">
                        {currentSubmission.phone_number || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-sm font-bold text-gray-800">
                    Project Details
                  </h3>
                  <div className="group flex items-start gap-3">
                    <div className="mt-1 rounded-lg bg-red-50 p-2 text-red-600">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Interested In</p>
                      <p className="bg-linear-to-r from-red-600 to-rose-600 bg-clip-text font-bold text-transparent">
                        {currentSubmission.website_type || "No specific type"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col space-y-4">
                <h3 className="text-sm font-bold text-gray-800">
                  Message / Inquiry
                </h3>
                <div className="relative flex-1 overflow-hidden rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/50 p-6">
                  <p className="relative z-10 leading-relaxed whitespace-pre-wrap text-gray-700">
                    {currentSubmission.message
                      ? `"${currentSubmission.message}"`
                      : "No message provided."}
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
