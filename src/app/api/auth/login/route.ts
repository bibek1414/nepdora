import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

// These should NOT have NEXT_PUBLIC_ prefix - they stay server-side only
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // Check credentials SERVER-SIDE
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Create JWT token
      const token = await new SignJWT({
        email,
        role: "admin",
        exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60, // 8 hours
      })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("8h")
        .sign(new TextEncoder().encode(JWT_SECRET));

      // Set secure HTTP-only cookie
      const response = NextResponse.json({
        success: true,
        user: { email },
      });

      response.cookies.set("admin_token", token, {
        httpOnly: true, // Cannot be accessed by JavaScript
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        sameSite: "strict",
        maxAge: 8 * 60 * 60, // 8 hours
        path: "/",
      });

      return response;
    }

    // Invalid credentials
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
