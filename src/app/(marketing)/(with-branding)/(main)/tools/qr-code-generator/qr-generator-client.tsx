"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Zap,
  Download,
  Upload,
  Globe,
  Mail,
  MessageSquare,
  Check,
  ChevronRight,
  Palette,
  Maximize,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
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
import { QrVisualMock } from "@/components/marketing/tools/qr-visual-mock";

// ─── Types ────────────────────────────────────────────────────────────────────
type TabType = "url" | "text" | "email";
type SizeKey = "S" | "M" | "L";
type ECLevel = "L" | "M" | "Q" | "H";

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

      default:
        return "";
    }
  }, [tab, urlVal, textVal, email]);

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
    <main className="min-h-screen bg-white">
      {/* Premium Split Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-28 md:pb-32">
        {/* Decorative Background */}
        <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] translate-x-1/4 -translate-y-1/4 rounded-full blur-[120px]" />

        <div className="relative z-10 container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left Content */}
            <div className="max-w-2xl">
              <h1 className="-tight mb-6 text-4xl font-extrabold text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
                Universal <br />
                <span className="text-primary">QR generator.</span>
              </h1>

              <p className="mb-8 text-lg leading-relaxed font-medium text-slate-500 sm:text-xl">
                Create professional, high-quality QR codes for URLs, emails, and
                texts instantly. Customize with logos and brand colors—no signup
                required.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="#generator"
                  className="bg-primary hover:bg-primary/90 -primary/20 -xl inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-bold text-white transition-all hover:scale-105 active:scale-95"
                >
                  Create My QR Code
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Right Visual Mock */}
            <div className="relative">
              <QrVisualMock />
            </div>
          </div>
        </div>
      </section>

      {/* Main Generator Tool */}
      <section id="generator" className="scroll-mt-20 bg-slate-50/50 py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* ── Left Side: Editor Sections ── */}
            <div className="space-y-8 lg:col-span-8">
              {/* Step 1: Content Type */}
              <div className="-sm overflow-hidden rounded-3xl border border-slate-200 bg-white p-8">
                <div className="mb-8 flex items-center gap-4">
                  <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Choose Content Type
                  </h3>
                </div>

                <Tabs
                  value={tab}
                  onValueChange={v => setTab(v as TabType)}
                  className="w-full"
                >
                  <TabsList className="mb-8 grid h-auto w-full grid-cols-3 gap-2 bg-slate-100 p-1">
                    <TabsTrigger
                      value="url"
                      className="data-[state=active]:-sm cursor-pointer gap-2 py-3 data-[state=active]:bg-white"
                    >
                      <Globe className="h-4 w-4" /> URL
                    </TabsTrigger>
                    <TabsTrigger
                      value="text"
                      className="data-[state=active]:-sm cursor-pointer gap-2 py-3 data-[state=active]:bg-white"
                    >
                      <MessageSquare className="h-4 w-4" /> Text
                    </TabsTrigger>
                    <TabsTrigger
                      value="email"
                      className="data-[state=active]:-sm cursor-pointer gap-2 py-3 data-[state=active]:bg-white"
                    >
                      <Mail className="h-4 w-4" /> Email
                    </TabsTrigger>
                  </TabsList>

                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <TabsContent value="url" className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-slate-700">
                          Website URL
                        </Label>
                        <Input
                          placeholder="https://example.com"
                          value={urlVal}
                          onChange={e => setUrlVal(e.target.value)}
                          className="h-12 border-slate-200 placeholder:text-slate-400"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="text" className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-slate-700">
                          Text Message
                        </Label>
                        <textarea
                          className="focus:ring-primary/20 flex min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm placeholder:text-slate-400 focus:ring-2 focus:outline-none"
                          placeholder="Enter any text or message to encode..."
                          value={textVal}
                          onChange={e => setTextVal(e.target.value)}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="email" className="space-y-4">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-sm font-bold text-slate-700">
                            Recipient Email
                          </Label>
                          <Input
                            type="email"
                            placeholder="name@business.com"
                            value={email.address}
                            onChange={e =>
                              setEmail({ ...email, address: e.target.value })
                            }
                            className="h-12 border-slate-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-bold text-slate-700">
                            Subject Line
                          </Label>
                          <Input
                            placeholder="Subject line..."
                            value={email.subject}
                            onChange={e =>
                              setEmail({ ...email, subject: e.target.value })
                            }
                            className="h-12 border-slate-200"
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>

              {/* Step 2: Customization */}
              <div className="-sm overflow-hidden rounded-3xl border border-slate-200 bg-white p-8">
                <div className="mb-8 flex items-center gap-4">
                  <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Customize Branding
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                  {/* Color Picker */}
                  <div className="space-y-6">
                    <div className="-wider flex items-center gap-2 text-sm font-bold text-slate-800">
                      <Palette className="text-primary h-4 w-4" /> Pick Your
                      Color
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {PRESETS.map(p => (
                        <button
                          key={p.hex}
                          onClick={() => setColor(p.hex)}
                          className={cn(
                            "h-10 w-10 cursor-pointer rounded-full border-4 transition-all hover:scale-115 active:scale-95",
                            color === p.hex
                              ? "-lg scale-110 border-slate-800"
                              : "-sm border-white"
                          )}
                          style={{ backgroundColor: p.hex }}
                        />
                      ))}
                      <div className="-sm relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-100">
                        <input
                          type="color"
                          value={color}
                          onChange={e => setColor(e.target.value)}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                        <span className="text-[10px] font-bold text-slate-400">
                          HEX
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Logo Upload */}
                  <div className="space-y-4">
                    <div className="-wider flex items-center gap-2 text-sm font-bold text-slate-800">
                      <Upload className="text-primary h-4 w-4" /> Center Logo
                    </div>
                    <div
                      onClick={() => fileRef.current?.click()}
                      className={cn(
                        "flex cursor-pointer flex-col items-center justify-center rounded-4xl border-2 border-dashed p-6 transition-all",
                        logo
                          ? "border-primary bg-primary/5 hover:bg-primary/10"
                          : "border-slate-200 hover:bg-slate-50"
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
                        <div className="flex flex-col items-center gap-3">
                          <img
                            src={logo.src}
                            alt="logo"
                            className="-md h-14 w-14 rounded-xl object-contain outline outline-4 outline-white"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={e => {
                              e.stopPropagation();
                              setLogo(null);
                              setLogoName("");
                            }}
                            className="h-7 text-xs text-red-500"
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="mx-auto mb-2 h-6 w-6 text-slate-300" />
                          <p className="text-xs font-bold text-slate-500">
                            Upload Logo
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-8 border-t border-slate-100 pt-10 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label className="-widest text-xs font-bold text-slate-500">
                      Resolution
                    </Label>
                    <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-100 p-1">
                      {(["S", "M", "L"] as SizeKey[]).map(s => (
                        <button
                          key={s}
                          onClick={() => setSize(s)}
                          className={cn(
                            "cursor-pointer rounded-lg py-2 text-xs font-bold transition-all",
                            size === s
                              ? "text-primary -sm bg-white"
                              : "text-slate-500 hover:text-slate-800"
                          )}
                        >
                          {s === "S" ? "Web" : s === "M" ? "Print" : "HD"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="-widest text-xs font-bold text-slate-500">
                      Error Correction
                    </Label>
                    <Select
                      value={ecl}
                      onValueChange={v => setEcl(v as ECLevel)}
                    >
                      <SelectTrigger className="h-10 border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">Standard (7%)</SelectItem>
                        <SelectItem value="M">Optimized (15%)</SelectItem>
                        <SelectItem value="Q">High (25%)</SelectItem>
                        <SelectItem value="H">Maximum (30%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right Side: Sticky Preview & Download ── */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                {/* Preview Card */}
                <div className="-xl overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8">
                  <div className="mb-8 text-center">
                    <h3 className="text-lg font-bold text-slate-900">
                      QR Preview
                    </h3>
                    <div className="-widest mt-1 flex items-center justify-center gap-1.5 text-[10px] font-bold text-emerald-500">
                      <Check className="h-3 w-3" /> Live Generating
                    </div>
                  </div>

                  <div
                    className={cn(
                      "relative mx-auto flex aspect-square items-center justify-center transition-all duration-500",
                      hasQR
                        ? "scale-100 opacity-100"
                        : "scale-95 opacity-40 grayscale"
                    )}
                  >
                    <div className="-2xl relative rounded-3xl bg-white p-6 ring-1 ring-slate-100">
                      <canvas
                        ref={canvasRef}
                        style={{
                          width: SIZES[size],
                          height: SIZES[size],
                          display: "block",
                        }}
                      />
                      {!hasQR && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-white/60 backdrop-blur-[2px]">
                          <Zap className="h-10 w-10 animate-pulse text-slate-200" />
                        </div>
                      )}
                    </div>

                    {hasQR && (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="-xl -widest absolute -bottom-4 rounded-full bg-slate-900 px-4 py-1.5 text-[10px] font-semibold text-white ring-4 ring-white"
                      >
                        nepdora.com
                      </motion.div>
                    )}
                  </div>

                  {/* Proper Download Format Buttons */}
                  <div className="mt-12 space-y-3">
                    <Button
                      disabled={!hasQR}
                      onClick={() => download("png")}
                      className="group bg-primary hover:bg-primary/95 -xl -primary/20 h-14 w-full rounded-2xl font-bold transition-all hover:scale-[1.02]"
                    >
                      <Download className="mr-2 h-5 w-5 transition-transform group-hover:translate-y-0.5" />
                      Download PNG
                    </Button>
                    <Button
                      variant="outline"
                      disabled={!hasQR}
                      onClick={() => download("svg")}
                      className="group h-14 w-full rounded-2xl border-2 border-slate-200 bg-white font-bold text-slate-900 transition-all hover:scale-[1.02] hover:bg-slate-50"
                    >
                      <Maximize className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                      Download SVG
                    </Button>
                    <div className="-widest pt-2 text-center text-[10px] font-bold text-slate-400">
                      100% Free • High Quality • Secure
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-20">
        <FAQSection />
      </div>
      <CTASection />
    </main>
  );
}
