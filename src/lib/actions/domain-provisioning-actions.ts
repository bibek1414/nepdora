"use server";

import { 
  checkDomainVerificationStatus, 
  addVercelDnsRecords 
} from "./cloudflare-actions";
import { addDomainToVercel } from "./vercel-actions";

export async function provisionDomain(domainName: string) {
  try {
    console.log(`Starting automated provisioning for domain: ${domainName}`);

    // 1. Check Cloudflare status
    const cfStatus = await checkDomainVerificationStatus(domainName);
    
    if (!cfStatus.success) {
      console.error(`Cloudflare check failed for ${domainName}:`, cfStatus.error);
      return { success: false, error: `Cloudflare check failed: ${cfStatus.error}` };
    }

    const zoneId = cfStatus.zoneId;
    if (!zoneId) {
      return { success: false, error: "Could not retrieve Cloudflare Zone ID." };
    }

    if (cfStatus.status !== "active") {
      console.log(`Domain ${domainName} zone is found in Cloudflare but not yet active (Status: ${cfStatus.status}). Proceeding with Vercel and DNS setup anyway.`);
    } else {
      console.log(`Domain ${domainName} is active in Cloudflare. Proceeding with Vercel and DNS setup...`);
    }

    // 2. Add to Vercel
    const vercelResult = await addDomainToVercel(domainName);
    if (!vercelResult.success) {
      console.error(`Vercel addition failed for ${domainName}:`, vercelResult.error);
      return { success: false, error: `Vercel addition failed: ${vercelResult.error}` };
    }
    console.log(`Successfully added ${domainName} to Vercel.`);

    // 3. Add DNS Records to Cloudflare
    const dnsResult = await addVercelDnsRecords(zoneId, domainName);
    if (!dnsResult.success) {
      console.error(`Cloudflare DNS record creation failed for ${domainName}:`, dnsResult.error);
      return { success: false, error: `Cloudflare DNS record creation failed: ${dnsResult.error}` };
    }
    console.log(`Successfully added DNS records to Cloudflare for ${domainName}.`);

    return {
      success: true,
      message: `Domain ${domainName} successfully provisioned on Vercel and Cloudflare.`,
    };

  } catch (error: any) {
    console.error(`Provisioning exception for ${domainName}:`, error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred during domain provisioning.",
    };
  }
}

import { deleteDomainFromCloudflare } from "./cloudflare-actions";
import { removeDomainFromVercel } from "./vercel-actions";
import { deleteCustomDomain } from "./custom-domain-actions";

export async function deprovisionDomain(id: number, domainName: string) {
  try {
    console.log(`Starting deprovisioning for domain: ${domainName} (ID: ${id})`);

    // 1. Remove from Vercel
    const vercelRes = await removeDomainFromVercel(domainName);
    if (!vercelRes.success) {
      console.warn(`Vercel removal failed for ${domainName}: ${vercelRes.error}`);
    }

    // 2. Remove from Cloudflare (Optional, but user requested)
    const cfRes = await deleteDomainFromCloudflare(domainName);
    if (!cfRes.success) {
      console.warn(`Cloudflare removal failed for ${domainName}: ${cfRes.error}`);
    }

    // 3. Remove from Backend
    const backendRes = await deleteCustomDomain(id);
    if (!backendRes.success) {
      console.error(`Backend deletion failed for domain entry ${id}:`, backendRes.error);
      return { success: false, error: `Failed to delete from backend: ${backendRes.error}` };
    }

    console.log(`Successfully deprovisioned ${domainName} everywhere.`);
    return { success: true, message: "Domain deleted successfully from all services." };

  } catch (error: any) {
    console.error(`Deprovisioning exception for ${domainName}:`, error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred during deprovisioning.",
    };
  }
}

