"use server";

import {
  checkDomainVerificationStatus,
  addCoolifyDnsRecords,
} from "./cloudflare-actions";
import {
  addDomainToCoolify,
  removeDomainFromCoolify,
} from "./coolify-actions";

export async function provisionDomain(domainName: string, schemaName: string) {
  try {
    console.log(`Starting automated provisioning for domain: ${domainName}`);

    // 1. Check Cloudflare status
    console.log(`[Provisioning] Step 1: Checking Cloudflare verification status for ${domainName}...`);
    const cfStatus = await checkDomainVerificationStatus(domainName);

    if (!cfStatus.success) {
      console.error(
        `Cloudflare check failed for ${domainName}:`,
        cfStatus.error
      );
      return {
        success: false,
        error: `Cloudflare check failed: ${cfStatus.error}`,
      };
    }

    const zoneId = cfStatus.zoneId;
    if (!zoneId) {
      return {
        success: false,
        error: "Could not retrieve Cloudflare Zone ID.",
      };
    }

    if (cfStatus.status !== "active") {
      console.log(
        `Domain ${domainName} zone is found in Cloudflare but not yet active (Status: ${cfStatus.status}). Proceeding with Coolify and DNS setup anyway.`
      );
    } else {
      console.log(
        `Domain ${domainName} is active in Cloudflare. Proceeding with Coolify and DNS setup...`
      );
    }
    
    // 2. Add to Coolify
    console.log(`[Provisioning] Step 2: Registering ${domainName} with Coolify...`);
    const coolifyResult = await addDomainToCoolify(domainName);
    if (!coolifyResult.success) {
      console.error(
        `Coolify registration failed for ${domainName}:`,
        coolifyResult.error
      );
      return {
        success: false,
        error: `Coolify registration failed: ${coolifyResult.error}`,
      };
    }
    console.log(`Successfully added ${domainName} to Coolify.`);
    
    // 3. Add DNS Records to Cloudflare
    console.log(`[Provisioning] Step 3: Provisioning DNS A record in Cloudflare for ${domainName}...`);
    const dnsResult = await addCoolifyDnsRecords(zoneId, domainName, schemaName);
    if (!dnsResult.success) {
      console.error(
        `Cloudflare DNS record creation failed for ${domainName}:`,
        dnsResult.error
      );
      return {
        success: false,
        error: `Cloudflare DNS record creation failed: ${dnsResult.error}`,
      };
    }
    console.log(
      `Successfully added DNS records to Cloudflare for ${domainName}.`
    );

    return {
      success: true,
      message: coolifyResult.message || `Domain ${domainName} successfully provisioned on Coolify and Cloudflare.`,
    };
  } catch (error: any) {
    console.error(`Provisioning exception for ${domainName}:`, error);
    return {
      success: false,
      error:
        error.message ||
        "An unexpected error occurred during domain provisioning.",
    };
  }
}

import { deleteDomainFromCloudflare } from "./cloudflare-actions";
import { deleteCustomDomain } from "./custom-domain-actions";

export async function deprovisionDomain(id: number, domainName: string) {
  try {
    console.log(
      `Starting deprovisioning for domain: ${domainName} (ID: ${id})`
    );

    // 1. Remove from Coolify
    console.log(`[Deprovisioning] Step 1: Removing ${domainName} from Coolify config...`);
    const coolifyRes = await removeDomainFromCoolify(domainName);
    if (!coolifyRes.success) {
      console.warn(
        `Coolify removal failed for ${domainName}: ${coolifyRes.error}`
      );
    }

    // 2. Remove from Cloudflare
    console.log(`[Deprovisioning] Step 2: Deleting Cloudflare zone for ${domainName}...`);
    const cfRes = await deleteDomainFromCloudflare(domainName);
    if (!cfRes.success) {
      console.warn(
        `Cloudflare removal failed for ${domainName}: ${cfRes.error}`
      );
    }

    // 3. Remove from Backend
    console.log(`[Deprovisioning] Step 3: Deleting custom domain entry ${id} from database...`);
    const backendRes = await deleteCustomDomain(id);
    if (!backendRes.success) {
      console.error(
        `Backend deletion failed for domain entry ${id}:`,
        backendRes.error
      );
      return {
        success: false,
        error: `Failed to delete from backend: ${backendRes.error}`,
      };
    }

    console.log(`Successfully deprovisioned ${domainName} everywhere.`);
    return {
      success: true,
      message: "Domain deleted successfully from all services.",
    };
  } catch (error: any) {
    console.error(`Deprovisioning exception for ${domainName}:`, error);
    return {
      success: false,
      error:
        error.message || "An unexpected error occurred during deprovisioning.",
    };
  }
}
