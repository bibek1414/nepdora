import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  User,
  Copy,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Contact } from "@/types/owner-site/admin/contact";
import { useState, useEffect } from "react";

interface ContactDetailsDialogProps {
  contacts: Contact[];
  currentContactId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onContactChange: (contactId: number) => void;
}

const ContactDetailsDialog = ({
  contacts,
  currentContactId,
  isOpen,
  onClose,
  onContactChange,
}: ContactDetailsDialogProps) => {
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentContactId && contacts.length > 0) {
      const contactIndex = contacts.findIndex(
        contact => contact.id === currentContactId
      );
      if (contactIndex !== -1) {
        setCurrentContact(contacts[contactIndex]);
        setCurrentIndex(contactIndex);
      }
    }
  }, [currentContactId, contacts]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const newContact = contacts[newIndex];
      setCurrentIndex(newIndex);
      setCurrentContact(newContact);
      onContactChange(newContact.id);
    }
  };

  const handleNext = () => {
    if (currentIndex < contacts.length - 1) {
      const newIndex = currentIndex + 1;
      const newContact = contacts[newIndex];
      setCurrentIndex(newIndex);
      setCurrentContact(newContact);
      onContactChange(newContact.id);
    }
  };

  if (!currentContact) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl overflow-visible bg-black/80 p-0 backdrop-blur-sm">
        {/* Navigation Arrows - Positioned outside the dialog */}
        {contacts.length > 1 && (
          <>
            {/* Left Arrow */}
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="absolute top-1/2 -left-16 z-50 h-12 w-12 -translate-y-1/2 rounded-full bg-white/90 p-0 shadow-lg hover:bg-white disabled:opacity-0"
            >
              <ChevronLeft className="h-6 w-6 text-black" />
            </Button>

            {/* Right Arrow */}
            <Button
              variant="outline"
              size="lg"
              onClick={handleNext}
              disabled={currentIndex === contacts.length - 1}
              className="absolute top-1/2 -right-16 z-50 h-12 w-12 -translate-y-1/2 rounded-full bg-white/90 p-0 shadow-lg hover:bg-white disabled:opacity-0"
            >
              <ChevronRight className="h-6 w-6 text-black" />
            </Button>
          </>
        )}

        <div className="relative max-h-[95vh] w-full overflow-y-auto rounded-lg bg-white shadow">
          {/* Header with navigation indicator */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Contact Inquiry #{currentContact.id}
              </h2>
              <p className="text-sm text-gray-500">
                {contacts.length > 1 && (
                  <span className="mr-2">
                    {currentIndex + 1} of {contacts.length}
                  </span>
                )}
                Submitted on {formatDate(currentContact.created_at)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            {/* Contact Information Section */}
            <div className="mb-6">
              <div className="mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-gray-600" />
                <h3 className="text-base font-semibold text-gray-900">
                  Contact Information
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                    Full Name
                  </label>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {currentContact.name}
                    </p>
                  </div>
                </div>

                {/* Email */}
                {currentContact.email && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                      Email Address
                    </label>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-900">
                          {currentContact.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {currentContact.phone_number && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                      Phone Number
                    </label>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-900">
                          {currentContact.phone_number}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!currentContact.email && !currentContact.phone_number && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 italic md:col-span-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>No contact information provided</span>
                  </div>
                )}
              </div>
            </div>

            {/* Message Section */}
            <div className="mb-6">
              <div className="mb-4 flex items-center gap-2">
                <h3 className="text-base font-semibold text-gray-900">
                  Message
                </h3>
              </div>

              {currentContact.message ? (
                <div className="space-y-3">
                  <div className="rounded-lg border bg-gray-50 p-4">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-900">
                      {currentContact.message}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-gray-500 italic">
                  <MessageSquare className="h-4 w-4" />
                  <span>No message provided</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDetailsDialog;
