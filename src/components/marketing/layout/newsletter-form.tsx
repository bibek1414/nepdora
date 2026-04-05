"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, ChevronRight } from "lucide-react";
import { useNewsletter } from "@/hooks/use-newsletter";

export const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const { mutate, isPending } = useNewsletter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (websiteUrl) {
      setEmail("");
      setWebsiteUrl("");
      toast.success("Successfully subscribed!");
      return;
    }

    mutate(email, {
      onSuccess: () => {
        setEmail("");
        toast.success("Successfully subscribed!");
      },
    });
  };

  return (
    <form
      className="flex flex-col space-y-2.5 sm:space-y-3"
      onSubmit={handleSubmit}
    >
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
      <label htmlFor="newsletter-email" className="sr-only">
        Email Address
      </label>
      <input
        id="newsletter-email"
        type="email"
        placeholder="Enter your email address"
        className="focus:ring-primary-500 w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs text-gray-900 transition-all outline-none placeholder:text-gray-500 focus:ring-2 sm:px-6 sm:py-3 sm:text-sm"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={isPending}
        className="group bg-primary hover:bg-primary-600 xs:justify-start shadow-primary-500/20 flex w-fit items-center justify-center space-x-2.5 rounded-full py-2 pr-2 pl-5 text-white shadow-md transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70 sm:space-x-3 sm:pl-6"
      >
        <span className="text-xs font-medium sm:text-sm">
          {isPending ? "Subscribing..." : "Subscribe"}
        </span>
        <div className="rounded-full bg-white p-1.5 transition-transform duration-300 group-hover:rotate-45 sm:p-2">
          {isPending ? (
            <Loader2 size={16} className="text-primary animate-spin" />
          ) : (
            <ChevronRight size={16} className="text-primary" />
          )}
        </div>
      </button>
    </form>
  );
};
