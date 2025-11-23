import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Facebook } from "lucide-react";
import { TEAM } from "@/types/owner-site/admin/team-member";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

const adjustColor = (color: string, amount = 0.1) => {
  if (!color || typeof color !== "string" || !color.startsWith("#")) {
    return color;
  }

  let hex = color.replace("#", "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map(char => `${char}${char}`)
      .join("");
  }

  if (hex.length !== 6) {
    return color;
  }

  const num = parseInt(hex, 16);
  const clamp = (value: number) => Math.max(0, Math.min(255, value));
  const amountValue = Math.round(255 * amount);

  const r = clamp((num >> 16) + amountValue);
  const g = clamp(((num >> 8) & 0xff) + amountValue);
  const b = clamp((num & 0xff) + amountValue);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

interface TeamCard5Props {
  member: TEAM;
  onClick?: () => void;
  hasBlueBorder?: boolean;
}

export const TeamCard5: React.FC<TeamCard5Props> = ({
  member,
  onClick,
  hasBlueBorder = false,
}) => {
  const handleSocialClick = (e: React.MouseEvent, url?: string) => {
    e.stopPropagation();
    if (url) {
      window.open(url, "_blank");
    }
  };

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

  const primaryColor = theme.colors.primary ?? "#4F46E5";
  const secondaryColor = theme.colors.secondary ?? "#CBD5F5";
  const backgroundColor = theme.colors.background ?? "#F3F4F6";
  const textColor = theme.colors.text ?? "#0F172A";

  const offsetBaseColor = hasBlueBorder
    ? adjustColor(primaryColor, 0.25)
    : adjustColor(backgroundColor, -0.05);
  const borderColor = hasBlueBorder ? primaryColor : "rgba(148, 163, 184, 0.5)";
  const cardBackgroundColor = hasBlueBorder
    ? adjustColor(primaryColor, 0.6)
    : adjustColor(backgroundColor, 0.05);
  const buttonBaseColor = hasBlueBorder ? primaryColor : secondaryColor;
  const buttonHoverColor = hasBlueBorder
    ? (theme.colors.secondary ?? primaryColor)
    : primaryColor;

  const cssVariables: React.CSSProperties & Record<string, string> = {
    "--team-card-offset-base": offsetBaseColor,
    "--team-card-offset-hover": primaryColor,
    "--team-card-button": buttonBaseColor,
    "--team-card-button-hover": buttonHoverColor,
    "--team-card-border": borderColor,
  };

  return (
    <div
      className="flex w-full max-w-[400px] cursor-pointer flex-col items-center"
      onClick={onClick}
      style={cssVariables}
    >
      {/* Image Card with offset background */}
      <div className="group relative mb-6 w-full">
        {/* Offset background layer */}
        <div className="pointer-events-none absolute right-4 bottom-4 z-0 aspect-[4/5] w-full rounded-[32px] bg-[var(--team-card-offset-base)] transition-colors duration-300 group-hover:bg-[var(--team-card-offset-hover)]"></div>

        {/* Main card container */}
        <div
          className="relative z-10 aspect-[4/5] w-full overflow-hidden rounded-[32px] border shadow-md transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg"
          style={{
            borderColor: "var(--team-card-border)",
            backgroundColor: cardBackgroundColor,
          }}
        >
          <Image
            src={member.photo}
            alt={member.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />

          {/* Facebook Icon Button */}
          <Button
            className="absolute right-4 bottom-4 z-10 rounded-lg bg-[var(--team-card-button)] p-3 text-white transition-all duration-300 group-hover:bg-[var(--team-card-button-hover)] hover:shadow-lg disabled:opacity-50"
            size="icon"
            onClick={e => handleSocialClick(e, member.facebook)}
            disabled={!member.facebook}
          >
            <Facebook size={20} />
          </Button>
        </div>
      </div>

      {/* Text Information */}
      <div className="text-center">
        <p
          className="mb-2 text-base"
          style={{
            color: secondaryColor,
            fontFamily: theme.fonts.body,
          }}
        >
          {member.role}
        </p>
        <h3
          className="text-2xl font-bold"
          style={{
            color: textColor,
            fontFamily: theme.fonts.heading,
          }}
        >
          {member.name}
        </h3>
      </div>
    </div>
  );
};
