"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Calendar, User, Bell } from "lucide-react";

const UseCases: React.FC = () => {
  const [orders, setOrders] = useState<
    { id: number; amt: string; time: string }[]
  >([]);
  const [inquiries, setInquiries] = useState<
    { id: number; name: string; type: string }[]
  >([]);

  useEffect(() => {
    const orderInterval = setInterval(() => {
      const newOrder = {
        id: Date.now(),
        amt: `NPR ${(Math.floor(Math.random() * 50) + 10) * 100}`,
        time: "Just now",
      };
      setOrders(prev => [newOrder, ...prev].slice(0, 3));
    }, 4000);

    const inquiryInterval = setInterval(() => {
      const names = ["Sarah M.", "John D.", "Priya K.", "Alex R."];
      const types = ["Booking Request", "Project Quote", "Consultation"];
      const newInquiry = {
        id: Date.now(),
        name: names[Math.floor(Math.random() * names.length)],
        type: types[Math.floor(Math.random() * types.length)],
      };
      setInquiries(prev => [newInquiry, ...prev].slice(0, 3));
    }, 5000);

    return () => {
      clearInterval(orderInterval);
      clearInterval(inquiryInterval);
    };
  }, []);

  return (
    <section className="border-border bg-background border-t py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-foreground mb-4 text-3xl leading-tight font-bold md:text-5xl">
            Built for{" "}
            <span className="text-muted-foreground font-serif italic">
              your
            </span>{" "}
            business type.
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            Whether you ship products or sell time, we have the tools.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Ecommerce Card */}
          <div className="border-border bg-muted/20 rounded-3xl border p-8 transition-all duration-300 hover:shadow-lg md:p-12">
            <div className="mb-8 flex items-start justify-between">
              <div className="border-border bg-background flex h-12 w-12 items-center justify-center rounded-xl border shadow-sm">
                <ShoppingBag className="text-foreground" size={20} />
              </div>
              <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-[10px] font-bold tracking-wide uppercase">
                Active Store
              </div>
            </div>

            <h3 className="text-foreground mb-3 text-2xl font-bold">
              Product Sales
            </h3>
            <p className="text-muted-foreground mb-10 text-base leading-relaxed">
              Global logistics, inventory sync, and automated tax calculations
              built-in.
            </p>

            <div className="border-border bg-background min-h-[160px] rounded-xl border p-5 shadow-sm">
              <div className="text-muted-foreground mb-4 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                <Bell size={12} /> Real-time Sales
              </div>
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {orders.map(order => (
                    <motion.div
                      key={order.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary h-1.5 w-1.5 rounded-full"></div>
                        <div className="text-foreground text-sm font-medium">
                          New Order
                        </div>
                      </div>
                      <div className="text-muted-foreground font-mono text-sm">
                        {order.amt}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {orders.length === 0 && (
                  <div className="text-muted-foreground text-sm">
                    Waiting for orders...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Service Business Card */}
          <div className="border-border bg-background rounded-3xl border p-8 transition-all duration-300 hover:shadow-lg md:p-12">
            <div className="mb-8 flex items-start justify-between">
              <div className="border-border bg-muted/20 flex h-12 w-12 items-center justify-center rounded-xl border shadow-sm">
                <Calendar className="text-foreground" size={20} />
              </div>
              <div className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-[10px] font-bold tracking-wide uppercase">
                Booking System
              </div>
            </div>

            <h3 className="text-foreground mb-3 text-2xl font-bold">
              Service & Portfolio
            </h3>
            <p className="text-muted-foreground mb-10 text-base leading-relaxed">
              Integrated scheduling, client CRM, and portfolio galleries to
              convert visitors.
            </p>

            <div className="border-border bg-muted/20 min-h-[160px] rounded-xl border p-5 shadow-inner">
              <div className="text-muted-foreground mb-4 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                <User size={12} /> Client Inquiries
              </div>
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {inquiries.map(inq => (
                    <motion.div
                      key={inq.id}
                      layout
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="border-border bg-background flex items-center gap-3 rounded-lg border p-2.5 shadow-sm"
                    >
                      <div className="bg-muted text-muted-foreground flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold">
                        {inq.name.charAt(0)}
                      </div>
                      <div className="flex flex-1 items-center justify-between">
                        <span className="text-foreground text-sm font-semibold">
                          {inq.name}
                        </span>
                        <span className="border-border text-muted-foreground rounded border px-1.5 text-[10px]">
                          {inq.type}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {inquiries.length === 0 && (
                  <div className="text-muted-foreground text-sm">
                    No new inquiries
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
