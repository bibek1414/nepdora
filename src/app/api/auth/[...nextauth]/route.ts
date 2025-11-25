import NextAuth from "next-auth";
import nextAuthOptions from "../../../../../auth";

const authHandler = NextAuth(nextAuthOptions);

// NextAuth v4 handler works for both GET and POST
export const GET = authHandler;
export const POST = authHandler;
