"use client";
import React from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { TEAM } from "@/types/owner-site/admin/team-member";

interface TeamCard10Props {
  member: TEAM;
  isEditable: boolean;
  onMemberClick?: (id: number) => void;
}

export const TeamCard10: React.FC<TeamCard10Props> = ({
  member,
  isEditable,
  onMemberClick,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className="relative cursor-pointer"
      onMouseEnter={() => !isEditable && setIsHovered(true)}
      onMouseLeave={() => !isEditable && setIsHovered(false)}
      onClick={() => !isEditable && onMemberClick?.(member.id)}
    >
      {/* Tall rounded-rectangle image shape */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: "3 / 4.2",
          borderRadius: "50% 50% 50% 50% / 40% 40% 40% 40%",
        }}
      >
        <img
          src={
            member.photo ||
            "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop"
          }
          alt={member.name}
          className="h-full w-full object-cover object-top transition-transform duration-1000"
          style={{
            transform: isHovered ? "scale(1.1)" : "scale(1)",
          }}
          referrerPolicy="no-referrer"
        />

        {/* Details Overlay — visible on hover */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-[#F5F0EB]/90 p-6 text-center transition-opacity duration-500 ease-in-out"
          style={{
            opacity: isHovered ? 1 : 0,
          }}
        >
          <h3 className="mb-2 font-serif text-xl leading-snug font-normal text-[#1A1A1A] md:text-2xl">
            {member.name}
          </h3>
          <p className="mb-6 font-sans text-[10px] tracking-[0.2em] text-[#1A1A1A]/60 uppercase md:text-xs">
            {member.role}
          </p>

          <div className="flex justify-center gap-4">
            {member.facebook && (
              <a
                href={member.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C97B63] transition-transform hover:scale-110"
              >
                <Facebook size={18} />
              </a>
            )}
            {member.instagram && (
              <a
                href={member.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C97B63] transition-transform hover:scale-110"
              >
                <Instagram size={18} />
              </a>
            )}
            {member.twitter && (
              <a
                href={member.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C97B63] transition-transform hover:scale-110"
              >
                <Twitter size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
      {isEditable && <div className="absolute inset-0 z-10 bg-transparent" />}
    </div>
  );
};
