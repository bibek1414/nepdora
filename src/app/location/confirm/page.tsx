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

      {/* Load Leaflet JS */}
      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        strategy="afterInteractive"
        onLoad={() => setLoadedLeaflet(true)}
      />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-2xl px-4">
          {/* Header */}
          <header className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-blue-600">
              Confirm Your Location
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Order: <span className="font-medium">{orderId || "--"}</span>
            </p>
          </header>

          {/* Map Container with Fixed Styling */}
          <div className="mb-4 overflow-hidden rounded-lg bg-white shadow-md">
            <div
              ref={mapRef}
              id="map"
              className="relative w-full"
              style={{
                height: "450px",
                minHeight: "450px",
                touchAction: "pan-x pan-y",
              }}
            />
          </div>

          {/* Global Styles for Leaflet */}
          <style jsx global>{`
            /* Ensure Leaflet container takes full height */
            .leaflet-container {
              height: 100% !important;
              width: 100% !important;
              position: relative;
              z-index: 1;
            }

            /* Fix for tile rendering */
            .leaflet-container img {
              max-width: none !important;
              max-height: none !important;
            }

            /* Ensure tiles load properly */
            .leaflet-tile-container {
              pointer-events: auto;
            }

            /* Fix for map panes */
            .leaflet-pane {
              z-index: auto;
            }

            /* Ensure marker is visible */
            .leaflet-marker-icon {
              z-index: 600 !important;
            }

            /* Remove any transform issues */
            .leaflet-container .leaflet-tile {
              transform: translate3d(0, 0, 0);
            }

            /* Fix control positioning */
            .leaflet-control-container {
              position: relative;
            }

            /* Ensure zoom controls are visible */
            .leaflet-control-zoom {
              margin: 10px;
            }
          `}</style>

          {/* Location Details Card */}
          <div className="mb-4 rounded-lg bg-white p-5 shadow-md">
            <div className="mt-4 flex items-start gap-2 border-t border-gray-200 pt-4">
              <span className="text-lg">📍</span>
              <p className="text-xs text-gray-600">
                Drag the marker to adjust your exact location. Use pinch or
                scroll to zoom. Click &quot;Confirm Location&quot; when ready.
              </p>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={onConfirm}
            disabled={disabled || confirming}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-base font-medium text-white transition-all hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {confirming ? "Confirming..." : "Confirm Location"}
          </button>

          {/* Status Message */}
          {status.message && (
            <div
              className={`mt-4 rounded-lg px-4 py-2 text-center text-sm font-medium ${
                status.type === "success"
                  ? "bg-green-50 text-green-700"
                  : status.type === "error"
                    ? "bg-red-50 text-red-700"
                    : "bg-gray-50 text-gray-600"
              }`}
            >
              {status.message}
            </div>
          )}
        </div>
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
