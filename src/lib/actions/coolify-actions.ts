"use server";

/**
 * Helper to extract FQDN string from application data based on build pack.
 * Handles the special case where docker_compose_domains is a JSON string.
 */
function getFqdnsFromAppData(appData: any): string {
  if (appData.build_pack === "dockercompose" && appData.docker_compose_domains) {
    let domainsObj = appData.docker_compose_domains;
    
    // Handle JSON string format often returned by Coolify API for Compose apps
    if (typeof domainsObj === "string") {
      try {
        domainsObj = JSON.parse(domainsObj);
      } catch (e) {
        console.error("[Coolify] Failed to parse docker_compose_domains string:", e);
        return "";
      }
    }

    // Docker Compose domains are typically mapped by service name
    // We look for 'app' as the primary service
    if (domainsObj && domainsObj.app) {
      return domainsObj.app.domain || "";
    }
    
    // Fallback: If it's an array (standard for some versions)
    if (Array.isArray(domainsObj)) {
      const appService = domainsObj.find((s: any) => (s.name === "app" || s.serviceName === "app"));
      return appService ? appService.domain : "";
    }
  }
  return appData.fqdn || "";
}

/**
 * Helper to construct the PATCH payload based on build pack.
 */
function createPatchPayload(appData: any, newFqdnString: string): any {
  if (appData.build_pack === "dockercompose") {
    let domainsObj = appData.docker_compose_domains;
    if (typeof domainsObj === "string") {
      try {
        domainsObj = JSON.parse(domainsObj);
      } catch (e) {
        domainsObj = {};
      }
    }

    // Preserve existing service mappings but update 'app'
    const updatedDomains: any = {};
    
    // Copy existing services and ensure they have 'name'
    if (typeof domainsObj === 'object' && !Array.isArray(domainsObj)) {
      Object.keys(domainsObj).forEach(key => {
        updatedDomains[key] = {
          ...domainsObj[key],
          name: domainsObj[key].name || key // Ensure name exists
        };
      });
    }

    // Explicitly update/add 'app' service
    updatedDomains.app = {
      ...(updatedDomains.app || {}),
      name: "app",
      domain: newFqdnString
    };

    return {
      docker_compose_domains: updatedDomains
    };
  }
  return { domains: newFqdnString };
}

/**
 * Adds the root domain to the Coolify application configuration.
 * Handles both Standard and Docker Compose applications.
 */
export async function addDomainToCoolify(domainName: string) {
  console.log(`[Coolify] addDomainToCoolify called for: ${domainName}`);
  try {
    const apiToken = process.env.COOLIFY_API_TOKEN;
    const instanceUrl = process.env.COOLIFY_INSTANCE_URL;
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

    // 1. Get current application configuration
    console.log(`[Coolify] Fetching application configuration for ${appUuid}...`);
    const response = await fetch(`${baseUrl}/api/v1/applications/${appUuid}`, {
      headers: { Authorization: `Bearer ${apiToken}` },
      cache: "no-store",
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[Coolify] Failed to fetch application: ${response.status} ${errText}`);
      return { success: false, error: `Failed to fetch Coolify application: ${response.status}` };
    }

    const appData = await response.json();
    const currentFqdns = getFqdnsFromAppData(appData);
    
    console.log(`[Coolify] App Type: ${appData.build_pack}, Current Domains:`, currentFqdns);
    
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

    // 2. Update application configuration
    const fqdnStringToSend = updatedList.join(",");
    console.log(`[Coolify] Updating domains for ${appUuid} to:`, fqdnStringToSend);

    const payload = createPatchPayload(appData, fqdnStringToSend);

    let updateRes = await fetch(`${baseUrl}/api/v1/applications/${appUuid}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!updateRes.ok) {
      const errData = await updateRes.json();
      const errString = JSON.stringify(errData);
      
      // Handle Wildcard conflict fallback
      if (errString.includes("Invalid URL") && updatedList.some(d => d.includes("*"))) {
        console.warn("[Coolify] Wildcard URL detected in failed update. Retry with sanitized list...");
        
        const sanitizedList = updatedList.filter(d => !d.includes("*"));
        const sanitizedFqdnString = sanitizedList.join(",");
        const retryPayload = createPatchPayload(appData, sanitizedFqdnString);

        const retryRes = await fetch(`${baseUrl}/api/v1/applications/${appUuid}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(retryPayload),
        });

        if (retryRes.ok) {
          return { 
            success: true, 
            message: "Domain added. NOTE: Your existing wildcard (*.nepdora.com) was skipped to bypass a Coolify API conflict." 
          };
        }
      }

      console.error(`[Coolify] Update failed:`, errData);
      return { success: false, error: errData.message || "Failed to update Coolify configuration" };
    }

    console.log(`[Coolify] Successfully updated ${domainName} on Coolify.`);
    return { success: true };
  } catch (error: any) {
    console.error("[Coolify] Exception:", error);
    return { success: false, error: error.message };
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

    if (!apiToken || !instanceUrl || !appUuid) return { success: true };

    const baseUrl = instanceUrl.endsWith("/") ? instanceUrl.slice(0, -1) : instanceUrl;

    const response = await fetch(`${baseUrl}/api/v1/applications/${appUuid}`, {
      headers: { Authorization: `Bearer ${apiToken}` },
      cache: "no-store",
    });

    if (!response.ok) return { success: true };

    const appData = await response.json();
    const currentFqdns = getFqdnsFromAppData(appData);
    
    const targets = [`https://${domainName}`];
    const existingList = currentFqdns.split(",").map((s: string) => s.trim()).filter(Boolean);
    const updatedList = existingList.filter((d: string) => !targets.includes(d));

    if (existingList.length === updatedList.length) return { success: true };

    const newFqdnString = updatedList.join(",");
    const payload = createPatchPayload(appData, newFqdnString);

    await fetch(`${baseUrl}/api/v1/applications/${appUuid}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return { success: true };
  } catch (error: any) {
    console.error("[Coolify] Remove exception:", error);
    return { success: false, error: error.message };
  }
}
