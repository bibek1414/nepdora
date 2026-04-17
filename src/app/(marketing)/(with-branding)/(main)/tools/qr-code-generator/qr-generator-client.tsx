"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Zap,
  Download,
  Upload,
  Globe,
  Wifi,
  Mail,
  CreditCard,
  MessageSquare,
  Smartphone,
  Check,
  ChevronRight,
  Info,
  Palette,
  Maximize,
} from "lucide-react";
import Link from "next/link";
import { MarketingPageHero } from "@/components/marketing/shared/MarketingPageHero";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Types ────────────────────────────────────────────────────────────────────
type TabType = "url" | "text" | "email" | "wifi";
type SizeKey = "S" | "M" | "L";
type ECLevel = "L" | "M" | "Q" | "H";

interface WifiConfig {
  ssid: string;
  password: string;
  security: "WPA" | "WEP" | "nopass";
}

interface EmailConfig {
  address: string;
  subject: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SIZES: Record<SizeKey, number> = { S: 160, M: 220, L: 280 };

const PRESETS = [
  { name: "Nepdora Navy", hex: "#0f172a" },
  { name: "Nepdora Primary", hex: "#0284c7" },
  { name: "Modern Black", hex: "#000000" },
  { name: "Slate Grey", hex: "#64748b" },
  { name: "Indigo Night", hex: "#312e81" },
  { name: "Emerald", hex: "#059669" },
];

// ─── QRCode Loader Hook ────────────────────────────────────────────────────────
function useQRCodeLib() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if ((window as any).QRCode) {
      setReady(true);
      return;
    }
    const s = document.createElement("script");
    s.src =
      "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    s.async = true;
    s.onload = () => setReady(true);
    document.head.appendChild(s);
  }, []);
  return ready;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function QRGeneratorClient() {
  const [tab, setTab] = useState<TabType>("url");
  const [urlVal, setUrlVal] = useState("");
  const [textVal, setTextVal] = useState("");
  const [email, setEmail] = useState<EmailConfig>({ address: "", subject: "" });
  const [wifi, setWifi] = useState<WifiConfig>({
    ssid: "",
    password: "",
    security: "WPA",
  });
  const [color, setColor] = useState(PRESETS[1].hex);
  const [size, setSize] = useState<SizeKey>("M");
  const [ecl, setEcl] = useState<ECLevel>("M");
  const [logo, setLogo] = useState<HTMLImageElement | null>(null);
  const [logoName, setLogoName] = useState("");
  const [hasQR, setHasQR] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<any>(null);
  const qrReady = useQRCodeLib();

  const getContent = useCallback((): string => {
    switch (tab) {
      case "url":
        return urlVal.trim();
      case "text":
        return textVal.trim();
      case "email": {
        const { address, subject } = email;
        return address
          ? `mailto:${address}${subject ? "?subject=" + encodeURIComponent(subject) : ""}`
          : "";
      }
      case "wifi": {
        const { ssid, password, security } = wifi;
        return ssid ? `WIFI:T:${security};S:${ssid};P:${password};;` : "";
      }
      default:
        return "";
    }
  }, [tab, urlVal, textVal, email, wifi]);

  const generateQR = useCallback(() => {
    if (!qrReady) return;
    const content = getContent();
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!content) {
      setHasQR(false);
      return;
    }

    const px = SIZES[size];
    const scale = 2;
    canvas.width = px * scale;
    canvas.height = px * scale;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(scale, scale);
    ctx.clearRect(0, 0, px, px);

    const div = document.createElement("div");
    try {
      const qr = new (window as any).QRCode(div, {
        text: content,
        width: px,
        height: px,
        colorDark: color,
        colorLight: "#ffffff",
        correctLevel: (window as any).QRCode.CorrectLevel[ecl],
      });

      setTimeout(() => {
        const img: HTMLImageElement = qr._oDrawing._elImage;
        if (img) {
          ctx.drawImage(img, 0, 0, px, px);
          if (logo) {
            const ls = px * 0.22;
            const lx = (px - ls) / 2;
            const ly = (px - ls) / 2;

            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            const radius = 8;
            const padding = 6;
            if ((ctx as any).roundRect) {
              (ctx as any).roundRect(
                lx - padding,
                ly - padding,
                ls + padding * 2,
                ls + padding * 2,
                radius
              );
            } else {
              ctx.rect(
                lx - padding,
                ly - padding,
                ls + padding * 2,
                ls + padding * 2
              );
            }
            ctx.fill();

            ctx.drawImage(logo, lx, ly, ls, ls);
          }
          setHasQR(true);
        }
      }, 100);
    } catch (e) {
      console.error("QR Generation failed", e);
    }
  }, [qrReady, getContent, color, size, ecl, logo]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(generateQR, 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [generateQR]);

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        setLogo(img);
        setLogoName(file.name);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  function download(format: "png" | "svg") {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (format === "png") {
      const a = document.createElement("a");
      a.download = `nepdora-qr-${tab}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    } else {
      const px = SIZES[size];
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}"><image href="${canvas.toDataURL()}" width="${px}" height="${px}"/></svg>`;
      const a = document.createElement("a");
      a.download = `nepdora-qr-${tab}.svg`;
      a.href = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
      a.click();
    }
  }

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      <MarketingPageHero
        centered
        badgeText="Free Business Tools"
        badgeIcon={Zap}
        title={
          <>
            <span className="text-primary">Universal QR Code</span> Generator
          </>
        }
        description="Generate professional, high-quality QR codes for URLs, WiFi networks, emails, and Nepali payment wallets (eSewa, Khalti, Fonepay) with custom branding and logos."
      />

      <section className="container mx-auto -mt-16 max-w-6xl px-4">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-sky-900/5">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* ── Left Editor ── */}
            <div className="p-8 lg:col-span-7 xl:col-span-8">
              <Tabs
                value={tab}
                onValueChange={v => setTab(v as TabType)}
                className="w-full"
              >
                <TabsList className="mb-8 grid h-auto w-full grid-cols-2 gap-2 overflow-x-auto bg-slate-100 p-1 md:grid-cols-4">
                  <TabsTrigger value="url" className="gap-2 py-3">
                    <Globe className="h-4 w-4" /> URL
                  </TabsTrigger>
                  <TabsTrigger value="text" className="gap-2 py-3">
                    <MessageSquare className="h-4 w-4" /> Text
                  </TabsTrigger>
                  <TabsTrigger value="wifi" className="gap-2 py-3">
                    <Wifi className="h-4 w-4" /> WiFi
                  </TabsTrigger>
                  <TabsTrigger value="email" className="gap-2 py-3">
                    <Mail className="h-4 w-4" /> Email
                  </TabsTrigger>
                </TabsList>

                <div className="space-y-6">

                  <TabsContent value="url" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Website URL</Label>
                      <Input
                        placeholder="https://example.com"
                        value={urlVal}
                        onChange={e => setUrlVal(e.target.value)}
                        className="h-12 placeholder:text-slate-400"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="text" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Text Message</Label>
                      <textarea
                        className="border-input focus-visible:ring-ring flex min-h-[100px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter any text or message to encode..."
                        value={textVal}
                        onChange={e => setTextVal(e.target.value)}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="wifi" className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>SSID (Network name)</Label>
                        <Input
                          placeholder="My WiFi Network"
                          value={wifi.ssid}
                          onChange={e =>
                            setWifi({ ...wifi, ssid: e.target.value })
                          }
                          className="placeholder:text-slate-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Security</Label>
                        <Select
                          value={wifi.security}
                          onValueChange={v =>
                            setWifi({ ...wifi, security: v as any })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="WPA">WPA/WPA2</SelectItem>
                            <SelectItem value="WEP">WEP</SelectItem>
                            <SelectItem value="nopass">No Password</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={wifi.password}
                        onChange={e =>
                          setWifi({ ...wifi, password: e.target.value })
                        }
                        className="placeholder:text-slate-400"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="email" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Recipient Email</Label>
                      <Input
                        type="email"
                        placeholder="example@gmail.com"
                        value={email.address}
                        onChange={e =>
                          setEmail({ ...email, address: e.target.value })
                        }
                        className="placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Subject Line</Label>
                      <Input
                        placeholder="Hello from Nepdora"
                        value={email.subject}
                        onChange={e =>
                          setEmail({ ...email, subject: e.target.value })
                        }
                        className="placeholder:text-slate-400"
                      />
                    </div>
                  </TabsContent>
                </div>
              </Tabs>

              <div className="my-10 h-px bg-slate-100" />

              {/* Customization Section */}
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <Palette className="text-primary h-4 w-4" /> Branding &
                    Color
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {PRESETS.map(p => (
                      <button
                        key={p.hex}
                        onClick={() => setColor(p.hex)}
                        className={cn(
                          "h-10 w-10 rounded-full border-2 transition-all hover:scale-110",
                          color === p.hex
                            ? "border-slate-800 ring-2 ring-slate-200"
                            : "border-white"
                        )}
                        style={{ backgroundColor: p.hex }}
                        title={p.name}
                      />
                    ))}
                    <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-sm">
                      <input
                        type="color"
                        value={color}
                        onChange={e => setColor(e.target.value)}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                      <div className="pointer-events-none text-xs font-bold text-slate-400">
                        HEX
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-slate-600">
                        Download Resolution
                      </Label>
                      <span className="text-primary text-xs font-black">
                        {SIZES[size]}px
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-50 p-1">
                      {(["S", "M", "L"] as SizeKey[]).map(s => (
                        <button
                          key={s}
                          onClick={() => setSize(s)}
                          className={cn(
                            "rounded-md py-1.5 text-xs font-bold transition-all",
                            size === s
                              ? "text-primary bg-white shadow-sm"
                              : "text-slate-400 hover:text-slate-600"
                          )}
                        >
                          {s === "S" ? "Web" : s === "M" ? "Print" : "High-Res"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <Upload className="text-primary h-4 w-4" /> Center Logo
                  </div>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className={cn(
                      "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-all hover:bg-slate-50",
                      logo ? "border-primary bg-primary/5" : "border-slate-200"
                    )}
                  >
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    {logo ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative mb-2 h-16 w-16 overflow-hidden rounded-xl border-2 border-white shadow-md">
                          <img
                            src={logo.src}
                            alt="Uploaded logo"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="text-primary max-w-[150px] truncate text-xs font-medium">
                          {logoName}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={e => {
                            e.stopPropagation();
                            setLogo(null);
                            setLogoName("");
                          }}
                          className="h-7 px-2 text-[10px] text-red-500 hover:bg-red-50 hover:text-red-700"
                        >
                          Clear logo
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                          <Upload className="h-5 w-5 text-slate-400" />
                        </div>
                        <p className="text-xs font-medium text-slate-500">
                          Center Logo (Optional)
                        </p>
                        <p className="mt-1 max-w-6xl text-[10px] font-bold tracking-widest text-slate-400">
                          Square recommended
                        </p>
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex max-w-6xl items-center gap-2 text-[10px] font-bold tracking-widest text-slate-500">
                      <Info className="h-3 w-3" /> Error Correction Level
                    </div>
                    <Select
                      value={ecl}
                      onValueChange={v => setEcl(v as ECLevel)}
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">Low (7%)</SelectItem>
                        <SelectItem value="M">
                          Medium (15%) - Recommended
                        </SelectItem>
                        <SelectItem value="Q">Quartile (25%)</SelectItem>
                        <SelectItem value="H">
                          High (30%) - Better for Logos
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right Preview ── */}
            <div className="flex flex-col items-center justify-center border-l border-slate-100 bg-slate-50/80 p-10 lg:col-span-5 xl:col-span-4">
              <div className="sticky top-10 flex w-full flex-col items-center">
                <div className="mb-10 w-full text-center">
                  <h3 className="decoration-primary text-xl font-black tracking-tight text-slate-900 underline decoration-4 underline-offset-4">
                    QR Preview
                  </h3>
                  <p className="mt-2 max-w-6xl text-xs font-bold tracking-widest text-slate-500">
                    Instant Rendering
                  </p>
                </div>

                <div
                  className={cn(
                    "relative flex items-center justify-center transition-all duration-700",
                    hasQR
                      ? "scale-100 opacity-100"
                      : "scale-90 opacity-40 grayscale"
                  )}
                >
                  <div className="relative rounded-[2.5rem] bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] ring-1 ring-slate-100">
                    <canvas
                      ref={canvasRef}
                      style={{
                        width: SIZES[size],
                        height: SIZES[size],
                        display: "block",
                        borderRadius: "8px",
                      }}
                    />
                    {!hasQR && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[2.5rem] bg-white/60 backdrop-blur-sm">
                        <div className="mb-4 flex h-16 w-16 animate-bounce items-center justify-center rounded-full bg-slate-100">
                          <Smartphone className="h-8 w-8 text-slate-300" />
                        </div>
                        <p className="max-w-6xl px-10 text-center text-xs font-black tracking-tighter text-slate-400">
                          Enter details to generate
                        </p>
                      </div>
                    )}
                  </div>

                  {hasQR && (
                    <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-[10px] font-black tracking-widest whitespace-nowrap text-white shadow-xl">
                      <Zap className="fill-primary text-primary h-3 w-3" />{" "}
                      Powered by Nepdora
                    </div>
                  )}
                </div>

                <div className="mt-16 grid w-full grid-cols-2 gap-4">
                  <Button
                    variant="default"
                    className="h-14 max-w-6xl text-xs font-black tracking-widest"
                    disabled={!hasQR}
                    onClick={() => download("png")}
                  >
                    <Download className="mr-2 h-4 w-4" /> PNG
                  </Button>
                  <Button
                    variant="outline"
                    className="h-14 max-w-6xl border-2 bg-white text-xs font-black tracking-widest"
                    disabled={!hasQR}
                    onClick={() => download("svg")}
                  >
                    <Maximize className="mr-2 h-4 w-4" /> SVG
                  </Button>
                </div>

                <div className="mt-8 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="bg-primary/10 mt-1 rounded-full p-1.5">
                    <Info className="text-primary h-3 w-3" />
                  </div>
                  <p className="text-[10px] leading-relaxed font-bold text-slate-600">
                    Your QR codes are generated entirely in your browser. No
                    data is stored on our servers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-40">
        <FAQSection />
      </div>
      <CTASection />
    </main>
  );
}
