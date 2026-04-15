"use server";

const WHOIS_JSON_API_KEY = process.env.WHOIS_JSON_API_KEY;

export interface WhoisData {
  domain?: string;
  registrar?: string;
  created_date?: string;
  expires_date?: string;
  status?: string[];
  nameservers?: string[];
  registered?: boolean;
  isDemo?: boolean;
  error?: string;
}

function getMockData(domain: string): WhoisData {
  const isAvailable =
    !domain.includes("google") &&
    !domain.includes("facebook") &&
    !domain.includes("amazon");

  return {
    domain: domain,
    registrar: isAvailable ? undefined : "SafeNames Ltd.",
    created_date: isAvailable ? undefined : "2000-01-15T00:00:00Z",
    expires_date: isAvailable ? undefined : "2028-01-15T00:00:00Z",
    status: isAvailable
      ? []
      : ["clientDeleteProhibited", "clientTransferProhibited"],
    nameservers: isAvailable
      ? []
      : ["ns1.markmonitor.com", "ns2.markmonitor.com"],
    registered: !isAvailable,
    isDemo: true,
  };
}

export async function checkDomainAvailability(
  domain: string
): Promise<WhoisData> {
  if (!domain) {
    return { error: "Domain name is required" };
  }

  // Basic validation to prevent unnecessary API calls
  const domainRegex =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,9}$/;
  // Handle .com.np etc
  const isNepaliDomain = domain.endsWith(".np");

  if (!domainRegex.test(domain) && !isNepaliDomain) {
    // If it doesn't match standard regex but is a valid looking string, we'll try anyway
  }

  // If no API key, go straight to mock
  if (!WHOIS_JSON_API_KEY || WHOIS_JSON_API_KEY === "your_api_key_here") {
    return getMockData(domain);
  }

  try {
    const response = await fetch(
      `https://whoisjson.com/api/v1/whois?domain=${encodeURIComponent(domain)}`,
      {
        headers: {
          Authorization: `TOKEN=${WHOIS_JSON_API_KEY}`,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("WhoisJSON API Key invalid. Showing fallback mock data.");
        return getMockData(domain);
      }
      return getMockData(domain); // Also fallback on other errors for "nice" UX
    }

    const data = await response.json();

    // Normalize status to always be an array of strings
    let normalizedStatus: string[] = [];
    if (data.status) {
      if (Array.isArray(data.status)) {
        normalizedStatus = data.status.map(String);
      } else if (typeof data.status === "string") {
        normalizedStatus = (data.status as string)
          .split(",")
          .map((s: string) => s.trim());
      }
    }

    return {
      domain: data.domain_name || domain,
      registrar: data.registrar?.name || data.registrar,
      created_date: data.created_date,
      expires_date: data.expiration_date,
      status: normalizedStatus,
      nameservers: data.name_servers,
      registered: data.registered ?? !!data.registrar,
      isDemo: false,
    };
  } catch (error) {
    console.error("WhoisJSON Error:", error);
    return getMockData(domain);
  }
}
