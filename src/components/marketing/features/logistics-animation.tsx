"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  AnimatePresence,
  motion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Truck,
  CheckCircle,
  Store,
  Plane,
  User,
  Building2,
  Container,
} from "lucide-react";
import { OrderParticle } from "./order-particle";
import { LogEntry, Order } from "./types";

function NumberTicker({ value }: { value: number }) {
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, current =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

export const LogisticsAnimation: React.FC = () => {
  const [revenue, setRevenue] = useState(12450);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, text: "System Online: Routing Active", type: "info" },
  ]);
  const [orders, setOrders] = useState<Order[]>([]);

  const addLog = useCallback(
    (text: string, type: "info" | "success" = "info") => {
      setLogs(prev => {
        const newLogs = [
          { id: Date.now() + Math.random(), text, type },
          ...prev,
        ];
        return newLogs.slice(0, 3);
      });
    },
    []
  );

  const handleComplete = useCallback(
    (id: number, route: "express" | "standard") => {
      const earnedAmount = route === "express" ? 145 : 85;
      setRevenue(prev => prev + earnedAmount);
      setOrders(prev => prev.filter(o => o.id !== id));
    },
    []
  );

  useEffect(() => {
    setOrders([{ id: Date.now(), route: "express" }]);

    const interval = setInterval(() => {
      if (document.hidden) return;
      const id = Date.now();
      const route = Math.random() > 0.5 ? "express" : "standard";
      setOrders(prev => {
        if (prev.length > 4) return prev;
        return [...prev, { id, route }];
      });
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-6 select-none">
      {/* Top Bar */}
      <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          </div>
          <span className="text-[10px] font-bold tracking-wide text-slate-600 uppercase sm:text-xs">
            Live Operations
          </span>
        </div>
        <div className="text-right">
          <div className="text-[9px] font-semibold text-slate-400 uppercase sm:text-[10px]">
            Total Revenue
          </div>
          <div className="font-mono text-sm font-bold text-slate-900 transition-all duration-300 sm:text-base">
            NPR <NumberTicker value={revenue} />
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="relative min-h-[200px] w-full flex-1">
        {/* Connecting Lines (SVG) */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 400 260"
          preserveAspectRatio="none"
        >
          <path
            d="M 40 130 C 100 130, 100 60, 140 60 L 260 60 C 300 60, 300 130, 360 130"
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeDasharray="4 4"
            fill="none"
            className="opacity-30"
          />
          <path
            d="M 40 130 C 100 130, 100 200, 140 200 L 260 200 C 300 200, 300 130, 360 130"
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeDasharray="4 4"
            fill="none"
            className="opacity-30"
          />
        </svg>

        {/* Start: Store */}
        <div className="absolute top-1/2 left-[10%] z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-md sm:h-12 sm:w-12">
              <Store size={20} className="text-slate-700" />
            </div>
            <div className="hidden text-[10px] font-bold text-slate-600 sm:block">
              Store
            </div>
          </div>
        </div>

        {/* FastShip */}
        <div className="absolute top-[23%] left-[35%] z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 shadow-sm">
              <Building2 size={16} className="text-blue-600" />
            </div>
            <div className="rounded border border-slate-100 bg-white px-1.5 py-0.5 text-[8px] font-bold whitespace-nowrap text-blue-600 shadow-sm">
              FastShip LLC
            </div>
          </div>
        </div>

        {/* EcoLogistics */}
        <div className="absolute top-[77%] left-[35%] z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 shadow-sm">
              <Container size={16} className="text-emerald-600" />
            </div>
            <div className="rounded border border-slate-100 bg-white px-1.5 py-0.5 text-[8px] font-bold whitespace-nowrap text-emerald-600 shadow-sm">
              EcoLogistics
            </div>
          </div>
        </div>

        {/* Air Hub */}
        <div className="absolute top-[23%] left-[65%] z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 shadow-sm">
              <Plane size={18} className="text-indigo-600" />
            </div>
            <div className="rounded border border-slate-100 bg-white px-1.5 py-0.5 text-[8px] font-bold whitespace-nowrap text-indigo-600 shadow-sm">
              Int'l Air Hub
            </div>
          </div>
        </div>

        {/* Ground Hub */}
        <div className="absolute top-[77%] left-[65%] z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-100 bg-orange-50 shadow-sm">
              <Truck size={18} className="text-orange-600" />
            </div>
            <div className="rounded border border-slate-100 bg-white px-1.5 py-0.5 text-[8px] font-bold whitespace-nowrap text-orange-600 shadow-sm">
              Ground Fleet
            </div>
          </div>
        </div>

        {/* Customer */}
        <div className="absolute top-1/2 left-[90%] z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-100 bg-purple-50 shadow-md sm:h-12 sm:w-12">
              <User size={20} className="text-purple-600" />
            </div>
            <div className="hidden text-[10px] font-bold text-purple-700 sm:block">
              Customer
            </div>
          </div>
        </div>

        {/* Active Orders */}
        <AnimatePresence>
          {orders.map(order => (
            <OrderParticle
              key={order.id}
              route={order.route}
              onLog={addLog}
              onComplete={() => handleComplete(order.id, order.route)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Activity Log */}
      <div className="mt-2 min-h-[60px] border-t border-slate-100 pt-3">
        <div className="space-y-1.5">
          <AnimatePresence mode="popLayout">
            {logs.map(log => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-[10px]"
              >
                <CheckCircle
                  size={10}
                  className={
                    log.type === "success"
                      ? "text-emerald-500"
                      : "text-slate-400"
                  }
                />
                <span className="truncate font-medium text-slate-600">
                  {log.text}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
