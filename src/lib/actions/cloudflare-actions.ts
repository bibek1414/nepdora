"use server";

export async function addDomainToCloudflare(domainName: string) {
  try {
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

    if (!apiToken || !accountId) {
      return {
        success: false,
        error: "Cloudflare API Token or Account ID is not configured.",
      };
    }

    // Step 1: Create the zone
    const createZoneResponse = await fetch(
      "https://api.cloudflare.com/client/v4/zones",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: domainName,
          account: {
            id: accountId,
          },
        }),
      }
    );

    const createZoneData = await createZoneResponse.json();

    if (!createZoneResponse.ok || !createZoneData.success) {
      console.error("Cloudflare Add Zone Error:", createZoneData.errors);
      return {
        success: false,
        error:
          createZoneData.errors?.[0]?.message ||
          "Failed to create domain zone in Cloudflare.",
      };
    }

    const zoneId = createZoneData.result.id;

    // Step 2: Get nameservers
    const getZoneResponse = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const getZoneData = await getZoneResponse.json();

    if (!getZoneResponse.ok || !getZoneData.success) {
      console.error("Cloudflare Get Zone Error:", getZoneData.errors);
      return {
        success: false,
        error:
          getZoneData.errors?.[0]?.message ||
          "Failed to retrieve nameservers for the domain.",
      };
    }

    const nameServers =
      getZoneData.result.name_servers || getZoneData.result.nameservers;

    return {
      success: true,
      nameservers: nameServers,
    };
  } catch (error: any) {
    console.error("Cloudflare API Exception:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred.",
    };
  }
}

export async function checkDomainVerificationStatus(domainName: string) {
  try {
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    if (!apiToken) {
      return { success: false, error: "Cloudflare API Token not configured." };
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones?name=${domainName}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.errors?.[0]?.message || "Check failed",
      };
    }

    if (!data.result || data.result.length === 0) {
      return { success: false, error: "Zone not found" };
    }

    const zone = data.result[0];
    const status = zone.status; // 'active', 'pending', etc.
    const nameservers = zone.name_servers || zone.nameservers;

    return {
      success: true,
      status,
      nameservers,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to verify status",
    };
  }
}

export async function checkDnsAndAddToCloudflare(domainName: string) {
  try {
    // 1. Resolve NS records securely using Cloudflare DNS-over-HTTPS (DoH)
    const response = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${domainName}&type=NS`,
      {
        headers: {
          Accept: "application/dns-json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return { success: false, error: "Failed to securely query DNS." };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dnsData: any = await response.json();

    if (!dnsData.Answer || dnsData.Answer.length === 0) {
      return {
        success: false,
        error: `DNS check failed. No nameservers found recursively for ${domainName}. Please update them to the Cloudflare nameservers provided in the UI.`,
      };
    }

    // Extract the nameserver targets
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nsRecords: string[] = dnsData.Answer.map((ans: any) => ans.data);

    // 2. Check if cloudflare is in any of the NS records
    const hasCloudflareNs = nsRecords.some(ns =>
      ns.toLowerCase().includes("cloudflare.com")
    );

    if (!hasCloudflareNs) {
      return {
        success: false,
        error: `DNS check failed. We found nameservers: ${nsRecords.join(", ") || "None"}. Please update them to the Cloudflare nameservers provided in the UI.`,
      };
    }

    // 3. DNS is valid! Proceed to add to Cloudflare.
    const addResult = await addDomainToCloudflare(domainName);

    if (!addResult.success) {
      return addResult; // Pass through CF error
    }

    return {
      success: true,
      nameservers: addResult.nameservers,
      message: "Domain added and automatically verified by Cloudflare.",
    };
  } catch (error: any) {
    console.error("DNS Resolution Error:", error);
    return {
      success: false,
      error:
        "Failed to resolve DNS securely via DoH. Make sure the domain is registered.",
    };
  }
}
