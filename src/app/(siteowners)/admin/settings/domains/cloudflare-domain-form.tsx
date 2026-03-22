"use client";

import { useState, useEffect } from "react";
import {
  addDomainToCloudflare,
  checkDomainVerificationStatus,
  checkDnsAndAddToCloudflare,
} from "@/lib/actions/cloudflare-actions";
import {
  saveCustomDomain,
  updateCustomDomain,
  deleteCustomDomain,
  CustomDomain,
} from "@/lib/actions/custom-domain-actions";
import { Edit2 } from "lucide-react";

// Replace these with your actual Cloudflare nameservers for your account
const CLOUDFLARE_NAMESERVERS = ["ns1.cloudflare.com", "ns2.cloudflare.com"];

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
            setNameservers(CLOUDFLARE_NAMESERVERS);
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
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((result as any).error || "Failed to verify DNS.");
    }
    setIsVerifying(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this custom domain?")) return;
    setIsDeleting(true);
    const result = await deleteCustomDomain(domainItem.id);
    if (result.success) {
      onDelete(domainItem.id);
    } else {
      setError(result.error || "Failed to delete domain.");
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
    <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:justify-between xl:flex-row xl:items-center">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editDomainVal}
                onChange={e => setEditDomainVal(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                disabled={isSaving}
              />
              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="text-sm cursor-pointer font-medium text-green-600 hover:text-green-700 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditDomainVal(domainItem.domain);
                }}
                disabled={isSaving}
                className="text-sm cursor-pointer text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <span className="font-semibold text-gray-800">
                {domainItem.domain}
              </span>
              <div
                onClick={() => setIsEditing(true)}
                className="flex cursor-pointer items-center gap-1 border-l pl-3"
              >
                <Edit2 className="text-primary h-3 w-3" />
                <span className="text-primary hover:text-primary/80 text-xs font-medium">
                  Edit
                </span>
              </div>
            </>
          )}
        </div>

        <div>
          {status === "loading" && (
            <span className="text-sm text-gray-500">
              Checking Cloudflare...
            </span>
          )}
          {status === "active" && (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              ✅ Verified Active
            </span>
          )}
          {(status === "pending" || status === "initializing") && (
            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
              ⏳ Pending Cloudflare Verification
            </span>
          )}
          {status === "dns_pending" && (
            <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
              ⚠️ Waiting for DNS Configuration
            </span>
          )}
          {status === "error" && (
            <span className="text-sm text-red-500">Error: {error}</span>
          )}
          {status === "unknown" && (
            <span className="text-sm text-gray-500">Status unknown</span>
          )}
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

    const saveResult = await saveCustomDomain(domain);

    if (saveResult.success && saveResult.domain) {
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
              className="inline-flex justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
            >
              {isLoading ? "Saving Domain..." : "Save Domain"}
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
