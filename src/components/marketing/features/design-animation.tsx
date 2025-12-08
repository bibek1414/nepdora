import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  plugins: {
    reviews: boolean;
    chat: boolean;
  };
}

// --- Preview Components (Right Panel) ---

const WebsitePreview = ({ config }: { config: WebsiteState }) => {
  const [products] = useState<any[]>([
    {
      id: 1,
      title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
      price: 109.95,
      description:
        "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
      category: "men's clothing",
      image: "/design-animation/product-1.png",
      rating: {
        rate: 3.9,
        count: 120,
      },
    },
    {
      id: 2,
      title: "Mens Casual Premium Slim Fit T-Shirts ",
      price: 22.3,
      description:
        "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
      category: "men's clothing",
      image: "/design-animation/product-2.png",
      rating: {
        rate: 4.1,
        count: 259,
      },
    },
    {
      id: 3,
      title: "Mens Cotton Jacket",
      price: 55.99,
      description:
        "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
      category: "men's clothing",
      image: "/design-animation/product-3.png",
      rating: {
        rate: 4.7,
        count: 500,
      },
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Automatic Scroll Animation
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationFrameId: number;
    let direction = 1; // 1 = down, -1 = up
    let speed = 0.5; // Pixels per frame
    let waitTimer = 0;

    const animateScroll = () => {
      // Pause handling
      if (waitTimer > 0) {
        waitTimer--;
        animationFrameId = requestAnimationFrame(animateScroll);
        return;
      }

      // Calculate max scroll
      const maxScroll = container.scrollHeight - container.clientHeight;

      // If content fits, no need to scroll
      if (maxScroll <= 0) {
        animationFrameId = requestAnimationFrame(animateScroll);
        return;
      }

      // Update scroll position
      container.scrollTop += direction * speed;

      // Boundary checks
      if (container.scrollTop >= maxScroll) {
        container.scrollTop = maxScroll;
        direction = -1; // Reverse
        waitTimer = 180; // Wait ~3 seconds at bottom
      } else if (container.scrollTop <= 0) {
        container.scrollTop = 0;
        direction = 1; // Reverse
        waitTimer = 180; // Wait ~3 seconds at top
      }

      animationFrameId = requestAnimationFrame(animateScroll);
    };

    // Start animation loop
    animationFrameId = requestAnimationFrame(animateScroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [products, config.viewport]); // Restart when content/viewport changes

  const isDark = config.theme === "dark";

  // Dynamic Styles
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

  // Viewport Sizing
  const widthClass = {
    mobile: "w-[375px]",
    tablet: "w-[700px]",
    desktop: "w-full",
  }[config.viewport];

  return (
    <motion.div
      layout
      className={`relative mx-auto flex h-full flex-col transition-all duration-700 ease-in-out ${widthClass} ${bgClass} ${fontClass} shadow-2xl`}
    >
      {/* Navbar */}
      <motion.div
        layout
        className={`flex items-center justify-between border-b px-6 py-4 ${borderClass}`}
      >
        <div className="flex items-center gap-2">
          <motion.div
            key={config.logo}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            className="flex items-center justify-center"
          >
            <LogoIcon />
          </motion.div>
          <motion.span
            layout
            className={`text-base font-bold tracking-tight ${textClass}`}
          >
            {config.brandName}
          </motion.span>
        </div>

        {config.viewport !== "mobile" && (
          <div className="flex items-center gap-6 text-[10px] font-medium tracking-wide uppercase">
            <span className={`${textClass} opacity-60`}>Shop</span>
            <span className={`${textClass} opacity-60`}>Stories</span>
            <span className={`${textClass} opacity-60`}>About</span>
          </div>
        )}

        <div className="flex items-center gap-4 opacity-80">
          <Search size={16} className={`${textClass}`} />
          <div className="relative">
            <ShoppingBag size={16} className={`${textClass}`} />
            <div className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-indigo-500"></div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area - Scrollable */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto p-4 [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden`}
      >
        <div
          className={`w-full origin-top ${config.viewport === "desktop" ? "scale-95" : "scale-100"}`}
        >
          {/* Hero Section */}
          <div
            className={`mb-6 grid items-center gap-6 ${config.viewport === "mobile" ? "grid-cols-1 text-center" : "grid-cols-2 text-left"}`}
          >
            <div
              className={`${config.viewport === "mobile" ? "order-2" : "order-1"}`}
            >
              <motion.span
                layout
                className={`mb-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase ${isDark ? "bg-slate-800 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}
              >
                New Season
              </motion.span>
              <motion.h1
                layout
                key={config.font}
                className={`mb-3 text-3xl leading-tight font-bold ${textClass} ${config.viewport === "mobile" ? "text-2xl" : "sm:text-4xl"}`}
              >
                {config.font === "serif"
                  ? "Essential Style."
                  : "Future Casual."}
              </motion.h1>
              <motion.p
                layout
                className={`mb-4 text-xs leading-relaxed ${subTextClass} ${config.viewport === "mobile" ? "mx-auto max-w-xs" : "max-w-xs"}`}
              >
                Discover the new collection. Sustainable materials meets modern
                design.
              </motion.p>
              <motion.button
                layout
                className={`rounded-full px-6 py-2 text-xs font-semibold transition-colors ${
                  isDark ? "bg-white text-slate-900" : "bg-slate-900 text-white"
                }`}
              >
                Shop Now
              </motion.button>
            </div>

            <div
              className={`${config.viewport === "mobile" ? "order-1" : "order-2"}`}
            >
              <motion.div
                layout
                className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-100"
              >
                {products[0] && (
                  <img
                    src={products[0].image}
                    alt="Hero"
                    className="h-full w-full object-contain p-4 mix-blend-multiply"
                  />
                )}
              </motion.div>
            </div>
          </div>

          {/* Product Grid - Compact */}
          <div className={`border-t ${borderClass} pt-6 pb-8`}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className={`text-sm font-bold ${textClass}`}>
                Featured Products
              </h3>
              <span className={`text-[10px] ${subTextClass}`}>View All</span>
            </div>

            <div
              className={`grid gap-4 ${config.viewport === "mobile" ? "grid-cols-2" : "grid-cols-3"}`}
            >
              {products
                .slice(0, config.viewport === "mobile" ? 2 : 3)
                .map((item, i) => (
                  <motion.div key={i} layout className="group cursor-pointer">
                    <div className="mb-2 aspect-[4/5] w-full overflow-hidden rounded-lg bg-white p-4">
                      <img
                        src={item.image}
                        className="h-full w-full object-contain"
                        alt={item.title}
                      />
                    </div>
                    <div className="space-y-0.5">
                      <div
                        className={`truncate text-xs font-medium ${textClass}`}
                      >
                        {item.title}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className={`text-[10px] font-bold ${textClass}`}>
                          NPR {item.price}
                        </div>
                        {config.plugins.reviews && (
                          <div className="flex text-amber-400">
                            <Star size={8} fill="currentColor" />
                            <Star size={8} fill="currentColor" />
                            <Star size={8} fill="currentColor" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              {products.length === 0 &&
                [1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="aspect-[4/5] animate-pulse rounded-lg bg-slate-100"
                  ></div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Plugin Widget */}
      <AnimatePresence>
        {config.plugins.chat && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute right-4 bottom-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg"
          >
            <MessageCircle size={20} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const DesignAnimation = () => {
  // Config State
  const [config, setConfig] = useState<WebsiteState>({
    brandName: "Lumina",
    logo: "minimal",
    font: "sans",
    theme: "light",
    viewport: "desktop",
    plugins: { reviews: false, chat: false },
  });

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Cursor State
  // Initial position off-screen or safe spot
  const [cursor, setCursor] = useState({ x: 50, y: 150, active: false });

  // Automation Loop
  useEffect(() => {
    let isActive = true;

    const sequence = async () => {
      const wait = (ms: number) =>
        new Promise(resolve => setTimeout(resolve, ms));

      // Coordinate System (Relative to Container Top-Left)
      // Sidebar Width: 256px
      // Header Height: ~55px

      const COORDS = {
        VIEWPORT_MOBILE: { x: 142, y: 23 },
        VIEWPORT_TABLET: { x: 178, y: 23 },
        VIEWPORT_DESKTOP: { x: 194, y: 23 },
        THEME_DARK: { x: 154, y: 95 },
        THEME_LIGHT: { x: 42, y: 95 },
        FONT_INPUT: { x: 198, y: 166 },
        FONT_OPTION_SERIF: { x: 198, y: 224 },
        LOGO_INPUT: { x: 198, y: 240 },
        LOGO_OPTION_GEO: { x: 198, y: 297 },
        PLUGIN_CHAT: { x: 186, y: 356 },
      };

      const reset = () => {
        if (!isActive) return;
        setConfig({
          brandName: "Lumina",
          logo: "minimal",
          font: "sans",
          theme: "light",
          viewport: "desktop",
          plugins: { reviews: false, chat: false },
        });
        setActiveDropdown(null);
        setCursor({ x: 50, y: 50, active: false });
      };

      while (isActive) {
        reset();
        await wait(1000);

        // 1. Switch to Dark Mode
        setCursor({ ...COORDS.THEME_DARK, active: false });
        await wait(800);
        setCursor(prev => ({ ...prev, active: true })); // Click
        await wait(150);
        setConfig(prev => ({ ...prev, theme: "dark" }));
        setCursor(prev => ({ ...prev, active: false }));
        await wait(1000);

        // 2. Switch Viewport to Mobile
        setCursor({ ...COORDS.VIEWPORT_MOBILE, active: false });
        await wait(800);
        setCursor(prev => ({ ...prev, active: true }));
        await wait(150);
        setConfig(prev => ({ ...prev, viewport: "mobile" }));
        setCursor(prev => ({ ...prev, active: false }));
        await wait(1200);

        // 3. Change Typography (Dropdown)
        setCursor({ ...COORDS.FONT_INPUT, active: false });
        await wait(800);
        setCursor(prev => ({ ...prev, active: true }));
        await wait(100);
        setActiveDropdown("font"); // Open Dropdown
        setCursor(prev => ({ ...prev, active: false }));
        await wait(300);

        // Select Serif Option
        setCursor({ ...COORDS.FONT_OPTION_SERIF, active: false });
        await wait(500);
        setCursor(prev => ({ ...prev, active: true }));
        await wait(150);
        setConfig(prev => ({ ...prev, font: "serif" }));
        setActiveDropdown(null); // Close
        setCursor(prev => ({ ...prev, active: false }));
        await wait(1200);

        // 4. Enable Chat Plugin
        setCursor({ ...COORDS.PLUGIN_CHAT, active: false });
        await wait(800);
        setCursor(prev => ({ ...prev, active: true }));
        await wait(150);
        setConfig(prev => ({
          ...prev,
          plugins: { ...prev.plugins, chat: true },
        }));
        setCursor(prev => ({ ...prev, active: false }));
        await wait(800);

        // 5. Switch to Tablet
        setCursor({ ...COORDS.VIEWPORT_TABLET, active: false });
        await wait(600);
        setCursor(prev => ({ ...prev, active: true }));
        await wait(150);
        setConfig(prev => ({ ...prev, viewport: "tablet" }));
        setCursor(prev => ({ ...prev, active: false }));
        await wait(1000);

        // 6. Change Brand (Dropdown)
        setCursor({ ...COORDS.LOGO_INPUT, active: false });
        await wait(800);
        setCursor(prev => ({ ...prev, active: true }));
        await wait(100);
        setActiveDropdown("logo");
        setCursor(prev => ({ ...prev, active: false }));
        await wait(300);

        // Select Geometric Option
        setCursor({ ...COORDS.LOGO_OPTION_GEO, active: false });
        await wait(500);
        setCursor(prev => ({ ...prev, active: true }));
        await wait(150);
        setConfig(prev => ({ ...prev, logo: "geometric" }));
        setActiveDropdown(null);
        setCursor(prev => ({ ...prev, active: false }));
        await wait(1200);

        // 7. Back to Desktop & Reset
        setCursor({ ...COORDS.VIEWPORT_DESKTOP, active: false });
        await wait(600);
        setCursor(prev => ({ ...prev, active: true }));
        await wait(150);
        setConfig(prev => ({ ...prev, viewport: "desktop", theme: "light" }));
        setCursor(prev => ({ ...prev, active: false }));
        await wait(2000);
      }
    };

    sequence();
    return () => {
      isActive = false;
    };
  }, []);

  const ControlSelect = ({
    id,
    label,
    value,
    options,
    icon: Icon,
  }: {
    id: string;
    label: string;
    value: string;
    options: { label: string; value: string; icon?: any }[];
    icon: any;
  }) => {
    const isOpen = activeDropdown === id;
    const selectedOption = options.find(o => o.value === value);

    return (
      <div className="relative">
        <div
          className={`py- flex w-full items-center justify-between rounded-md border bg-white px-3 text-xs font-medium transition-all ${
            isOpen
              ? "border-indigo-500 ring-1 ring-indigo-500"
              : "border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2 text-slate-700">
            {Icon && <Icon size={14} className="text-slate-400" />}
            <span>{selectedOption?.label}</span>
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </div>

        {/* Fake Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute top-full right-0 left-0 z-50 mt-1 rounded-md border border-slate-100 bg-white p-1 shadow-xl"
            >
              {options.map(opt => (
                <div
                  key={opt.value}
                  className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-xs font-medium ${
                    opt.value === value
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {opt.icon && <opt.icon size={12} />}
                  {opt.label}
                  {opt.value === value && (
                    <Check size={12} className="ml-auto" />
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="relative flex h-[500px] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 font-sans shadow-sm">
      {/* Virtual Cursor */}
      <motion.div
        className="pointer-events-none absolute top-0 left-0 z-[100] drop-shadow-xl"
        animate={{
          x: cursor.x,
          y: cursor.y,
          scale: cursor.active ? 0.9 : 1,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 250,
          mass: 0.6,
        }}
      >
        <MousePointer2 className="fill-slate-900 text-slate-50" size={24} />
      </motion.div>

      {/* LEFT: Editor Dashboard */}
      <div className="relative z-10 flex w-64 flex-shrink-0 flex-col border-r border-slate-200 bg-white">
        {/* Sidebar Header with Viewport Controls */}
        <div className="border-b border-slate-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layout size={16} className="text-slate-900" />
              <span className="text-sm font-bold text-slate-900">Editor</span>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
              <div
                className={`rounded p-1 ${config.viewport === "mobile" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}
              >
                <Smartphone size={14} />
              </div>
              <div
                className={`rounded p-1 ${config.viewport === "tablet" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}
              >
                <Tablet size={14} />
              </div>
              <div
                className={`rounded p-1 ${config.viewport === "desktop" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}
              >
                <Monitor size={14} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-4">
          {/* Theme Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
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

          {/* Typography Section (Select Style) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
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

          {/* Branding Section (Select Style) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
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

          {/* Plugins Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              <Zap size={12} />
              <span>Plugins</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-md border border-slate-100 p-2">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <Star size={14} className="text-amber-400" />
                  <span>Reviews</span>
                </div>
                {/* Fake Switch */}
                <div
                  className={`h-4 w-7 rounded-full p-0.5 transition-colors ${config.plugins.reviews ? "bg-indigo-500" : "bg-slate-200"}`}
                >
                  <div
                    className={`h-3 w-3 rounded-full bg-white transition-transform ${config.plugins.reviews ? "translate-x-3" : "translate-x-0"}`}
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
                    className={`h-3 w-3 rounded-full bg-white transition-transform ${config.plugins.chat ? "translate-x-3" : "translate-x-0"}`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Website Preview Area */}
      <div className="relative flex flex-1 items-start justify-center overflow-hidden bg-slate-100/50 p-4 lg:p-6">
        {/* Grid Background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        ></div>

        <WebsitePreview config={config} />
      </div>
    </div>
  );
};
