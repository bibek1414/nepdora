"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useCreateNewsletter } from "@/hooks/owner-site/admin/use-newsletter";
import { toast } from "sonner";

interface NewsletterFormProps {
  isEditable?: boolean;
  theme: any;
}

export const NewsletterForm = ({ isEditable, theme }: NewsletterFormProps) => {
  const [email, setEmail] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const mutation = useCreateNewsletter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isEditable || mutation.isPending) return;

    if (websiteUrl) {
      toast.success("Successfully subscribed!");
      setEmail("");
      setWebsiteUrl("");
      return;
    }

    try {
      await mutation.mutateAsync({
        email: email.trim(),
        is_subscribed: true,
      });
      toast.success("Successfully subscribed!");
      setEmail("");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong.");
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex w-full">
        {/* Honeypot field */}
        <input
          type="text"
          name="website_url"
          className="sr-only"
          tabIndex={-1}
          autoComplete="off"
          value={websiteUrl}
          onChange={e => setWebsiteUrl(e.target.value)}
        />
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full rounded-l-md border border-black/10 bg-white px-4 py-3 text-sm text-black transition-colors outline-none placeholder:text-slate-500 focus:border-black/30 disabled:opacity-50"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={isEditable || mutation.isPending}
        />
        <button
          type="submit"
          disabled={isEditable || mutation.isPending}
          className="flex min-w-[110px] items-center justify-center rounded-r-md px-6 py-3 text-sm font-bold whitespace-nowrap transition-colors duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          style={{
            backgroundColor: theme?.colors?.primary || "#000000",
            color: theme?.colors?.primaryForeground || "#FFFFFF",
          }}
        >
          {mutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Subscribe"
          )}
        </button>
      </form>
    </div>
  );
};
