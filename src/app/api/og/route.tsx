import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parameters: ?title=<title>&subtitle=<subtitle>
    const title = searchParams.get("title") || "Nepdora";
    const subtitle =
      searchParams.get("subtitle") || "The Best AI Website Builder in Nepal";

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
            backgroundColor: "#0f172a", // slate-900
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
              width: "400px",
              height: "400px",
              borderRadius: "200px",
              backgroundColor: "#1e3a8a",
              filter: "blur(100px)",
              opacity: 0.3,
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-100px",
              right: "-100px",
              width: "400px",
              height: "400px",
              borderRadius: "200px",
              backgroundColor: "#115e59",
              filter: "blur(100px)",
              opacity: 0.3,
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
              borderRadius: "24px",
              padding: "60px",
              backgroundColor: "rgba(15, 23, 42, 0.6)",
              width: "1000px",
              height: "500px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Branded Label */}
            <div
              style={{
                display: "flex",
                color: "#0ea5e9",
                fontSize: "18px",
                fontWeight: "bold",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "20px",
              }}
            >
              Industry Leading Excellence
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: title.length > 30 ? "54px" : "72px",
                fontWeight: 900,
                color: "white",
                marginBottom: "20px",
                textAlign: "center",
                lineHeight: 1.1,
                display: "flex",
                fontFamily: "sans-serif",
              }}
            >
              {title}
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontSize: "32px",
                color: "#94a3b8", // slate-400
                textAlign: "center",
                maxWidth: "800px",
                display: "flex",
              }}
            >
              {subtitle}
            </div>

            {/* Logo area */}
            <div
              style={{
                display: "flex",
                marginTop: "40px",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  height: "2px",
                  width: "100px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }}
              />
              <div
                style={{
                  color: "white",
                  fontSize: "24px",
                  fontWeight: "bold",
                  display: "flex",
                }}
              >
                Nepdora
              </div>
              <div
                style={{
                  height: "2px",
                  width: "100px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
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
              gap: "20px",
            }}
          >
            <div
              style={{ color: "#0ea5e9", fontWeight: "bold", fontSize: "24px" }}
            >
              Nepal's Own Site Builder
            </div>
            <div
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "2px",
                backgroundColor: "#334155",
              }}
            />
            <div style={{ color: "white", fontSize: "24px" }}>nepdora.com</div>
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
