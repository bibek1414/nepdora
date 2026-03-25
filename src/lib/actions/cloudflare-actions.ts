"use server";

export async function getAccountNameservers() {
  try {
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    let accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

    if (!apiToken || !accountId) {
      console.error("Cloudflare Configuration Missing:", {
        hasToken: !!apiToken,
        hasAccountId: !!accountId,
      });
      return {
        success: false,
        error: "Cloudflare API Token or Account ID is not configured.",
      };
    }

    // Strip any surrounding quotes that might be in the .env file
    accountId = accountId.replace(/^["']|["']$/g, "");

    console.log("Fetching account nameservers for account:", accountId);

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones?account.id=${accountId}&per_page=1`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.errors?.[0]?.message || "Failed to fetch zones.",
      };
    }

    if (data.result && data.result.length > 0) {
      const zone = data.result[0];
      const nameservers = zone.name_servers || zone.nameservers;
      if (nameservers && nameservers.length > 0) {
        return { success: true, nameservers };
      }
    }

    // Fallback if no zones or nameservers are available in the account yet
    return {
      success: true,
      nameservers: ["cleo.ns.cloudflare.com", "vivienne.ns.cloudflare.com"],
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch account nameservers.",
    };
  }
}

export async function addDomainToCloudflare(domainName: string) {
  try {
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    let accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

    if (!apiToken || !accountId) {
      return {
        success: false,
        error: "Cloudflare API Token or Account ID is not configured.",
      };
    }

    // Strip any surrounding quotes that might be in the .env file
    accountId = accountId.replace(/^["']|["']$/g, "");

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
        cache: "no-store",
      }
    );

    const createZoneData = await createZoneResponse.json();

    if (!createZoneResponse.ok || !createZoneData.success) {
      console.error("Cloudflare Add Zone Error:", createZoneData.errors);
      
      // Error 1061: Zone already exists
      if (createZoneData.errors?.[0]?.code === 1061) {
        console.log(`Zone ${domainName} already exists in Cloudflare. Fetching existing zone...`);
        const existingZoneRes = await checkDomainVerificationStatus(domainName);
        if (existingZoneRes.success && existingZoneRes.zoneId) {
          return {
            success: true,
            nameservers: existingZoneRes.nameservers,
            zoneId: existingZoneRes.zoneId,
            message: "Existing zone found and reused."
          };
        }
      }

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
        cache: "no-store",
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
        cache: "no-store",
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
      const accountNsResult = await getAccountNameservers();
      const defaultNameservers = accountNsResult.success
        ? accountNsResult.nameservers
        : ["cleo.ns.cloudflare.com", "vivienne.ns.cloudflare.com"];

      return {
        success: false,
        error: "Zone not found",
        nameservers: defaultNameservers,
      };
    }

    const zone = data.result[0];
    const status = zone.status; // 'active', 'pending', etc.
    const nameservers = zone.name_servers || zone.nameservers;
    const zoneId = zone.id;

    return {
      success: true,
      status,
      nameservers,
      zoneId,
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

export async function addVercelDnsRecords(zoneId: string, domainName: string) {
  try {
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    if (!apiToken) {
      return { success: false, error: "Cloudflare API Token not configured." };
    }

    console.log(`Adding DNS records for ${domainName} in zone ${zoneId}`);

    // root domain A record
    const aRecordRes = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "A",
          name: "@",
          content: "76.76.21.21", // Vercel IP
          ttl: 1,
          proxied: false,
        }),
      }
    );

    const aRecordData = await aRecordRes.json();
    console.log("A Record Response:", aRecordData);

    // www CNAME record
    const cnameRes = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "CNAME",
          name: "www",
          content: "cname.vercel-dns.com",
          ttl: 1,
          proxied: false,
        }),
      }
    );

    const cnameData = await cnameRes.json();
    console.log("CNAME Record Response:", cnameData);

    return {
      success: true,
      aRecord: aRecordData,
      cnameRecord: cnameData,
    };
  } catch (error: any) {
    console.error("Failed to add DNS records:", error);
    return {
      success: false,
      error: error.message || "Failed to add DNS records",
    };
  }
}

export async function deleteDomainFromCloudflare(domainName: string) {
  try {
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    if (!apiToken) {
      return { success: false, error: "Cloudflare API Token not configured." };
    }

    // 1. Get the zone ID
    const zoneRes = await checkDomainVerificationStatus(domainName);
    if (!zoneRes.success || !zoneRes.zoneId) {
      // If zone not found, it's already deleted or not there
      return { success: true, message: "Zone not found in Cloudflare, skipping deletion." };
    }

    const zoneId = zoneRes.zoneId;
    console.log(`Deleting zone ${domainName} (ID: ${zoneId}) from Cloudflare`);

    // 2. Delete the zone
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("Cloudflare Delete Zone Error:", data.errors);
      return {
        success: false,
        error: data.errors?.[0]?.message || "Failed to delete zone from Cloudflare.",
      };
    }

    console.log(`Successfully deleted zone ${domainName} from Cloudflare.`);
    return { success: true };
  } catch (error: any) {
    console.error("Cloudflare Delete Exception:", error);
    return { success: false, error: error.message || "Failed to delete zone from Cloudflare." };
  }
}


