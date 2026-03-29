"use server";

export async function addDomainToVercel(domainName: string) {
  try {
    const vercelToken = process.env.VERCEL_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID;
    const teamId = process.env.VERCEL_TEAM_ID;

    if (!vercelToken || !projectId) {
      console.error("Vercel Configuration Missing:", {
        hasToken: !!vercelToken,
        hasProjectId: !!projectId,
      });
      return {
        success: false,
        error: "Vercel API Token or Project ID is not configured.",
      };
    }

    const teamParam = teamId ? `?teamId=${teamId}` : "";
    console.log(
      `Adding domain ${domainName} to Vercel project ${projectId}${teamId ? ` (Team: ${teamId})` : ""}`
    );

    const response = await fetch(
      `https://api.vercel.com/v10/projects/${projectId}/domains${teamParam}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${vercelToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: domainName,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "Vercel Add Domain Error Details:",
        JSON.stringify(data, null, 2)
      );

      // If domain already exists, we might still want to proceed with DNS setup
      if (
        data.error?.code === "domain_already_in_use" ||
        data.error?.code === "domain_taken"
      ) {
        return {
          success: true,
          message: "Domain already added to Vercel.",
          data,
        };
      }
      return {
        success: false,
        error: data.error?.message || "Failed to add domain to Vercel.",
      };
    }

    console.log("Vercel Add Domain Success:", data);
    return { success: true, data };
  } catch (error: any) {
    console.error("Vercel API Exception:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred adding to Vercel.",
    };
  }
}

export async function removeDomainFromVercel(domainName: string) {
  try {
    const vercelToken = process.env.VERCEL_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID;
    const teamId = process.env.VERCEL_TEAM_ID;

    if (!vercelToken || !projectId) {
      return {
        success: false,
        error: "Vercel API Token or Project ID is not configured.",
      };
    }

    const teamParam = teamId ? `?teamId=${teamId}` : "";
    console.log(
      `Removing domain ${domainName} from Vercel project ${projectId}${teamId ? ` (Team: ${teamId})` : ""}`
    );

    const response = await fetch(
      `https://api.vercel.com/v10/projects/${projectId}/domains/${domainName}${teamParam}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${vercelToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // If domain not found, it's already gone
      if (response.status === 404) {
        return {
          success: true,
          message: "Domain not found in Vercel, skipping.",
        };
      }
      console.error("Vercel Remove Domain Error:", data.error);
      return {
        success: false,
        error: data.error?.message || "Failed to remove domain from Vercel.",
      };
    }

    console.log(`Successfully removed ${domainName} from Vercel.`);
    return { success: true };
  } catch (error: any) {
    console.error("Vercel Remove Exception:", error);
    return {
      success: false,
      error:
        error.message || "An unexpected error occurred removing from Vercel.",
    };
  }
}
