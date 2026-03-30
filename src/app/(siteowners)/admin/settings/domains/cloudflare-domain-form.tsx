
"use client";

import { useState, useEffect } from "react";
import {
  addDomainToCloudflare,
  checkDomainVerificationStatus,
  checkDnsAndAddToCloudflare,
  addVercelDnsRecords,
  verifyDomainDNS,
} from "@/lib/actions/cloudflare-actions";
import {
  saveCustomDomain,
  updateCustomDomain,
  deleteCustomDomain,
  CustomDomain,
} from "@/lib/actions/custom-domain-actions";
import { addDomainToVercel } from "@/lib/actions/vercel-actions";
import {
  provisionDomain,
  deprovisionDomain,
} from "@/lib/actions/domain-provisioning-actions";
import { Edit2, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function DomainStatusItem({
  domainItem,
  onDelete,
  onUpdate,
}: {
  domainItem: CustomDomain;
  onDelete: (id: number) => void;
  onUpdate: (domain: CustomDomain) => void;
}) {
  const [status, setStatus] = useState<string>("loading"); // 'active', 'pending', 'dns_pending', 'error'
  const [nameservers, setNameservers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editDomainVal, setEditDomainVal] = useState(domainItem.domain);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function checkStatus() {
      const result = await checkDomainVerificationStatus(domainItem.domain);
      if (isMounted) {
        if (result.success) {
          setStatus(result.status || "unknown");
          setNameservers(result.nameservers || []);
        } else {
          // If the zone is not found, it means it hasn't been added to CF yet.
          if (result.error?.includes("Zone not found")) {
            setStatus("dns_pending");
            setNameservers(
              result.nameservers || [
                "cleo.ns.cloudflare.com",
                "vivienne.ns.cloudflare.com",
              ]
            );
            console.log("Nameservers:", result.nameservers);
          } else {
            setStatus("error");
            setError(result.error || "Failed to verify status");
          }
        }
      }
    }
    checkStatus();
    return () => {
      isMounted = false;
    };
  }, [domainItem.domain]);

  const handleVerifyDns = async () => {
    setIsVerifying(true);
    setError(null);
    const result = await checkDnsAndAddToCloudflare(domainItem.domain);

    if (result.success) {
      setStatus("active");
      // PROACTIVE: Trigger provisioning automatically once DNS is verified
      setIsProvisioning(true);
      const provisionResult = await provisionDomain(domainItem.domain);
      if (!provisionResult.success) {
        setError(
          `DNS Verified, but automatic setup failed: ${provisionResult.error}. You may need to manually add it to Vercel.`
        );
      }
      setIsProvisioning(false);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((result as any).error || "Failed to verify DNS.");
    }
    setIsVerifying(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const result = await deprovisionDomain(domainItem.id, domainItem.domain);
      if (result.success) {
        onDelete(domainItem.id);
      } else {
        setError(result.error || "Failed to fully delete domain.");
        setIsDeleting(false);
      }
    } catch (err: any) {
      setError("An unexpected error occurred during deletion.");
      setIsDeleting(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editDomainVal || editDomainVal === domainItem.domain) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setError(null);
    const result = await updateCustomDomain(domainItem.id, editDomainVal);

    if (result.success && result.domain) {
      onUpdate(result.domain);
      setIsEditing(false);
      setStatus("loading"); // It will re-trigger the useEffect if domainItem.domain changes
    } else {
      setError(result.error || "Failed to update domain.");
    }
    setIsSaving(false);
  };

  return (
    <div className="mb-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col gap-4 sm:justify-between xl:flex-row xl:items-center">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-gray-900">
              {domainItem.domain}
            </span>

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="flex cursor-pointer items-center gap-1.5 rounded-md border border-gray-100 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100"
                >
                  <Edit2 className="h-3 w-3" />
                  Edit
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Domain Name</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    label="Domain Name"
                    value={editDomainVal}
                    onChange={e => setEditDomainVal(e.target.value)}
                    disabled={isSaving}
                    placeholder="example.com"
                  />
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setEditDomainVal(domainItem.domain);
                    }}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    disabled={
                      isSaving ||
                      !editDomainVal ||
                      editDomainVal === domainItem.domain
                    }
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center">
            {status === "loading" && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Checking status...
              </div>
            )}
            {status === "active" && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-600/20 ring-inset">
                  {isProvisioning ? (
                    <>
                      <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                      Provisioning...
                    </>
                  ) : (
                    "✅ Verified Active"
                  )}
                </span>
              </div>
            )}
            {(status === "pending" || status === "initializing") && (
              <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-700 ring-1 ring-yellow-600/20 ring-inset">
                ⏳ Pending Verification
              </span>
            )}
            {status === "dns_pending" && (
              <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-600/20 ring-inset">
                ⚠️ DNS Setup Required
              </span>
            )}
            {status === "error" && (
              <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-600/20 ring-inset">
                ❌ Error: {error}
              </span>
            )}
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="h-8 gap-1.5"
                disabled={isDeleting || isSaving || isProvisioning}
              >
                {isDeleting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone: Delete Domain?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-600">
                  Are you sure you want to remove{" "}
                  <strong>{domainItem.domain}</strong>?
                  <br />
                  <br />
                  This will disconnect the domain from your website and it will
                  stop working.
                  <br />
                  <br />
                  You can add it again anytime if needed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Domain</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Yes, Delete Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Display Error Message Form */}
      {error && !isEditing && (
        <div className="mt-2 text-sm font-medium text-red-600">{error}</div>
      )}

      {/* Instruction block for domains not yet added to Cloudflare OR pending in Cloudflare */}
      {(status === "pending" ||
        status === "initializing" ||
        status === "dns_pending") &&
        nameservers.length > 0 && (
          <div className="mt-4 rounded border border-blue-100 bg-blue-50 p-4">
            <h4 className="mb-2 font-semibold text-blue-900">
              Action Required: Update your Nameservers
            </h4>
            <p className="mb-3 text-sm text-blue-800">
              Please go to your domain registrar (e.g., GoDaddy, Namecheap) and
              replace your current nameservers with these:
            </p>
            <ul className="mb-4 list-inside list-disc font-mono text-sm text-blue-900">
              {nameservers.map((ns, idx) => (
                <li
                  key={idx}
                  className="my-1 mr-2 inline-block rounded bg-white px-2 py-1 shadow-sm"
                >
                  {ns}
                </li>
              ))}
            </ul>

            {status === "dns_pending" ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={handleVerifyDns}
                  disabled={isVerifying}
                  className="inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                >
                  {isVerifying
                    ? "Verifying DNS..."
                    : "Verify DNS & Activate Domain"}
                </button>
                <p className="text-xs text-blue-700">
                  After updating nameservers, it may take 1-24 hours to
                  propagate. Click to verify once propagated.
                </p>
              </div>
            ) : (
              <p className="text-xs text-blue-700">
                Cloudflare is already monitoring this zone. It will
                automatically activate when propagation completes.
              </p>
            )}
          </div>
        )}
    </div>
  );
}

