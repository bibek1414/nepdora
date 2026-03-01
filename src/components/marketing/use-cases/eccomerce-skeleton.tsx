"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  TrendingUp,
  Search,
  User,
  Check,
  ShoppingCart,
  MousePointer2,
} from "lucide-react";

const EcommerceSkeleton: React.FC = () => {
  const [step, setStep] = useState(0); // 0: Product Page, 1: Checkout, 2: Merchant Dashboard

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(prev => (prev + 1) % 3);
    }, 5000); // Cycle through steps
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-full w-full cursor-none overflow-hidden bg-slate-50 font-sans">
      {/* Browser Header */}
      <div className="relative z-10 flex h-8 items-center gap-2 border-b border-slate-200 bg-white px-3 shadow-sm">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400/80"></div>
          <div className="bg-primary/80 h-2.5 w-2.5 rounded-full"></div>
          <div className="h-2.5 w-2.5 rounded-full bg-green-400/80"></div>
        </div>
        <div className="ml-2 flex flex-1 items-center justify-between rounded-md bg-slate-100 px-3 py-1 text-[10px] text-slate-500">
          <span className="truncate">
            nepdora.myshop.com.np/
            {step === 2 ? "admin/dashboard" : "product/backpack"}
          </span>
          <div className="h-1.5 w-1.5 rounded-full bg-slate-300"></div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative h-full w-full bg-white">
        <AnimatePresence mode="wait">
          {/* SCENE 1: REALISTIC PRODUCT PAGE */}
          {step === 0 && (
            <motion.div
              key="product"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative flex h-full flex-col"
            >
              {/* Nav */}
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2">
                <div className="text-primary text-xs font-bold">
                  NEPAL CRAFTS
                </div>
                <div className="flex gap-2 text-slate-400">
                  <Search size={12} />
                  <ShoppingCart size={12} />
                </div>
              </div>

              <div className="flex gap-4 p-4">
                {/* Product Image */}
                <div className="relative aspect-square w-1/3 overflow-hidden rounded-lg bg-slate-100 shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=300&auto=format&fit=crop"
                    alt="Himalayan Hemp Backpack"
                    className="h-full w-full object-cover"
                  />
                  {/* Tag */}
                  <div className="bg-primary absolute top-1 left-1 rounded px-1.5 py-0.5 text-[8px] font-bold text-white shadow-sm">
                    SALE
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Himalayan Hemp Backpack
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      Handmade in Pokhara
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-primary text-sm font-bold">
                      NPR 1,500
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">
                      NPR 2,200
                    </span>
                  </div>

                  <div className="flex gap-1 py-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div
                        key={i}
                        className="bg-primary h-1.5 w-1.5 rounded-full"
                      ></div>
                    ))}
                    <span className="ml-1 text-[8px] text-slate-500">
                      (42 reviews)
                    </span>
                  </div>

                  <motion.button
                    animate={step === 0 ? { scale: [1, 0.95, 1] } : {}}
                    transition={{ delay: 1.8, duration: 0.2 }}
                    className="bg-primary w-full rounded py-1.5 text-[10px] font-medium text-white shadow-lg"
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </div>

              {/* Toast Animation - Moved Higher & More Prominent */}
              <motion.div
                initial={{ y: 20, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{
                  delay: 2,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className="border-primary absolute right-4 bottom-16 left-4 z-20 mx-auto flex max-w-[90%] items-center gap-3 rounded-lg border-l-4 bg-white p-3 shadow-xl"
              >
                <div className="bg-primary/10 rounded-full p-1">
                  <Check size={10} className="text-primary" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-800">
                    Added to cart!
                  </div>
                  <div className="text-[8px] text-slate-500">
                    Ready for checkout
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* SCENE 2: CHECKOUT */}
          {step === 1 && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="h-full bg-slate-50 p-4"
            >
              <div className="mx-auto max-w-[240px] rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-semibold text-slate-700">
                    Checkout
                  </span>
                  <span className="text-[10px] font-bold text-slate-900">
                    NPR 1,500
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-[8px] font-medium text-slate-500">
                      Full Name
                    </label>
                    <div className="flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-2 py-1">
                      <User size={10} className="text-slate-400" />
                      <span className="text-[10px] text-slate-900">
                        Bibek Thapa
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-medium text-slate-500">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="border-primary/20 bg-primary/10 hover:bg-primary/20 cursor-pointer rounded border py-1.5 text-center transition-colors">
                        <span className="text-primary text-[9px] font-bold">
                          eSewa
                        </span>
                      </div>
                      <div className="border-primary/20 bg-primary/10 hover:bg-primary/20 cursor-pointer rounded border py-1.5 text-center transition-colors">
                        <span className="text-primary text-[9px] font-bold">
                          Fonepay
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1, scale: [1, 1.02, 1] }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                  className="bg-primary mt-4 w-full rounded py-1.5 text-[10px] font-bold text-white shadow-md"
                >
                  Confirm Payment
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* SCENE 3: ADMIN DASHBOARD (Analytics) - LIGHT THEME */}
          {step === 2 && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex h-full flex-col bg-slate-50 text-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-2">
                <span className="text-[10px] font-bold text-slate-700">
                  ADMIN DASHBOARD
                </span>
                <div className="flex gap-1.5">
                  <div className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full"></div>
                  <span className="text-primary text-[8px] font-medium">
                    Live
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3">
                <div className="rounded border border-slate-200 bg-white p-2 shadow-sm">
                  <div className="text-[8px] text-slate-500">Total Revenue</div>
                  <div className="flex items-end gap-1">
                    <span className="text-primary text-sm font-bold">
                      NPR 45k
                    </span>
                    <TrendingUp size={10} className="text-primary mb-0.5" />
                  </div>
                </div>
                <div className="rounded border border-slate-200 bg-white p-2 shadow-sm">
                  <div className="text-[8px] text-slate-500">Active Carts</div>
                  <div className="text-primary text-sm font-bold">12</div>
                </div>
              </div>

              <div className="flex-1 overflow-hidden px-3">
                <div className="mb-2 text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                  Real-time Feed
                </div>
                <div className="space-y-2">
                  {/* Previous Order */}
                  <div className="flex items-start gap-2 rounded border border-slate-100 bg-white p-2 opacity-60">
                    <div className="rounded bg-slate-100 p-1">
                      <ShoppingBag size={8} className="text-slate-400" />
                    </div>
                    <div>
                      <div className="text-[9px] font-medium text-slate-600">
                        Order #1023 - Rita K.
                      </div>
                      <div className="text-[8px] text-slate-400">
                        2 mins ago • NPR 850
                      </div>
                    </div>
                  </div>

                  {/* New Order Animation */}
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="border-primary flex items-start gap-2 rounded border-l-2 bg-white p-2 shadow-sm"
                  >
                    <div className="bg-primary/10 rounded p-1">
                      <Check size={8} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-[9px] font-bold text-slate-900">
                          Order #1024 - Bibek T.
                        </span>
                        <span className="text-primary text-[8px] font-medium">
                          Just now
                        </span>
                      </div>
                      <div className="mt-0.5 flex justify-between">
                        <span className="text-[8px] text-slate-500">
                          Hemp Backpack
                        </span>
                        <span className="text-primary text-[8px] font-bold">
                          + NPR 1,500
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EcommerceSkeleton;
