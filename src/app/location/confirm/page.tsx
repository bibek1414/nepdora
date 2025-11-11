"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";
import { useSearchParams } from "next/navigation";

type Position = {
  lat: number;
  lng: number;
  accuracy?: number | null;
  timestamp?: number | null;
};

function ConfirmLocationClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const callbackUrl = searchParams.get("callback");
  const redirectUrl = searchParams.get("redirect");

  const mapRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leafletMap = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leafletMarker = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const accuracyCircle = useRef<any>(null);

  const [loadedLeaflet, setLoadedLeaflet] = useState(false);
  const [current, setCurrent] = useState<Position | null>(null);
  const [status, setStatus] = useState<{
    message: string;
    type?: "success" | "error" | "";
  }>({ message: "" });
  const [confirming, setConfirming] = useState(false);

  const disabled = useMemo(
    () => !current || !orderId || !loadedLeaflet,
    [current, orderId, loadedLeaflet]
  );

  useEffect(() => {
    if (!orderId) {
      setStatus({ message: "Error: No order ID provided", type: "error" });
      return;
    }
    if (!("geolocation" in navigator)) {
      setStatus({
        message: "Geolocation is not supported by your browser",
        type: "error",
      });
      return;
    }
    setStatus({ message: "Getting your location..." });
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude, accuracy } = pos.coords;
        setCurrent({
          lat: latitude,
          lng: longitude,
          accuracy: accuracy ?? null,
          timestamp: pos.timestamp ?? null,
        });
        setStatus({
          message: "Location acquired. Adjust marker if needed.",
          type: "success",
        });
      },
      err => {
        let message = "Unable to get your location.";
        if (err.code === err.PERMISSION_DENIED)
          message =
            "Location permission denied. Please allow location access and refresh.";
        else if (err.code === err.POSITION_UNAVAILABLE)
          message = "Location information unavailable.";
        else if (err.code === err.TIMEOUT)
          message = "Location request timed out.";
        setStatus({ message, type: "error" });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [orderId]);

  useEffect(() => {
    if (!loadedLeaflet || !current || !mapRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const L: any = (window as any).L;
    if (!L) return;

    // Initialize map only once
    if (!leafletMap.current) {
      // Create map with better options
      leafletMap.current = L.map(mapRef.current, {
        center: [current.lat, current.lng],
        zoom: 17,
        scrollWheelZoom: true,
        zoomControl: true,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        boxZoom: false,
        keyboard: true,
        tap: true,
      });

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        minZoom: 3,
      }).addTo(leafletMap.current);

      // Prevent scroll propagation to parent
      if (mapRef.current) {
        L.DomEvent.disableScrollPropagation(mapRef.current);
        L.DomEvent.disableClickPropagation(mapRef.current);
      }

      // Set default marker icons from CDN to avoid 404s
      try {
        const defaultIcon = L.icon({
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          tooltipAnchor: [16, -28],
          shadowSize: [41, 41],
        });
        L.Marker.prototype.options.icon = defaultIcon;
      } catch {}

      // Add draggable marker
      leafletMarker.current = L.marker([current.lat, current.lng], {
        draggable: true,
        autoPan: true,
      }).addTo(leafletMap.current);

      // Update position on drag
      leafletMarker.current.on("dragend", function () {
        const pos = leafletMarker.current.getLatLng();
        setCurrent(prev =>
          prev ? { ...prev, lat: pos.lat, lng: pos.lng } : prev
        );
      });

      // Add accuracy circle
      if (current.accuracy) {
        accuracyCircle.current = L.circle([current.lat, current.lng], {
          radius: current.accuracy,
          color: "#3b82f6",
          fillColor: "#3b82f6",
          fillOpacity: 0.1,
          weight: 2,
        }).addTo(leafletMap.current);
      }

      // Force map to recalculate size after initialization
      setTimeout(() => {
        if (leafletMap.current) {
          leafletMap.current.invalidateSize();
          leafletMap.current.setView([current.lat, current.lng], 17);
        }
      }, 100);

      // Handle window resize
      const handleResize = () => {
        if (leafletMap.current) {
          leafletMap.current.invalidateSize();
        }
      };
      window.addEventListener("resize", handleResize);

      // Cleanup on unmount
      return () => {
        window.removeEventListener("resize", handleResize);
        if (leafletMap.current) {
          leafletMap.current.remove();
          leafletMap.current = null;
          leafletMarker.current = null;
          accuracyCircle.current = null;
        }
      };
    } else {
      // Update existing map
      leafletMap.current.setView(
        [current.lat, current.lng],
        leafletMap.current.getZoom()
      );
      if (leafletMarker.current) {
        leafletMarker.current.setLatLng([current.lat, current.lng]);
      }
      if (accuracyCircle.current) {
        accuracyCircle.current.setLatLng([current.lat, current.lng]);
      }
    }
  }, [loadedLeaflet, current]);

  async function onConfirm() {
    if (!current || !orderId) return;
    setConfirming(true);
    setStatus({ message: "Confirming location..." });
    const payload = {
      orderId,
      latitude: current.lat,
      longitude: current.lng,
      accuracy: current.accuracy ?? undefined,
      timestamp: current.timestamp ?? undefined,
    };
    try {
      if (callbackUrl) {
        const res = await fetch(callbackUrl, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(String(res.status));
        setStatus({
          message: "Location confirmed successfully!",
          type: "success",
        });
        if (redirectUrl) {
          setTimeout(() => {
            try {
              const u = new URL(redirectUrl);
              u.searchParams.set("orderId", orderId);
              u.searchParams.set("lat", String(current.lat));
              u.searchParams.set("lng", String(current.lng));
              u.searchParams.set("ok", "1");
              window.location.href = u.toString();
            } catch (_) {}
          }, 1500);
        }
      } else {
        setStatus({
          message: "Location confirmed! You can close this page.",
          type: "success",
        });
      }
    } catch (e) {
      setStatus({
        message: "Failed to confirm location. Please try again.",
        type: "error",
      });
    } finally {
      setConfirming(false);
    }
  }

  return (
    <>
      {/* Load Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        strategy="afterInteractive"
        onLoad={() => setLoadedLeaflet(true)}
      />

      <div className="min-h-screen bg-[#F9FAFB] px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row">
          {/* Left Section: Map */}
          <div className="flex-1 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
            <div
              ref={mapRef}
              id="map"
              className="relative w-full"
              style={{
                height: "480px",
                minHeight: "480px",
                touchAction: "pan-x pan-y",
              }}
            />
          </div>

          {/* Right Section: Controls */}
          <div className="w-full flex-shrink-0 space-y-4 md:w-80">
            {/* Search Box */}
            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M12 5l7 7-7 7"
                  />
                </svg>
                Search Address
              </h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter delivery address..."
                  className="w-full rounded-md border border-gray-200 bg-gray-50 py-2 pr-3 pl-3 text-sm text-gray-700 placeholder-gray-400 transition-all outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                📍 Or click directly on the map to select your location.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
              <button
                onClick={onConfirm}
                disabled={disabled || confirming}
                className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50"
              >
                {confirming ? "Confirming..." : "Confirm Location"}
              </button>
              <button
                className="w-full rounded-md border border-gray-200 bg-gray-50 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => window.location.reload()}
              >
                Clear Selection
              </button>
            </div>

            {/* Order Info */}
            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
              <h4 className="mb-3 text-sm font-medium text-gray-700">
                Order Details
              </h4>
              <p className="text-sm text-gray-600">
                Order ID:{" "}
                <span className="font-medium text-gray-800">
                  {orderId || "--"}
                </span>
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Status:{" "}
                <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                  Pending Confirmation
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer tip */}
        <div className="mx-auto mt-6 max-w-6xl rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          💡 Tip: Click on the map to select your location, search for an
          address, or drag the marker to adjust your delivery point.
        </div>

        {/* Status Message */}
        {status.message && (
          <div
            className={`mx-auto mt-4 max-w-2xl rounded-md px-4 py-2 text-center text-sm ${
              status.type === "success"
                ? "bg-green-50 text-green-700"
                : status.type === "error"
                  ? "bg-red-50 text-red-700"
                  : "bg-gray-50 text-gray-700"
            }`}
          >
            {status.message}
          </div>
        )}
      </div>
    </>
  );
}

export default function ConfirmLocationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 py-8" />}>
      <ConfirmLocationClient />
    </Suspense>
  );
}
