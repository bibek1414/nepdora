// app/api/og/route.tsx
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";
export const revalidate = 86400;

// =============================
// 🚀 FONT CACHE (CRITICAL FIX)
// =============================
let fontCache: Promise<Record<string, ArrayBuffer>> | null = null;

function loadFonts() {
  if (!fontCache) {
    fontCache = (async () => {
      const [r, b] = await Promise.all([
        fetch(
          "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.ttf"
        ).then(r => r.arrayBuffer()),

        fetch(
          "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.ttf"
        ).then(r => r.arrayBuffer()),
      ]);

      return {
        regular: r,
        bold: b,
      };
    })();
  }

  return fontCache;
}

// =============================
// 🎨 THEMES
// =============================
const themes = {
  dark: {
    bg: "#020617",
    bgGradient1: "#1e1b4b",
    bgGradient2: "#134e4a",
    border: "rgba(255, 255, 255, 0.15)",
    cardBg: "rgba(15, 23, 42, 0.6)",
    titleColor: "white",
    subtitleColor: "#94a3b8",
    accentColor: "#38bdf8",
    accentColorLight: "#7dd3fc",
  },
  light: {
    bg: "#ffffff",
    bgGradient1: "#e0f2fe",
    bgGradient2: "#fce7f3",
    border: "rgba(0, 0, 0, 0.15)",
    cardBg: "rgba(255, 255, 255, 0.9)",
    titleColor: "#0f172a",
    subtitleColor: "#475569",
    accentColor: "#0ea5e9",
    accentColorLight: "#0284c7",
  },
  primary: {
    bg: "#0f172a",
    bgGradient1: "#1e3a5f",
    bgGradient2: "#0c4a6e",
    border: "rgba(56, 189, 248, 0.25)",
    cardBg: "rgba(30, 41, 59, 0.7)",
    titleColor: "white",
    subtitleColor: "#cbd5e1",
    accentColor: "#38bdf8",
    accentColorLight: "#7dd3fc",
  },
};

// Helper function to truncate text with ellipsis
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

// Helper function to get responsive font sizes
function getFontSizes(title: string, subtitle: string) {
  let titleSize = "78px";
  let subtitleSize = "28px";
  let titleLineHeight = 1.1;
  let subtitleMaxWidth = "800px";

  if (title.length > 60) {
    titleSize = "44px";
    titleLineHeight = 1.2;
  } else if (title.length > 45) {
    titleSize = "52px";
    titleLineHeight = 1.15;
  } else if (title.length > 30) {
    titleSize = "64px";
  }

  if (subtitle.length > 120) {
    subtitleSize = "22px";
    subtitleMaxWidth = "720px";
  } else if (subtitle.length > 90) {
    subtitleSize = "24px";
    subtitleMaxWidth = "760px";
  } else if (subtitle.length > 60) {
    subtitleSize = "26px";
  }

  return { titleSize, titleLineHeight, subtitleSize, subtitleMaxWidth };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Get and clean params
    let title = searchParams.get("title") || "Nepdora";
    let subtitle =
      searchParams.get("subtitle") || "The Best Website Builder in Nepal";
    const label = searchParams.get("label") || "Made for Nepal";
    const theme = (searchParams.get("theme") as keyof typeof themes) || "dark";
    let ctaText = searchParams.get("cta") || "Start Building Free";
    const showCTA = searchParams.get("showCTA") !== "false";

    // Clean and truncate inputs
    title = truncateText(title, 80);
    subtitle = truncateText(subtitle, 180);
    ctaText = truncateText(ctaText, 25);

    const config = themes[theme] || themes.dark;
    const { titleSize, titleLineHeight, subtitleSize, subtitleMaxWidth } =
      getFontSizes(title, subtitle);

    // 🚀 load cached fonts
    const fonts = await loadFonts();

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: config.bg,
          padding: "40px",
          position: "relative",
        }}
      >
        {/* Background blobs */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            left: "-150px",
            width: "550px",
            height: "550px",
            background: config.bgGradient1,
            filter: "blur(60px)",
            opacity: 0.35,
            borderRadius: "50%",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            right: "-150px",
            width: "550px",
            height: "550px",
            background: config.bgGradient2,
            filter: "blur(60px)",
            opacity: 0.35,
            borderRadius: "50%",
          }}
        />

        {/* SINGLE BORDER CARD - clean design */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "1020px",
            height: "520px",
            borderRadius: "40px",
            padding: "60px 70px",
            background: config.cardBg,
            border: `1.5px solid ${config.border}`,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            position: "relative",
            backdropFilter: "blur(2px)",
          }}
        >
          {/* Label - small badge */}
          <div
            style={{
              color: config.accentColor,
              fontSize: "16px",
              letterSpacing: "0.25em",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: 500,
              background:
                theme === "light"
                  ? "rgba(0,0,0,0.04)"
                  : "rgba(255,255,255,0.05)",
              padding: "6px 16px",
              borderRadius: "100px",
            }}
          >
            {label}
          </div>

          {/* Title - responsive */}
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 800,
              color: config.titleColor,
              textAlign: "center",
              lineHeight: titleLineHeight,
              display: "flex",
              maxWidth: "850px",
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>

          {/* Subtitle - responsive with line clamp effect */}
          <div
            style={{
              marginTop: "24px",
              fontSize: subtitleSize,
              color: config.subtitleColor,
              textAlign: "center",
              display: "flex",
              maxWidth: subtitleMaxWidth,
              lineHeight: 1.4,
              fontWeight: 400,
            }}
          >
            {subtitle}
          </div>

          {/* CTA Button */}
          {showCTA && (
            <div
              style={{
                marginTop: "42px",
                padding: "12px 34px",
                borderRadius: "999px",
                background: config.accentColor,
                color: "white",
                fontSize: "18px",
                fontWeight: 600,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              {ctaText}
            </div>
          )}

          {/* Brand watermark */}
          <div
            style={{
              marginTop: "40px",
              fontSize: "24px",
              fontWeight: 700,
              color: config.titleColor,
              display: "flex",
              opacity: 0.9,
              letterSpacing: "-0.01em",
            }}
          >
            Nepdora
          </div>
        </div>

        {/* Footer - subtle */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            display: "flex",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              color: config.accentColor,
              fontSize: "16px",
              display: "flex",
              fontWeight: 500,
            }}
          >
            Nepal’s #1 Website Builder
          </div>
          <div
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: config.subtitleColor,
              opacity: 0.5,
            }}
          />
          <div
            style={{
              color: config.subtitleColor,
              fontSize: "16px",
              display: "flex",
            }}
          >
            nepdora.com
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: "Inter", data: fonts.regular, weight: 400 },
          { name: "Inter", data: fonts.bold, weight: 700 },
        ],
        headers: {
          "Cache-Control":
            "public, s-maxage=31536000, stale-while-revalidate=86400",
        },
      }
    );
  } catch (e: any) {
    console.error("OG Error:", e.message);
    return new Response("Failed to generate image", { status: 500 });
  }
}
