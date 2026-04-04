import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parameters: ?title=<title>&subtitle=<subtitle>&label=<label>
    const title = searchParams.get("title") || "Nepdora";
    const subtitle = searchParams.get("subtitle") || "The Best AI Website Builder in Nepal";
    const label = searchParams.get("label") || "Industry Leading Excellence";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#020617", // slate-950
            padding: "40px",
            position: "relative",
          }}
        >
          {/* Background gradient decorations */}
          <div
            style={{
              position: "absolute",
              top: "-100px",
              left: "-100px",
              width: "600px",
              height: "600px",
              borderRadius: "300px",
              backgroundColor: "#1e1b4b", // indigo-950
              filter: "blur(120px)",
              opacity: 0.5,
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-150px",
              right: "-150px",
              width: "600px",
              height: "600px",
              borderRadius: "300px",
              backgroundColor: "#134e4a", // teal-950
              filter: "blur(120px)",
              opacity: 0.5,
              display: "flex",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "32px",
              padding: "80px",
              backgroundColor: "rgba(15, 23, 42, 0.4)",
              width: "1100px",
              height: "550px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Branded Label */}
            <div
              style={{
                display: "flex",
                color: "#38bdf8", // sky-400
                fontSize: "22px",
                fontWeight: "bold",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: "32px",
              }}
            >
              {label}
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: title.length > 40 ? "54px" : "76px",
                fontWeight: 900,
                color: "white",
                marginBottom: "24px",
                textAlign: "center",
                lineHeight: 1.1,
                display: "flex",
                fontFamily: "Inter, sans-serif",
                maxWidth: "900px",
              }}
            >
              {title}
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontSize: "30px",
                color: "#94a3b8", // slate-400
                textAlign: "center",
                maxWidth: "850px",
                display: "flex",
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </div>

            {/* Logo area */}
            <div
              style={{
                display: "flex",
                marginTop: "48px",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  height: "1px",
                  width: "120px",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                }}
              />
              <div
                style={{
                  color: "white",
                  fontSize: "28px",
                  fontWeight: "bold",
                  display: "flex",
                  letterSpacing: "-0.02em",
                }}
              >
                Nepdora
              </div>
              <div
                style={{
                  height: "1px",
                  width: "120px",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                }}
              />
            </div>
          </div>

          {/* Footer bar */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              display: "flex",
              alignItems: "center",
              gap: "24px",
            }}
          >
            <div
              style={{ color: "#38bdf8", fontWeight: "bold", fontSize: "26px" }}
            >
              Nepal's AI Site Builder
            </div>
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "3px",
                backgroundColor: "#334155",
              }}
            />
            <div style={{ color: "white", fontSize: "26px", opacity: 0.8 }}>
              nepdora.com
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
