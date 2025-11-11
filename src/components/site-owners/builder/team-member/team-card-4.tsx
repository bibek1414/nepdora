import React from "react";
import Image from "next/image";
import { TEAM } from "@/types/owner-site/admin/team-member";

interface TeamCard4Props {
  member: TEAM;
  onClick?: () => void;
}

export const TeamCard4: React.FC<TeamCard4Props> = ({ member, onClick }) => {
  const handleSocialClick = (e: React.MouseEvent, url?: string) => {
    e.stopPropagation();
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div
      className="flex cursor-pointer flex-col items-center"
      onClick={onClick}
    >
      <div className="size-20 overflow-hidden rounded-full">
        {/* Match size-20 (80px) circular avatar */}
        <Image
          src={member.photo}
          alt={member.name}
          width={80}
          height={80}
          className="aspect-square size-20 rounded-full object-cover"
        />
      </div>
      <h3 className="mt-2 text-center text-lg font-medium text-slate-700">
        {member.name}
      </h3>
      <p className="text-center text-sm text-indigo-600">{member.role}</p>

      <div className="mt-2 flex items-center gap-2 text-slate-400">
        {member.twitter && (
          <a
            href={member.twitter}
            target="_blank"
            rel="noreferrer"
            onClick={e => handleSocialClick(e, member.twitter)}
            className="transition-all hover:-translate-y-0.5 hover:text-indigo-500"
            aria-label="Twitter"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.335 3.333s-.584 1.75-1.667 2.834c1.333 8.333-7.833 14.416-15 9.666 1.833.083 3.667-.5 5-1.667-4.167-1.25-6.25-6.166-4.167-10 1.834 2.167 4.667 3.417 7.5 3.334-.75-3.5 3.334-5.5 5.834-3.167.916 0 2.5-1 2.5-1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        )}

        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noreferrer"
            onClick={e => handleSocialClick(e, member.linkedin)}
            className="transition-all hover:-translate-y-0.5 hover:text-indigo-500"
            aria-label="LinkedIn"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.332 6.667a5 5 0 0 1 5 5V17.5h-3.333v-5.834a1.667 1.667 0 0 0-3.334 0V17.5H8.332v-5.834a5 5 0 0 1 5-5M5.001 7.5H1.668v10h3.333zM3.335 5a1.667 1.667 0 1 0 0-3.333 1.667 1.667 0 0 0 0 3.333"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        )}

        {member.email && (
          <a
            href={`mailto:${member.email}`}
            onClick={e => handleSocialClick(e, `mailto:${member.email}`)}
            className="transition-all hover:-translate-y-0.5 hover:text-indigo-500"
            aria-label="Email"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m18.335 5.834-7.493 4.772a1.67 1.67 0 0 1-1.674 0l-7.5-4.772"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.668 3.334H3.335c-.92 0-1.667.746-1.667 1.666v10c0 .92.746 1.667 1.667 1.667h13.333c.92 0 1.667-.746 1.667-1.667V5c0-.92-.747-1.666-1.667-1.666"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
};
