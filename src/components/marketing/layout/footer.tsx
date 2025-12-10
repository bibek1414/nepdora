"use client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ChevronRight, Loader2 } from "lucide-react";
import SocialIcons from "./social-icons";
import { useState } from "react";
import { useNewsletter } from "@/hooks/use-newsletter";
import { xinfinAddress, xinfinEmail, xinfinPhone } from "@/constants/contact";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="w-full overflow-hidden border-t border-gray-200 bg-gray-50 px-4 pt-12 pb-6 font-sans text-gray-900 sm:px-6 sm:pt-16 sm:pb-8 md:px-10 lg:px-20">
      <div className="mx-auto max-w-7xl">
        {/* Big Title Section - Made more compact (reduced margins) */}
        <motion.div
          className="relative mb-10 flex w-full justify-center sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Subtle glow effect behind the text */}
          <div className="bg-primary-500/5 pointer-events-none absolute top-1/2 left-1/2 h-24 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]"></div>

          <h1 className="xs:text-[15vw] bg-linear-to-b from-indigo-600 via-[#ea18c3] to-white bg-clip-text text-center font-serif text-[17vw] leading-[0.85] font-medium tracking-tighter text-transparent select-none sm:text-[13.5vw] sm:leading-[0.8]">
            NEPDORA
          </h1>
        </motion.div>

        {/* Main Content Grid - Reduced gap and bottom margin */}
        <motion.div
          className="mb-12 grid grid-cols-1 gap-8 sm:mb-16 sm:gap-10 lg:grid-cols-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Column 1: Info & Address */}
          <motion.div
            className="flex flex-col space-y-5 pr-0 sm:space-y-6 lg:col-span-4 lg:pr-12"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Image
              src="/nepdora-logooo.svg"
              alt="Logo"
              width={100}
              height={100}
            />
            <p className="max-w-sm text-xs leading-relaxed text-gray-600 sm:text-sm">
              We&apos;re committed to delivering exceptional care with
              compassion, trust, and integrity. From your first visit to
              long-term support, your health and comfort are always our
              priority.
            </p>

            <hr className="w-full border-gray-200" />

            <div className="flex flex-col space-y-1.5 sm:space-y-2">
              <h3 className="text-base font-semibold text-gray-900">
                Visit Us
              </h3>
              <address className="text-xs leading-relaxed text-gray-600 not-italic sm:text-sm">
                {xinfinAddress}
                <br />
                {xinfinEmail}
                <br />
                {xinfinPhone}
              </address>
            </div>
          </motion.div>

          {/* Column 2: Main Pages Links */}
          <motion.div
            className="lg:col-span-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-900 sm:mb-6 sm:text-xl">
              Main Pages
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 sm:gap-x-8 sm:gap-y-3">
              <div className="flex flex-col space-y-3">
                <FooterLink href="/">Home</FooterLink>
                <FooterLink href="/services">Service</FooterLink>
                <FooterLink href="/about">About Us</FooterLink>
                <FooterLink href="/blog">Blog</FooterLink>
                <FooterLink href="/pricing">Pricing</FooterLink>
              </div>
              <div className="flex flex-col space-y-3">
                <FooterLink href="/contact">Contact Us</FooterLink>
                <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
                <FooterLink href="/terms">Terms and Conditions</FooterLink>
              </div>
            </div>
          </motion.div>

          {/* Column 3: Newsletter */}
          <motion.div
            className="pl-0 lg:col-span-4 lg:pl-8"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          >
            <h3 className="mb-3 text-lg font-semibold text-gray-900 sm:mb-4 sm:text-xl">
              Newsletter
            </h3>
            <p className="mb-5 max-w-xs text-xs text-gray-600 sm:mb-6 sm:text-sm">
              Let&apos;s transform your vision into results and discuss your
              vision with us.
            </p>

            <NewsletterForm />
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="flex flex-col items-center justify-between space-y-3 border-t border-gray-200 pt-5 sm:space-y-0 sm:pt-6 md:flex-row"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-xs text-gray-500">
            © Nepdora {new Date().getFullYear()} All rights reserved.
          </p>
          <SocialIcons />
        </motion.div>
      </div>
    </footer>
  );
};

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <a
    href={href}
    className="w-fit text-sm text-gray-500 transition-colors hover:text-black"
  >
    {children}
  </a>
);

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const { mutate, isPending } = useNewsletter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    mutate(email, {
      onSuccess: () => {
        toast.success("Subscribed successfully!");
        setEmail("");
      },
    });
  };

  return (
    <form
      className="flex flex-col space-y-2.5 sm:space-y-3"
      onSubmit={handleSubmit}
    >
      <input
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

export default Footer;
