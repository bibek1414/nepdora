"use client";
import React, { useState, useEffect } from "react";
import { Domain } from "@/types/super-admin/domain";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

interface DomainDetailsDialogProps {
  domains: Domain[];
  currentDomainId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onDomainChange: (domainId: number) => void;
}

export const DomainDetailsDialog: React.FC<DomainDetailsDialogProps> = ({
  domains,
  currentDomainId,
  isOpen,
  onClose,
  onDomainChange,
}) => {
  const [currentDomain, setCurrentDomain] = useState<Domain | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentDomainId && domains.length > 0) {
      const domainIndex = domains.findIndex(d => d.id === currentDomainId);
      if (domainIndex !== -1) {
        setCurrentDomain(domains[domainIndex]);
        setCurrentIndex(domainIndex);
      }
    }
  }, [currentDomainId, domains]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen || domains.length <= 1) return;
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
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, domains.length]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const newDomain = domains[newIndex];
      setCurrentIndex(newIndex);
      setCurrentDomain(newDomain);
      onDomainChange(newDomain.id);
    }
  };

  const handleNext = () => {
    if (currentIndex < domains.length - 1) {
      const newIndex = currentIndex + 1;
      const newDomain = domains[newIndex];
      setCurrentIndex(newIndex);
      setCurrentDomain(newDomain);
      onDomainChange(newDomain.id);
    }
  };

  if (!currentDomain) return null;

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const frontendUrl = `https://${currentDomain.tenant.schema_name}.nepdora.com/preview/${currentDomain.tenant.schema_name}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 w-[700px] max-w-none overflow-visible bg-white p-0 sm:rounded-2xl"
        style={{
          boxShadow:
            "0 8px 40px -8px rgba(0,0,0,0.12), 0 2px 8px -2px rgba(0,0,0,0.06)",
        }}
      >
        {/* Navigation Arrows - Desktop (outside dialog) */}
        {domains.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="absolute top-1/2 -left-14 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white transition-all duration-150 hover:scale-105 disabled:pointer-events-none disabled:opacity-0 md:flex"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex === domains.length - 1}
              className="absolute top-1/2 -right-14 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white transition-all duration-150 hover:scale-105 disabled:pointer-events-none disabled:opacity-0 md:flex"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </Button>
          </>
        )}

        <div className="max-h-[90vh] overflow-y-auto rounded-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white px-6 pt-6 pb-5 sm:px-8">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <DialogTitle className="text-base font-semibold tracking-tight text-gray-900">
                    Domain details
                  </DialogTitle>
                  {domains.length > 1 && (
                    <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                      {currentIndex + 1} / {domains.length}
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-sm text-gray-400">
                  {currentDomain.domain}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {/* Mobile navigation arrows */}
                {domains.length > 1 && (
                  <div className="flex items-center gap-1 md:hidden">
                    <button
                      onClick={handlePrevious}
                      disabled={currentIndex === 0}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-50 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={currentIndex === domains.length - 1}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-50 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="cursosr-pointer flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Thin divider */}
            <div className="mt-5 h-px bg-gray-100" />
          </div>

          {/* Body */}
          <div className="px-6 pb-8 sm:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {/* Tenant Information */}
              <section>
                <p className="mb-4 text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                  Tenant
                </p>
                <dl className="space-y-4">
                  <div>
                    <dt className="mb-0.5 text-xs text-gray-400">
                      Business name
                    </dt>
                    <dd className="text-sm font-medium text-gray-800 capitalize">
                      {currentDomain.tenant.name}
                    </dd>
                  </div>
                  <div>
                    <dt className="mb-1 text-xs text-gray-400">Schema</dt>
                    <dd>
                      <code className="rounded-md bg-gray-50 px-2 py-1 font-mono text-xs text-gray-600">
                        {currentDomain.tenant.schema_name}
                      </code>
                    </dd>
                  </div>
                  <div>
                    <dt className="mb-0.5 text-xs text-gray-400">Live URL</dt>
                    <dd>
                      <a
                        href={`https://${currentDomain.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-500 transition hover:text-blue-700 hover:underline"
                      >
                        <span className="max-w-[180px] truncate sm:max-w-none">
                          {currentDomain.domain}
                        </span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    </dd>
                  </div>
                </dl>
              </section>

              {/* Owner Information */}
              <section>
                <p className="mb-4 text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                  Owner
                </p>
                <dl className="space-y-4">
                  <div>
                    <dt className="mb-0.5 text-xs text-gray-400">
                      Email address
                    </dt>
                    <dd className="truncate text-sm font-medium text-gray-800">
                      {currentDomain.tenant.owner.email}
                    </dd>
                  </div>
                  <div>
                    <dt className="mb-0.5 text-xs text-gray-400">
                      Phone number
                    </dt>
                    <dd className="text-sm font-medium text-gray-800">
                      {currentDomain.tenant.owner.phone_number || (
                        <span className="text-gray-400">Not provided</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </section>
            </div>

            {/* Divider */}
            <div className="my-8 h-px bg-gray-100" />

            {/* Subscription & Lifecycle */}
            <section>
              <p className="mb-4 text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                Subscription &amp; lifecycle
              </p>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                <div>
                  <dt className="mb-0.5 text-xs text-gray-400">Created on</dt>
                  <dd className="text-sm font-medium text-gray-800">
                    {formatDate(currentDomain.created_at)}
                  </dd>
                </div>
                <div>
                  <dt className="mb-0.5 text-xs text-gray-400">Plan type</dt>
                  <dd className="text-sm font-medium text-gray-800">
                    {(currentDomain.tenant as any).pricing_plan?.name ||
                      "Standard"}
                  </dd>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <dt className="mb-0.5 text-xs text-gray-400">Paid until</dt>
                  <dd className="text-sm font-medium text-gray-800">
                    {(currentDomain.tenant as any).paid_until
                      ? formatDate((currentDomain.tenant as any).paid_until)
                      : "-"}
                  </dd>
                </div>
              </div>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