export default function CloudflareDomainForm({
  existingDomains,
}: {
  existingDomains: CustomDomain[];
}) {
  const [domain, setDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newDomainAdded, setNewDomainAdded] = useState(false);
  const [localDomains, setLocalDomains] =
    useState<CustomDomain[]>(existingDomains);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;

    setIsLoading(true);
    setError(null);
    setNewDomainAdded(false);

    // 1. Verify Domain via DNS-Query Package first
    const verifyResult = await verifyDomainDNS(domain);
    if (!verifyResult.success) {
      setError(verifyResult.error || "Domain could not be verified. Ensure it is registered and has active DNS records.");
      setIsLoading(false);
      return;
    }

    // 2. Only proceed if DNS is verified
    console.log(`Domain ${domain} verified successfully. Proceeding with Cloudflare and Vercel setup.`);

    const saveResult = await saveCustomDomain(domain);
    if (saveResult.success && saveResult.domain) {
      // PROACTIVE: Add to Cloudflare immediately so we get real nameservers
      const cfRes = await addDomainToCloudflare(domain);

      // PROACTIVE: Add DNS records immediately if we have a zoneId
      if (cfRes.success && cfRes.zoneId) {
        console.log(`Proactively adding DNS records for ${domain}...`);
        await addVercelDnsRecords(cfRes.zoneId, domain);
      }

      // PROACTIVE: Add to Vercel immediately so it's visible in Vercel console right away
      const vercelRes = await addDomainToVercel(domain);
      if (!vercelRes.success) {
        console.error("Proactive Vercel addition failed:", vercelRes.error);
      }

      setNewDomainAdded(true);
      setLocalDomains([...localDomains, saveResult.domain]);
      setDomain("");
    } else {
      setError(`Failed to save domain: ${saveResult.error}`);
    }

    setIsLoading(false);
  };

  const handleDomainDelete = (id: number) => {
    setLocalDomains(localDomains.filter(d => d.id !== id));
  };

  const handleDomainUpdate = (updatedDomain: CustomDomain) => {
    setLocalDomains(
      localDomains.map(d => (d.id === updatedDomain.id ? updatedDomain : d))
    );
  };

  return (
    <div className="mt-8 space-y-8">
      {/* Existing Domains Section */}
      {localDomains.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Saved Domains</h3>
          {localDomains.map(d => (
            <DomainStatusItem
              key={d.id}
              domainItem={d}
              onDelete={handleDomainDelete}
              onUpdate={handleDomainUpdate}
            />
          ))}
        </div>
      )}

      {/* Add New Domain Section */}
      {localDomains.length < 1 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">
            Register New Domain
          </h3>
          <p className="mb-4 text-sm text-gray-600">
            Enter your custom domain (e.g., example.com) to save it to your
            account. You will then need to update the nameservers to verify it.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex max-w-md flex-col space-y-4"
          >
            <div>
              <label
                htmlFor="domain"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Domain Name
              </label>
              <input
                type="text"
                id="domain"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                placeholder="example.com"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !domain}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Domain...
                </>
              ) : (
                "Save Domain"
              )}
            </button>
          </form>

          {newDomainAdded && (
            <div className="mt-4 rounded-md bg-green-50 p-4">
              <h3 className="text-sm font-medium text-green-800">
                Domain Successfully Saved! Follow the instructions in the Saved
                Domains list above to complete verification.
              </h3>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-1 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800">
            Domain Limit Reached
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            You can only register one custom domain per site. To add a different
            domain, please edit or delete your existing custom domain above.
          </p>
        </div>
      )}
    </div>
  );
}
