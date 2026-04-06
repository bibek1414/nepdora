import React from "react";
import { Heart } from "lucide-react";

interface MadeWithLoveProps {
  textColor?: string;
  className?: string;
}

export const MadeWithLove = ({
  textColor,
  className = "",
}: MadeWithLoveProps) => {
  return (
    <div
      className={`flex items-center justify-center gap-1.5 text-xs transition-opacity hover:opacity-100 ${className}`}
      style={{ color: textColor || "inherit", opacity: 0.7 }}
    >
      <span>Made with</span>
      <Heart
        className="inline h-3.5 w-3.5 fill-red-500 text-red-500"
        aria-hidden="true"
      />
      <a
        href="https://www.nepdora.com"
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold tracking-tight"
      >
        Nepdora
      </a>
    </div>
  );
};
