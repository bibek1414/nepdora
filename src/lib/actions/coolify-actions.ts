"use server";

/**
 * Adds the root domain to the Coolify application configuration.
 * Coolify automatically handles SSL and proxy setup for any FQDN added.
 */
export async function addDomainToCoolify(domainName: string) {
  console.log(`[Coolify] addDomainToCoolify called for: ${domainName}`);
  try {
    const apiToken = process.env.COOLIFY_API_TOKEN;
    const instanceUrl = process.env.COOLIFY_INSTANCE_URL; // e.g., https://coolify.example.com
    const appUuid = process.env.COOLIFY_APP_UUID;

    if (!apiToken || !instanceUrl || !appUuid) {
      console.warn("[Coolify] Configuration missing:", {
        hasToken: !!apiToken,
        hasUrl: !!instanceUrl,
        hasUuid: !!appUuid,
      });
      return { 
        success: true, 
        message: "Coolify not configured, skipping optional automated registration." 
      };
    }

    const baseUrl = instanceUrl.endsWith("/") ? instanceUrl.slice(0, -1) : instanceUrl;

    // 1. Get current application configuration to retrieve existing FQDNs
    console.log(`[Coolify] Fetching application configuration for ${appUuid}...`);
    const response = await fetch(`${baseUrl}/api/v1/applications/${appUuid}`, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[Coolify] Failed to fetch application: ${response.status} ${errText}`);
      return { success: false, error: `Failed to fetch Coolify application: ${response.status}` };
    }

    const appData = await response.json();
    const currentFqdns = appData.fqdn || "";
    console.log(`[Coolify] Current FQDNs for ${appUuid}:`, currentFqdns);
    
    // Coolify expects FQDNs with protocol (https://)
    const newDomains = [`https://${domainName}`];
    const existingList = currentFqdns.split(",").map((s: string) => s.trim()).filter(Boolean);
    
    const updatedList = [...existingList];
    let changed = false;

    newDomains.forEach(d => {
      if (!updatedList.includes(d)) {
        updatedList.push(d);
        changed = true;
      }
    });

    if (!changed) {
      console.log(`[Coolify] Domain ${domainName} already exists in configuration.`);
      return { success: true, message: "Domains already exist." };
    }

    const newFqdnString = updatedList.join(",");
    console.log(`[Coolify] New FQDN string:`, newFqdnString);

    // 2. Update application configuration with the appended list
    console.log(`[Coolify] Updating domains for ${appUuid} to include ${domainName}...`);
    
    // We attempt to send the list as-is first. 
    // If it contains a wildcard, we anticipate a possible validation error.
    const fqdnStringToSend = updatedList.join(",");

    let updateRes = await fetch(`${baseUrl}/api/v1/applications/${appUuid}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ domains: fqdnStringToSend }),
    });

    if (!updateRes.ok) {
      const errData = await updateRes.json();
      const errString = JSON.stringify(errData);
      
      // Check if the error is specifically about an Invalid URL and we have a wildcard
      if (errString.includes("Invalid URL") && updatedList.some(d => d.includes("*"))) {
        console.warn("[Coolify] Wildcard URL detected in failed update. Retrying with sanitized list (no wildcards) to allow custom domain registration to proceed...");
        
        const sanitizedList = updatedList.filter(d => !d.includes("*"));
        const sanitizedFqdnString = sanitizedList.join(",");

        const retryRes = await fetch(`${baseUrl}/api/v1/applications/${appUuid}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ domains: sanitizedFqdnString }),
        });

        if (retryRes.ok) {
          console.log(`[Coolify] Successfully added ${domainName} by bypassing wildcard validation.`);
          return { 
            success: true, 
            message: "Domain added. NOTE: Your existing wildcard (*.nepdora.com) was skipped to bypass a Coolify API conflict. Please verify your wildcard settings in the Coolify UI." 
          };
        } else {
          const retryErr = await retryRes.json();
          console.error(`[Coolify] Retry failed:`, retryErr);
          return { success: false, error: "Critical failure: Even sanitized domain list was rejected by Coolify." };
        }
      }

      console.error(`[Coolify] Update failed after initial attempt:`, errData);
      return { success: false, error: errData.message || "Failed to update Coolify FQDNs" };
    }

    console.log(`[Coolify] Successfully added ${domainName} to Coolify application.`);
    return { success: true };
  } catch (error: any) {
    console.error("[Coolify] Exception during API call:", error);
    return { success: false, error: error.message || "Unknown error occurred" };
  }
}

/**
 * Removes a domain from the Coolify application configuration.
 */
export async function removeDomainFromCoolify(domainName: string) {
  console.log(`[Coolify] removeDomainFromCoolify called for: ${domainName}`);
  try {
    const apiToken = process.env.COOLIFY_API_TOKEN;
    const instanceUrl = process.env.COOLIFY_INSTANCE_URL;
    const appUuid = process.env.COOLIFY_APP_UUID;

    if (!apiToken || !instanceUrl || !appUuid) {
      console.warn("[Coolify] Configuration missing for removal. Skipping.");
      return { success: true };
    }

    const baseUrl = instanceUrl.endsWith("/") ? instanceUrl.slice(0, -1) : instanceUrl;

    const response = await fetch(`${baseUrl}/api/v1/applications/${appUuid}`, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) return { success: true };

    const appData = await response.json();
    const currentFqdns = appData.fqdn || "";
    
    const targets = [`https://${domainName}`];
    const existingList = currentFqdns.split(",").map((s: string) => s.trim()).filter(Boolean);
    
    const updatedList = existingList.filter((d: string) => !targets.includes(d));

    if (existingList.length === updatedList.length) {
      return { success: true };
    }

    const newFqdnString = updatedList.join(",");

    await fetch(`${baseUrl}/api/v1/applications/${appUuid}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ domains: newFqdnString }),
    });

    console.log(`[Coolify] Successfully removed ${domainName} from Coolify.`);
    return { success: true };
  } catch (error: any) {
    console.error("[Coolify] Remove exception:", error);
    return { success: false, error: error.message };
  }
}
