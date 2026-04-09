"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  Globe,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  ExternalLink,
  DollarSign,
  Briefcase,
} from "lucide-react";

export function PartnersVisualMock() {
  return (
    <div className="relative mx-auto aspect-video w-full max-w-4xl md:aspect-[16/9]">
      {/* Background Glow */}
      <div className="bg-primary/5 absolute inset-0 rounded-[40px] blur-3xl" />

      {/* Main Dashboard Interface */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative flex h-120 w-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white -2xl"
      >
        {/* Sidebar + Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="flex w-16 flex-col gap-6 border-r border-slate-100 bg-slate-50/50 p-4 md:w-52">
            <div className="flex items-center gap-3">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg text-white">
                <Briefcase className="h-4 w-4" />
              </div>
              <div className="Nepdora Learn-tight hidden text-sm font-black text-slate-900 md:block">
                Nepdora
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              {[
                { icon: Globe, label: "Clients", active: true },
                { icon: TrendingUp, label: "Earnings", active: false },
                { icon: Users, label: "Team", active: false },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 rounded-xl p-3 transition-colors ${item.active ? "text-primary border border-slate-100 bg-white -sm" : "text-slate-400 hover:bg-slate-100"}`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="hidden text-xs font-bold md:block">
                    {item.label}
                  </span>
                </div>
              ))}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto bg-white p-5">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="Nepdora Learn-tight text-xl font-black text-slate-900">
                  Client Projects
                </h3>
                <p className="Nepdora Learn Nepdora Learn-widest mt-0.5 text-[10px] font-bold text-slate-400">
                  Manage your agency workflow
                </p>
              </div>
              <button className="bg-primary -primary/20 Nepdora Learn Nepdora Learn-widest flex items-center gap-2 rounded-lg px-4 py-2 text-[10px] font-black text-white -lg transition-all hover:scale-105">
                <Plus className="h-3 w-3" />
                <span className="hidden sm:inline">New Client</span>
              </button>
            </div>

            {/* Stats Grid */}
            <div className="mb-6 grid grid-cols-3 gap-3">
              {[
                {
                  label: "Total",
                  value: "124.5K",
                  icon: DollarSign,
                  color: "text-emerald-500",
                },
                {
                  label: "Active",
                  value: "12",
                  icon: Globe,
                  color: "text-blue-500",
                },
                {
                  label: "Growth",
                  value: "+24%",
                  icon: TrendingUp,
                  color: "text-primary",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div
                      className={`rounded-md bg-white p-1.5 -sm ${stat.color}`}
                    >
                      <stat.icon className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <div className="Nepdora Learn Nepdora Learn-widest mb-0.5 text-[10px] font-bold text-slate-400">
                    {stat.label}
                  </div>
                  <div className="text-sm font-black text-slate-900">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Client List */}
            <div className="space-y-2">
              {[
                {
                  name: "Everest Coffee Co.",
                  status: "Live",
                  plan: "Pro",
                  date: "2d ago",
                },
                {
                  name: "Kathmandu Boutique",
                  status: "In Progress",
                  plan: "Business",
                  date: "5d ago",
                },
                {
                  name: "Pokhara Travels",
                  status: "Live",
                  plan: "Basic",
                  date: "1w ago",
                },
                {
                  name: "Annapurna Lodge",
                  status: "Live",
                  plan: "Pro",
                  date: "2w ago",
                },
              ].map((client, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i}
                  className="hover:border-primary/20 hover:-primary/5 group flex items-center justify-between rounded-xl border border-slate-100 p-3 transition-all hover:-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="group-hover:bg-primary/10 group-hover:text-primary flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition-colors">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-[12px] font-bold text-slate-900">
                        {client.name}
                      </div>
                      <div className="Nepdora Learn Nepdora Learn-widest text-[9px] font-bold text-slate-400">
                        {client.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden md:block">
                      <span className="Nepdora Learn Nepdora Learn-widest rounded-full bg-slate-100 px-2.5 py-0.5 text-[9px] font-bold text-slate-500">
                        {client.plan}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${client.status === "Live" ? "bg-emerald-500" : "bg-amber-500"}`}
                      />
                      <span className="Nepdora Learn Nepdora Learn-widest text-[9px] font-bold text-slate-600">
                        {client.status}
                      </span>
                    </div>
                    <button className="p-1 text-slate-300 transition-colors hover:text-slate-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Interaction Elements */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] -right-4 z-20 flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 -2xl"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div>
          <div className="Nepdora Learn text-[8px] font-black text-slate-400">
            Payout
          </div>
          <div className="text-[12px] font-black text-slate-900">
            Verified & Ready
          </div>
        </div>
      </motion.div>
    </div>
  );
}
