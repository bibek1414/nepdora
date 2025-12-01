import React, { useState } from "react";
import Image from "next/image";
import { Share2, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { TEAM } from "@/types/owner-site/admin/team-member";
import { EditableText } from "@/components/ui/editable-text";

interface TeamCard8Props {
  member: TEAM;
  onClick?: () => void;
  isEditable?: boolean;
  onUpdate?: (data: Partial<TEAM>) => void;
}

export const TeamCard8: React.FC<TeamCard8Props> = ({
  member,
  onClick,
  isEditable = false,
  onUpdate,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Check if member has any social links
  const hasSocialLinks = !!(
    member.twitter ||
    member.facebook ||
    member.instagram ||
    member.linkedin
  );

  const handleSocialClick = (e: React.MouseEvent, url?: string) => {
    e.stopPropagation();
    if (url) {
      window.open(url, "_blank");
    }
  };

  const handleNameChange = (newName: string) => {
    if (onUpdate) {
      onUpdate({ name: newName });
    }
  };

  const handleRoleChange = (newRole: string) => {
    if (onUpdate) {
      onUpdate({ role: newRole });
    }
  };

  return (
    <div
      className="group relative flex h-full flex-col rounded-[32px] bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="group relative mb-5 aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-[24px] bg-gray-200">
        <Image
          src={member.photo}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Overlay gradient for better text contrast if we were overlaying text, purely aesthetic here */}
        <div className="pointer-events-none absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
      </div>

      {/* Content Container */}
      <div className="mt-auto flex cursor-pointer items-center justify-between px-2 pb-2">
        <div className="flex flex-col">
          <EditableText
            value={member.name}
            onChange={handleNameChange}
            as="h3"
            className="text-lg leading-tight font-bold text-gray-900"
            isEditable={isEditable}
            placeholder="Name"
          />
          <EditableText
            value={member.role}
            onChange={handleRoleChange}
            as="p"
            className="mt-1 text-sm font-medium text-gray-500"
            isEditable={isEditable}
            placeholder="Role"
          />
        </div>

        {/* Share Interaction Area - Only show if member has social links */}
        {hasSocialLinks && (
          <div className="relative ml-4">
            {/* Social Menu Popover */}
            <div
              className={`absolute bottom-full left-1/2 z-10 mb-3 flex origin-bottom -translate-x-1/2 flex-col gap-3 rounded-full bg-[#84cc16] p-3 shadow-lg transition-all duration-300 ease-out ${
                isHovered
                  ? "translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none translate-y-4 scale-75 opacity-0"
              }`}
            >
              {member.twitter && (
                <button
                  onClick={e => handleSocialClick(e, member.twitter)}
                  className="cursor-pointer p-1 text-white transition-colors hover:text-green-100"
                  aria-label="Twitter"
                >
                  <Twitter size={18} strokeWidth={2.5} />
                </button>
              )}
              {member.facebook && (
                <button
                  onClick={e => handleSocialClick(e, member.facebook)}
                  className="cursor-pointer p-1 text-white transition-colors hover:text-green-100"
                  aria-label="Facebook"
                >
                  <Facebook size={18} strokeWidth={2.5} />
                </button>
              )}
              {member.instagram && (
                <button
                  onClick={e => handleSocialClick(e, member.instagram)}
                  className="cursor-pointer p-1 text-white transition-colors hover:text-green-100"
                  aria-label="Instagram"
                >
                  <Instagram size={18} strokeWidth={2.5} />
                </button>
              )}
              {member.linkedin && (
                <button
                  onClick={e => handleSocialClick(e, member.linkedin)}
                  className="cursor-pointer p-1 text-white transition-colors hover:text-green-100"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} strokeWidth={2.5} />
                </button>
              )}

              {/* Little triangle arrow pointing down */}
              <div className="absolute top-full left-1/2 -mt-1 h-0 w-0 -translate-x-1/2 border-t-[8px] border-r-[6px] border-l-[6px] border-t-[#84cc16] border-r-transparent border-l-transparent"></div>
            </div>

            {/* Share Button */}
            <button
              className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition-all duration-300 ${
                isHovered
                  ? "rotate-90 cursor-pointer border-[#84cc16] bg-[#84cc16] text-white"
                  : "cursor-pointer border-green-200 bg-white text-[#84cc16] hover:border-[#84cc16]"
              }`}
              aria-label="Share"
            >
              <Share2 size={18} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
