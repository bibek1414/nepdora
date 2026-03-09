"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  Bell,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Newsletter } from "@/types/owner-site/admin/newsletter";
import { useUpdateNewsletter } from "@/hooks/owner-site/admin/use-newsletter";

interface NewsletterDetailsDialogProps {
  newsletters: Newsletter[];
  currentNewsletterId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onNewsletterChange: (newsletterId: number) => void;
}

export function NewsletterDetailsDialog({
  newsletters,
  currentNewsletterId,
  isOpen,
  onClose,
  onNewsletterChange,
}: NewsletterDetailsDialogProps) {
  const [currentNewsletter, setCurrentNewsletter] = useState<Newsletter | null>(
    null
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const updateNewsletter = useUpdateNewsletter();
  const markedAsReadRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (currentNewsletterId && newsletters.length > 0) {
      const index = newsletters.findIndex(n => n.id === currentNewsletterId);
      if (index !== -1) {
        const newsletter = newsletters[index];
        setCurrentNewsletter(newsletter);
        setCurrentIndex(index);

        // Mark as read if not already read
        if (
          isOpen &&
          newsletter &&
          !newsletter.is_read &&
          !markedAsReadRef.current.has(newsletter.id)
        ) {
          markedAsReadRef.current.add(newsletter.id);
          updateNewsletter.mutate({
            id: newsletter.id,
            data: {
              is_read: true,
            },
          });
        }
      }
    }
  }, [currentNewsletterId, newsletters, isOpen, updateNewsletter]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const newNewsletter = newsletters[newIndex];
      setCurrentIndex(newIndex);
      setCurrentNewsletter(newNewsletter);
      onNewsletterChange(newNewsletter.id);
    }
  };

  const handleNext = () => {
    if (currentIndex < newsletters.length - 1) {
      const newIndex = currentIndex + 1;
      const newNewsletter = newsletters[newIndex];
      setCurrentIndex(newIndex);
      setCurrentNewsletter(newNewsletter);
      onNewsletterChange(newNewsletter.id);
    }
  };

  if (!currentNewsletter) return null;

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
        {newsletters.length > 1 && (
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
              disabled={currentIndex === newsletters.length - 1}
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
                Newsletter Subscription
              </h2>
              {newsletters.length > 1 && (
                <div className="text-xs text-gray-500">
                  {currentIndex + 1} of {newsletters.length}
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
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email Address</p>
                  <p className="text-base font-medium text-gray-900">
                    {currentNewsletter.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                  <Bell className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <div className="mt-1 flex items-center gap-2">
                    {currentNewsletter.is_subscribed ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Subscribed
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="mr-1 h-3 w-3" />
                        Unsubscribed
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                  <Calendar className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date Subscribed</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(currentNewsletter.created_at)}
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
