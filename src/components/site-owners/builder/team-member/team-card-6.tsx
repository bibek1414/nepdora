import React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { TEAM } from "@/types/owner-site/admin/team-member";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface TeamCard6Props {
  member: TEAM;
  onClick?: () => void;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80";

export const TeamCard6: React.FC<TeamCard6Props> = ({ member, onClick }) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#0EA5E9",
      background: "#FFFFFF",
    },
    fonts: {
      heading: "Poppins",
      body: "Inter",
    },
  };

  return (
    <div
      className="group relative flex w-full cursor-pointer flex-col"
      onClick={onClick}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
        <Image
          src={member.photo || FALLBACK_IMAGE}
          alt={member.name}
          fill
          sizes="(min-width: 1024px) 350px, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10"></div>

        <div className="absolute right-6 bottom-6 left-6 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="rounded-xl bg-slate-900/90 p-4 text-white backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4
                  className="text-lg font-semibold text-white"
                  style={{ fontFamily: theme.fonts.heading }}
                >
                  {member.name}
                </h4>
                {member.role && (
                  <p
                    className="text-xs text-gray-300"
                    style={{ fontFamily: theme.fonts.body }}
                  >
                    {member.role}
                  </p>
                )}
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-900 transition-colors">
                <X size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
