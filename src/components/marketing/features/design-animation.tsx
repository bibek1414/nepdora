import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ShoppingBag,
  Search,
  Hexagon,
  Circle,
  Lightbulb,
  Type,
  Palette,
  Layout,
  MousePointer2,
  Smartphone,
  Tablet,
  Monitor,
  ChevronDown,
  MessageCircle,
  Star,
  Zap,
  Check,
} from "lucide-react";

type LogoType = "minimal" | "geometric" | "organic";
type FontFamily = "sans" | "serif";
type ThemeMode = "light" | "dark";
type Viewport = "mobile" | "tablet" | "desktop";

interface WebsiteState {
  brandName: string;
  logo: LogoType;
  font: FontFamily;
  theme: ThemeMode;
  viewport: Viewport;
  plugins: { reviews: boolean; chat: boolean };
}

const WebsitePreview = ({ config }: { config: WebsiteState }) => {
  const products = [
    {
      id: 1,
      title: "Fjallraven Backpack",
      price: 109.95,
      image: "/design-animation/product-1.png",
    },
    {
      id: 2,
      title: "Mens T-Shirts",
      price: 22.3,
      image: "/design-animation/product-2.png",
    },
    {
      id: 3,
      title: "Mens Jacket",
      price: 55.99,
      image: "/design-animation/product-3.png",
    },
  ];

  const isDark = config.theme === "dark";
  const bgClass = isDark ? "bg-slate-900" : "bg-white";
  const textClass = isDark ? "text-white" : "text-slate-900";
  const subTextClass = isDark ? "text-slate-400" : "text-slate-500";
  const borderClass = isDark ? "border-slate-800" : "border-slate-100";
  const fontClass = config.font === "serif" ? "font-serif" : "font-sans";

  const LogoIcon = () => {
    switch (config.logo) {
      case "geometric":
        return (
          <Hexagon
            size={24}
            className="text-indigo-500"
            fill="currentColor"
            fillOpacity={0.2}
          />
        );
      case "organic":
        return <Lightbulb size={24} className="text-amber-500" />;
      default:
        return <Circle size={24} className="text-slate-900 dark:text-white" />;
    }
  };

  const widthClass = {
    mobile: "w-[375px]",
    tablet: "w-[700px]",
    desktop: "w-full",
  }[config.viewport];

  return (
    <div
      className={`relative mx-auto flex h-full flex-col transition-all duration-500 ${widthClass} ${bgClass} ${fontClass} overflow-hidden shadow-2xl`}
    >
      <div
        className={`flex items-center justify-between border-b px-6 py-4 ${borderClass}`}
      >
        <div className="flex items-center gap-2">
          <LogoIcon />
          <span className={`text-base font-bold ${textClass}`}>
            {config.brandName}
          </span>
        </div>
        {config.viewport !== "mobile" && (
          <div className="flex items-center gap-6 text-[10px] font-medium uppercase">
            <span className={`${textClass} opacity-60`}>Shop</span>
            <span className={`${textClass} opacity-60`}>Stories</span>
            <span className={`${textClass} opacity-60`}>About</span>
          </div>
        )}
        <div className="flex items-center gap-4">
          <Search size={16} className={textClass} />
          <ShoppingBag size={16} className={textClass} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div
          className={`mb-6 grid items-center gap-6 ${config.viewport === "mobile" ? "grid-cols-1" : "grid-cols-2"}`}
        >
          <div>
            <span
              className={`mb-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${isDark ? "bg-slate-800 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}
            >
              New Season
            </span>
            <h1 className={`mb-3 text-3xl font-bold ${textClass}`}>
              {config.font === "serif" ? "Essential Style." : "Future Casual."}
            </h1>
            <p className={`mb-4 text-xs ${subTextClass}`}>
              Discover the new collection. Sustainable materials meets modern
              design.
            </p>
            <button
              className={`rounded-full px-6 py-2 text-xs font-semibold ${isDark ? "bg-white text-slate-900" : "bg-slate-900 text-white"}`}
            >
              Shop Now
            </button>
          </div>
          <div className="aspect-square overflow-hidden rounded-xl bg-slate-100">
            {products[0] && (
              <img
                src={products[0].image}
                alt="Hero"
                className="h-full w-full object-contain p-4"
              />
            )}
          </div>
        </div>

        <div className={`border-t ${borderClass} pt-6`}>
          <h3 className={`mb-4 text-sm font-bold ${textClass}`}>
            Featured Products
          </h3>
          <div
            className={`grid gap-4 ${config.viewport === "mobile" ? "grid-cols-2" : "grid-cols-3"}`}
          >
            {products
              .slice(0, config.viewport === "mobile" ? 2 : 3)
              .map((item, i) => (
                <div key={i}>
                  <div className="mb-2 aspect-[4/5] overflow-hidden rounded-lg bg-white p-4">
                    <img
                      src={item.image}
                      className="h-full w-full object-contain"
                      alt={item.title}
                    />
                  </div>
                  <div className={`text-xs font-medium ${textClass} truncate`}>
                    {item.title}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className={`text-[10px] font-bold ${textClass}`}>
                      NPR {item.price}
                    </div>
                    {config.plugins.reviews && (
                      <div className="flex text-amber-400">
                        {[1, 2, 3].map(n => (
                          <Star key={n} size={8} fill="currentColor" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {config.plugins.chat && (
        <div className="absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg">
          <MessageCircle size={20} />
        </div>
      )}
    </div>
  );
};

export const DesignAnimation = () => {
  const [config, setConfig] = useState<WebsiteState>({
    brandName: "Lumina",
    logo: "minimal",
    font: "sans",
    theme: "light",
    viewport: "desktop",
    plugins: { reviews: false, chat: false },
  });

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [cursor, setCursor] = useState({ x: -100, y: -100, active: false });

  useEffect(() => {
    let isActive = true;
    const wait = (ms: number) =>
      new Promise(resolve => setTimeout(resolve, ms));

    const animate = async () => {
      // Coordinates for cursor positions
      const C = {
        MOB: { x: 142, y: 23 },
        TAB: { x: 178, y: 23 },
        DESK: { x: 214, y: 23 },
        LIGHT: { x: 42, y: 95 },
        DARK: { x: 154, y: 95 },
        FONT_DD: { x: 128, y: 166 },
        FONT_SER: { x: 128, y: 222 },
        LOGO_DD: { x: 128, y: 240 },
        LOGO_GEO: { x: 128, y: 295 },
        CHAT: { x: 186, y: 356 },
      };

      while (isActive) {
        // Reset to initial state
        setConfig({
          brandName: "Lumina",
          logo: "minimal",
          font: "sans",
          theme: "light",
          viewport: "desktop",
          plugins: { reviews: false, chat: false },
        });
        setActiveDropdown(null);
        setCursor({ x: -100, y: -100, active: false });
        await wait(1500);

        // 1. Switch to Dark mode
        setCursor({ ...C.DARK, active: false });
        await wait(600);
        setCursor(p => ({ ...p, active: true }));
        await wait(100);
        setConfig(p => ({ ...p, theme: "dark" }));
        setCursor(p => ({ ...p, active: false }));
        await wait(900);

        // 2. Switch to Mobile viewport
        setCursor({ ...C.MOB, active: false });
        await wait(600);
        setCursor(p => ({ ...p, active: true }));
        await wait(100);
        setConfig(p => ({ ...p, viewport: "mobile" }));
        setCursor(p => ({ ...p, active: false }));
        await wait(1100);

        // 3. Open Font dropdown
        setCursor({ ...C.FONT_DD, active: false });
        await wait(600);
        setCursor(p => ({ ...p, active: true }));
        await wait(100);
        setCursor(p => ({ ...p, active: false }));
        await wait(50);
        setActiveDropdown("font");
        await wait(400);

        // 4. Select Serif font
        setCursor({ ...C.FONT_SER, active: false });
        await wait(500);
        setCursor(p => ({ ...p, active: true }));
        await wait(100);
        setConfig(p => ({ ...p, font: "serif" }));
        setActiveDropdown(null);
        setCursor(p => ({ ...p, active: false }));
        await wait(1100);

        // 5. Enable Chat plugin
        setCursor({ ...C.CHAT, active: false });
        await wait(600);
        setCursor(p => ({ ...p, active: true }));
        await wait(100);
        setConfig(p => ({ ...p, plugins: { ...p.plugins, chat: true } }));
        setCursor(p => ({ ...p, active: false }));
        await wait(900);

        // 6. Switch to Tablet viewport
        setCursor({ ...C.TAB, active: false });
        await wait(600);
        setCursor(p => ({ ...p, active: true }));
        await wait(100);
        setConfig(p => ({ ...p, viewport: "tablet" }));
        setCursor(p => ({ ...p, active: false }));
        await wait(900);

        // 7. Open Logo dropdown
        setCursor({ ...C.LOGO_DD, active: false });
        await wait(600);
        setCursor(p => ({ ...p, active: true }));
        await wait(100);
        setCursor(p => ({ ...p, active: false }));
        await wait(50);
        setActiveDropdown("logo");
        await wait(400);

        // 8. Select Geometric logo
        setCursor({ ...C.LOGO_GEO, active: false });
        await wait(500);
        setCursor(p => ({ ...p, active: true }));
        await wait(100);
        setConfig(p => ({ ...p, logo: "geometric" }));
        setActiveDropdown(null);
        setCursor(p => ({ ...p, active: false }));
        await wait(1100);

        // 9. Back to Desktop viewport
        setCursor({ ...C.DESK, active: false });
        await wait(600);
        setCursor(p => ({ ...p, active: true }));
        await wait(100);
        setConfig(p => ({ ...p, viewport: "desktop" }));
        setCursor(p => ({ ...p, active: false }));
        await wait(1800);
      }
    };

    animate();
    return () => {
      isActive = false;
    };
  }, []);

  const ControlSelect = ({ id, label, value, options, icon: Icon }: any) => {
    const isOpen = activeDropdown === id;
    const sel = options.find((o: any) => o.value === value);

    return (
      <div className="relative">
        <div
          className={`flex w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-xs font-medium transition-all ${isOpen ? "border-indigo-500 ring-1 ring-indigo-500" : "border-slate-200"}`}
        >
          <div className="flex items-center gap-2 text-slate-700">
            <Icon size={14} className="text-slate-400" />
            <span>{sel?.label}</span>
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </div>
        {isOpen && (
          <div className="absolute top-full right-0 left-0 z-50 mt-1 rounded-md border border-slate-100 bg-white p-1 shadow-xl">
            {options.map((opt: any) => (
              <div
                key={opt.value}
                className={`flex items-center gap-2 rounded px-2 py-1.5 text-xs font-medium ${opt.value === value ? "bg-indigo-50 text-indigo-700" : "text-slate-600"}`}
              >
                {opt.icon && <opt.icon size={12} />}
                {opt.label}
                {opt.value === value && <Check size={12} className="ml-auto" />}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative flex h-[700px] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 font-sans shadow-sm">
      {/* Animated Cursor */}
      <div
        className="pointer-events-none absolute z-[100] transition-all duration-150 ease-out"
        style={{
          transform: `translate(${cursor.x}px, ${cursor.y}px) scale(${cursor.active ? 0.85 : 1})`,
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
        }}
      >
        <MousePointer2 className="fill-slate-900 text-white" size={22} />
      </div>

      {/* Left Panel - Editor */}
      <div className="relative z-10 flex w-64 flex-shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layout size={16} />
              <span className="text-sm font-bold">Editor</span>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
              <div
                className={`rounded p-1 transition-all ${config.viewport === "mobile" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}
              >
                <Smartphone size={14} />
              </div>
              <div
                className={`rounded p-1 transition-all ${config.viewport === "tablet" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}
              >
                <Tablet size={14} />
              </div>
              <div
                className={`rounded p-1 transition-all ${config.viewport === "desktop" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}
              >
                <Monitor size={14} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-4">
          {/* Theme Toggle */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
              <Palette size={12} />
              <span>Theme Mode</span>
            </div>
            <div className="flex rounded-md bg-slate-100 p-1">
              <div
                className={`flex-1 rounded py-1 text-center text-xs font-medium transition-all ${config.theme === "light" ? "bg-white text-slate-900 shadow" : "text-slate-500"}`}
              >
                Light
              </div>
              <div
                className={`flex-1 rounded py-1 text-center text-xs font-medium transition-all ${config.theme === "dark" ? "bg-white text-slate-900 shadow" : "text-slate-500"}`}
              >
                Dark
              </div>
            </div>
          </div>

          {/* Typography Select */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
              <Type size={12} />
              <span>Typography</span>
            </div>
            <ControlSelect
              id="font"
              label="Font Family"
              value={config.font}
              icon={Type}
              options={[
                { label: "Inter (Sans)", value: "sans", icon: Type },
                { label: "Playfair (Serif)", value: "serif", icon: Type },
              ]}
            />
          </div>

          {/* Logo Select */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
              <Sparkles size={12} />
              <span>Identity</span>
            </div>
            <ControlSelect
              id="logo"
              label="Logo Style"
              value={config.logo}
              icon={Hexagon}
              options={[
                { label: "Minimal Circle", value: "minimal", icon: Circle },
                { label: "Geometric Hex", value: "geometric", icon: Hexagon },
                { label: "Organic Bulb", value: "organic", icon: Lightbulb },
              ]}
            />
          </div>

          {/* Plugins */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
              <Zap size={12} />
              <span>Plugins</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-md border border-slate-100 p-2">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <Star size={14} className="text-amber-400" />
                  <span>Reviews</span>
                </div>
                <div
                  className={`h-4 w-7 rounded-full p-0.5 transition-colors ${config.plugins.reviews ? "bg-indigo-500" : "bg-slate-200"}`}
                >
                  <div
                    className={`h-3 w-3 rounded-full bg-white transition-transform duration-200 ${config.plugins.reviews ? "translate-x-3" : ""}`}
                  ></div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md border border-slate-100 p-2">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <MessageCircle size={14} className="text-blue-500" />
                  <span>AI Chat</span>
                </div>
                <div
                  className={`h-4 w-7 rounded-full p-0.5 transition-colors ${config.plugins.chat ? "bg-indigo-500" : "bg-slate-200"}`}
                >
                  <div
                    className={`h-3 w-3 rounded-full bg-white transition-transform duration-200 ${config.plugins.chat ? "translate-x-3" : ""}`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="relative flex flex-1 items-start justify-center overflow-hidden bg-slate-100/50 p-6">
        {/* Grid Background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <WebsitePreview config={config} />
      </div>
    </div>
  );
};
