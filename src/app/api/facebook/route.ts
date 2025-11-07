import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";

export async function GET() {
  try {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/facebook/`, {
      method: "GET",
      headers: createHeaders(),
    });

    if (!response.ok) {
      console.error(`Backend API error: ${response.status}`);
      return NextResponse.json([], { status: 200 }); 
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Facebook integrations:", error);
    return NextResponse.json([], { status: 200 }); 
  }
}
