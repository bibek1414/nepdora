"use client";

import { useState, useEffect } from "react";
import { TrendingUp, CreditCard } from "lucide-react";

const stats = [
  { label: "Revenue", value: "NPR 2.4M", change: "+23%" },
  { label: "Orders", value: "1,247", change: "+18%" },
  { label: "Customers", value: "892", change: "+31%" },
];

const bars = [40, 65, 45, 80, 60, 90, 75, 85, 70, 95, 80, 100];

const recentOrders = [
  {
    name: "Ramesh Sharma",
    product: "Blue Kurta",
    amount: "NPR 2,500",
    paid: true,
  },
  {
    name: "Sita Thapa",
    product: "Wedding Set",
    amount: "NPR 8,200",
    paid: false,
  },
];

export function AnimatedDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative select-none">
      {/* Browser card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/80">
        {/* Chrome bar */}
        <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">
          <div className="flex shrink-0 gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex-1">
            <div className="rounded-md border border-slate-200 bg-white px-3 py-1 font-mono text-[11px] text-slate-400">
              dashboard.nepdora.com
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Business Overview
              </p>
              <p className="text-[11px] text-slate-400">Last 30 days</p>
            </div>
            <span className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white">
              + Add Product
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {stats.map(s => (
              <div key={s.label} className="rounded-xl bg-slate-50 px-3 py-2.5">
                <p className="mb-0.5 text-[10px] text-slate-400">{s.label}</p>
                <p className="text-xs font-bold text-slate-900">{s.value}</p>
                <p className="text-[10px] font-semibold text-emerald-500">
                  {s.change}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-100 p-3.5">
            <p className="mb-3 text-[11px] font-medium text-slate-500">
              Monthly Revenue
            </p>
            <div className="flex h-12 items-end gap-[3px]">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-indigo-500 transition-all duration-700"
                  style={{
                    height: mounted ? `${h}%` : "0%",
                    transitionDelay: `${i * 55}ms`,
                    opacity: 0.35 + (h / 100) * 0.65,
                  }}
                />
              ))}
            </div>
            <div className="mt-1.5 flex justify-between">
              <span className="text-[9px] text-slate-400">Jan</span>
              <span className="text-[9px] text-slate-400">Jun</span>
              <span className="text-[9px] text-slate-400">Dec</span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-medium text-slate-500">
              Recent Orders
            </p>
            {recentOrders.map((order, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-slate-50 py-1.5 last:border-0"
              >
                <div>
                  <p className="text-[11px] font-medium text-slate-800">
                    {order.name}
                  </p>
                  <p className="text-[10px] text-slate-400">{order.product}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-semibold text-slate-800">
                    {order.amount}
                  </p>
                  <p
                    className={`text-[10px] font-medium ${order.paid ? "text-emerald-500" : "text-amber-500"}`}
                  >
                    {order.paid ? "Paid" : "Pending"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating pop-ups */}
      <div
        className="absolute top-1/3 -left-5 flex items-center gap-2.5 rounded-xl border border-slate-100 bg-white p-3 shadow-xl transition-all duration-1000"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateX(0)" : "translateX(-12px)",
        }}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-900">+47% Sales</p>
          <p className="text-[10px] text-slate-400">This month</p>
        </div>
      </div>

      <div
        className="absolute -right-5 bottom-24 flex items-center gap-2.5 rounded-xl border border-slate-100 bg-white p-3 shadow-xl transition-all delay-300 duration-1000"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateX(0)" : "translateX(12px)",
        }}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-50">
          <CreditCard className="h-4 w-4 text-violet-600" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-900">eSewa Ready</p>
          <p className="text-[10px] text-slate-400">Connected</p>
        </div>
      </div>
    </div>
  );
}
