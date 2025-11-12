"use client";
import React, { useEffect, useState } from "react";

export type BuildConfirmUrlOptions = {
  confirmPageUrl: string;
  orderId: string;
  callbackUrl?: string;
  redirectUrl?: string;
  extraParams?: Record<string, string | number | boolean | null | undefined>;
};

// Updated buildConfirmUrl function
async function buildConfirmUrl(
  options: BuildConfirmUrlOptions
): Promise<string> {
  const { confirmPageUrl, orderId, callbackUrl, redirectUrl, extraParams } =
    options;

  // Store parameters and get short ID
  const response = await fetch("/location/url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, callbackUrl, redirectUrl, extraParams }),
  });

  const { shortId } = await response.json();

  const url = new URL(confirmPageUrl);
  url.searchParams.set("shortId", shortId);
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
  const [href, setHref] = useState("#");

  useEffect(() => {
    const generateUrl = async () => {
      const url = await buildConfirmUrl({
        confirmPageUrl,
        orderId,
        callbackUrl,
        redirectUrl,
        extraParams,
      });
      setHref(url);
    };

    generateUrl();
  }, [confirmPageUrl, orderId, callbackUrl, redirectUrl, extraParams]);

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
