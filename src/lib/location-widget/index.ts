export type ConfirmPayload = {
  orderId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
};

export type BuildConfirmUrlOptions = {
  confirmPageUrl: string;
  orderId: string;
  callbackUrl?: string;
  redirectUrl?: string;
  extraParams?: Record<string, string | number | boolean | null | undefined>;
};

export function buildConfirmUrl(options: BuildConfirmUrlOptions): string {
  const { confirmPageUrl, orderId, callbackUrl, redirectUrl, extraParams } =
    options;
  const url = new URL(confirmPageUrl);
  url.searchParams.set("orderId", orderId);
  if (callbackUrl) url.searchParams.set("callback", callbackUrl);
  if (redirectUrl) url.searchParams.set("redirect", redirectUrl);
  if (extraParams) {
    for (const [key, value] of Object.entries(extraParams)) {
      if (value === undefined || value === null) continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

export { LocationLinkButton } from "./LocationLinkButton";
export type { LocationLinkButtonProps } from "./LocationLinkButton";
