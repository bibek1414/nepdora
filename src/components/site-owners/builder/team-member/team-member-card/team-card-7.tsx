import React from "react";
import { ChevronRight } from "lucide-react";
import { TEAM } from "@/types/owner-site/admin/team-member";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface TeamCard7Props {
  member: TEAM;
  isActive?: boolean;
  onClick?: () => void;
}

export const TeamCard7: React.FC<TeamCard7Props> = ({
  member,
  isActive,
  onClick,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  return (
    <div
      className={`group flex cursor-pointer items-center justify-between rounded-2xl border p-6 shadow-sm transition-colors`}
      style={{
        borderColor: isActive ? theme.colors.primary : "transparent",
        backgroundColor: isActive ? `${theme.colors.primary}0D` : "#FFFFFF", // 0D is approx 5% opacity
      }}
      onClick={onClick}
    >
      <div>
        <h4 className="text-lg font-bold">{member.name}</h4>
        <div
          className="mt-1 text-xs text-gray-500"
          style={{ fontFamily: theme.fonts.body }}
        >
          {member.role}
        </div>
      </div>
      <button
        className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors`}
        style={{
          backgroundColor: isActive ? theme.colors.primary : "#F3F4F6",
          color: isActive ? theme.colors.primaryForeground : "#4B5563",
        }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
