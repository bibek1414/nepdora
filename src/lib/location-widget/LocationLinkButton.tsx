import React from "react";

export type BuildConfirmUrlOptions = {
  confirmPageUrl: string;
  orderId: string;
  callbackUrl?: string;
  redirectUrl?: string;
  extraParams?: Record<string, string | number | boolean | null | undefined>;
};

function buildConfirmUrl(options: BuildConfirmUrlOptions): string {
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

export type LocationLinkButtonProps = {
  orderId: string;
  confirmPageUrl: string;
  callbackUrl?: string;
  redirectUrl?: string;
  extraParams?: Record<string, string | number | boolean | null | undefined>;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  asLink?: boolean; // if true, render <a> tag; otherwise button
  target?: string; // e.g., _blank
  rel?: string; // e.g., noopener noreferrer
};

export const LocationLinkButton: React.FC<LocationLinkButtonProps> = ({
  orderId,
  confirmPageUrl,
  callbackUrl,
  redirectUrl,
  extraParams,
  label = "Confirm exact location",
  className,
  style,
  asLink = false,
  target = "_blank",
  rel = "noopener noreferrer",
}) => {
  const href = React.useMemo(
    () =>
      buildConfirmUrl({
        confirmPageUrl,
        orderId,
        callbackUrl,
        redirectUrl,
        extraParams,
      }),
    [confirmPageUrl, orderId, callbackUrl, redirectUrl, extraParams]
  );

  if (asLink) {
    return (
      <a
        href={href}
        className={className}
        style={style}
        target={target}
        rel={rel}
      >
        {label}
      </a>
    );
  }

  const onClick = () => {
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <button type="button" onClick={onClick} className={className} style={style}>
      {label}
    </button>
  );
};
