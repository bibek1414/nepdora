"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function WhatsAppButton({
  phoneNumber,
  message = "Hello! I'm interested in your products/services.",
  className = "",
  icon,
}: WhatsAppButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleWhatsAppClick = () => {
    // Format phone number (remove any non-digit characters)
    const formattedPhone = phoneNumber.replace(/\D/g, "");

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;

    // Open WhatsApp in a new window/tab
    window.open(whatsappUrl, "_blank");
  };

  // Default WhatsApp icon using your uploaded image
  const defaultWhatsAppIcon = (
    <Image
      src="/images/site-owners/whatsapp-icon/whatsapp-icon.png"
      alt="WhatsApp"
      width={50}
      height={50}
    />
  );

  return (
    <div className="fixed right-6 bottom-6">
      {/* WhatsApp Button */}
      <Button
        onClick={handleWhatsAppClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Contact us on WhatsApp"
        className={`relative h-14 w-14 rounded-full bg-[#2ea218] p-0 shadow-lg hover:bg-[#2ea218] ${className}`}
      >
        <div className="text-white">{icon || defaultWhatsAppIcon}</div>
      </Button>

      {/* Hover tooltip */}
      {isHovered && (
        <div className="absolute right-0 bottom-16 mb-2 rounded-lg bg-gray-800 px-3 py-2 text-sm whitespace-nowrap text-white shadow-lg">
          Chat with us on WhatsApp
          {/* Arrow pointing down */}
          <div className="absolute top-full right-4 h-0 w-0 border-t-4 border-r-4 border-l-4 border-t-gray-800 border-r-transparent border-l-transparent" />
        </div>
      )}
    </div>
  );
}
