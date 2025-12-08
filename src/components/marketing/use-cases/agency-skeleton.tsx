"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Users,
  MessageSquare,
  Kanban,
  Star,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  MousePointer2,
} from "lucide-react";

const AgencySkeleton: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0); // 0: Inquiries, 1: CMS/Client, 2: Kanban

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab(prev => (prev + 1) % 3);
    }, 5000); // 5s rotation
    return () => clearInterval(timer);
  }, []);

  // For Kanban Animation
  const [taskStatus, setTaskStatus] = useState<"todo" | "progress">("todo");

  // Reset kanban state when tab becomes 2
  useEffect(() => {
    if (activeTab === 2) {
      setTaskStatus("todo");
      const timeout = setTimeout(() => {
        setTaskStatus("progress");
      }, 2000); // Wait 2s before moving
      return () => clearTimeout(timeout);
    }
  }, [activeTab]);

  return (
    <div className="relative flex h-full w-full cursor-none overflow-hidden bg-white font-sans text-slate-600">
      {/* Sidebar */}
      <div className="z-10 flex w-12 flex-col items-center gap-4 border-r border-slate-100 bg-slate-50 py-4">
        <div className="bg-primary flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold text-white">
          A
        </div>
        <div className="mt-2 flex w-full flex-col gap-3 px-2">
          <div
            className={`flex justify-center rounded py-2 transition-colors ${activeTab === 0 ? "text-primary bg-primary/10 shadow-sm" : "text-slate-400"}`}
          >
            <MessageSquare size={14} />
          </div>
          <div
            className={`flex justify-center rounded py-2 transition-colors ${activeTab === 1 ? "text-primary bg-primary/10 shadow-sm" : "text-slate-400"}`}
          >
            <Users size={14} />
          </div>
          <div
            className={`flex justify-center rounded py-2 transition-colors ${activeTab === 2 ? "text-primary bg-primary/10 shadow-sm" : "text-slate-400"}`}
          >
            <Kanban size={14} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative flex flex-1 flex-col bg-white">
        {/* Header */}
        <div className="flex h-10 items-center justify-between border-b border-slate-100 px-4">
          <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            {activeTab === 0
              ? "Inquiries & Reviews"
              : activeTab === 1
                ? "Client CMS"
                : "Project Board"}
          </span>
          <div className="border-primary bg-primary/10 flex items-center gap-1.5 rounded-full border px-2 py-0.5">
            <div className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full"></div>
            <span className="text-primary text-[9px] font-medium">
              Agency OS
            </span>
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden bg-slate-50/50 p-0">
          <AnimatePresence mode="wait">
            {/* SCENE 1: INQUIRIES & REVIEWS */}
            {activeTab === 0 && (
              <motion.div
                key="inquiries"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-3 p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800">
                    Recent Activity
                  </h3>
                  <span className="text-primary cursor-pointer text-[9px]">
                    View All
                  </span>
                </div>

                <div className="space-y-2.5">
                  {/* New Inquiry */}
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="border-primary/20 relative flex gap-3 rounded-lg border bg-white p-3 shadow-sm"
                  >
                    <div className="bg-primary absolute top-2 right-2 h-1.5 w-1.5 rounded-full"></div>
                    <div className="text-primary bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold">
                      R
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] font-bold text-slate-800">
                          Rohan K.
                        </span>
                        <span className="text-[8px] text-slate-400">
                          2m ago
                        </span>
                      </div>
                      <div className="mt-0.5 text-[9px] font-medium text-slate-600">
                        New Website Inquiry
                      </div>
                      <p className="mt-1 line-clamp-1 text-[8px] text-slate-400">
                        "Hi, I need a quote for an e-commerce site for my..."
                      </p>
                    </div>
                  </motion.div>

                  {/* Review */}
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-3 rounded-lg border border-slate-100 bg-white p-3 shadow-sm"
                  >
                    <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold">
                      S
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] font-bold text-slate-800">
                          Sita Sherpa
                        </span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(i => (
                            <Star
                              key={i}
                              size={8}
                              className="text-primary fill-primary"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="mt-0.5 text-[9px] font-medium text-slate-600">
                        Project Review
                      </div>
                      <p className="mt-1 text-[8px] text-slate-400">
                        "Excellent work on the portfolio!"
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* SCENE 2: CMS / CUSTOMER DETAILS */}
            {activeTab === 1 && (
              <motion.div
                key="cms"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex h-full flex-col"
              >
                {/* Client Header */}
                <div className="flex items-center gap-3 border-b border-slate-100 bg-white p-4">
                  <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold">
                    AG
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Anjali Gupta
                    </h3>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="text-primary bg-primary/10 rounded px-1.5 py-0.5 text-[8px] font-bold">
                        Active Client
                      </span>
                      <span className="text-[8px] text-slate-400">
                        anjali@business.np
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline / Activity */}
                <div className="relative flex-1 overflow-hidden p-4">
                  <div className="absolute top-4 bottom-4 left-6 w-0.5 bg-slate-200"></div>
                  <div className="relative z-10 space-y-4">
                    {/* Item 1 */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex gap-3"
                    >
                      <div className="bg-primary mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white shadow-sm">
                        <Mail size={8} className="text-white" />
                      </div>
                      <div className="flex-1 rounded border border-slate-100 bg-white p-2 shadow-sm">
                        <div className="flex justify-between">
                          <span className="text-[9px] font-bold text-slate-700">
                            Proposal Sent
                          </span>
                          <span className="text-[8px] text-slate-400">
                            Just now
                          </span>
                        </div>
                        <div className="mt-1 text-[8px] text-slate-500">
                          Sent "Website_Redesign_Proposal_v2.pdf"
                        </div>
                      </div>
                    </motion.div>

                    {/* Item 2 */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex gap-3"
                    >
                      <div className="bg-primary/20 mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white">
                        <Phone size={8} className="text-primary" />
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-slate-600">
                          Call Logged
                        </div>
                        <div className="text-[8px] text-slate-400">
                          Discussed requirements • 2h ago
                        </div>
                      </div>
                    </motion.div>

                    {/* Item 3 */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex gap-3"
                    >
                      <div className="bg-primary/20 mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white">
                        <Clock size={8} className="text-primary" />
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-slate-600">
                          Inquiry Received
                        </div>
                        <div className="text-[8px] text-slate-400">
                          Yesterday
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SCENE 3: KANBAN BOARD */}
            {activeTab === 2 && (
              <motion.div
                key="kanban"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="h-full bg-slate-50 p-3"
              >
                <LayoutGroup>
                  <div className="grid h-full grid-cols-2 gap-3">
                    {/* Column 1: To Do */}
                    <div className="flex flex-col gap-2 rounded-lg bg-slate-100/50 p-2">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-500 uppercase">
                          To Do
                        </span>
                        <span className="rounded-full bg-slate-200 px-1.5 text-[8px] font-bold text-slate-600">
                          2
                        </span>
                      </div>

                      {/* Static Card */}
                      <div className="rounded border border-slate-200 bg-white p-2 opacity-60 shadow-sm">
                        <div className="bg-primary/10 mb-1 h-1.5 w-8 rounded"></div>
                        <div className="mb-1 h-2 w-16 rounded bg-slate-200"></div>
                      </div>

                      {/* MOVING CARD - Origin */}
                      {taskStatus === "todo" && (
                        <motion.div
                          layoutId="card-move"
                          className="border-primary rounded border-l-2 bg-white p-2 shadow-sm"
                        >
                          <div className="mb-1 flex items-start justify-between">
                            <span className="text-[9px] font-bold text-slate-800">
                              Wireframe
                            </span>
                            <div className="h-3 w-3 rounded-full bg-slate-100"></div>
                          </div>
                          <div className="text-[8px] text-slate-500">
                            Client: Apex College
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Column 2: In Progress */}
                    <div className="flex flex-col gap-2 rounded-lg bg-slate-100/50 p-2">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-primary text-[9px] font-bold uppercase">
                          In Progress
                        </span>
                        <span className="text-primary bg-primary/10 rounded-full px-1.5 text-[8px] font-bold">
                          {taskStatus === "progress" ? 2 : 1}
                        </span>
                      </div>

                      {/* Static Card */}
                      <div className="rounded border border-slate-200 bg-white p-2 shadow-sm">
                        <div className="mb-1 text-[9px] font-bold text-slate-800">
                          SEO Audit
                        </div>
                        <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
                          <div className="bg-primary h-full w-2/3"></div>
                        </div>
                      </div>

                      {/* MOVING CARD - Destination */}
                      {taskStatus === "progress" && (
                        <motion.div
                          layoutId="card-move"
                          className="border-primary rounded border-l-2 bg-white p-2 shadow-sm"
                        >
                          <div className="mb-1 flex items-start justify-between">
                            <span className="text-[9px] font-bold text-slate-800">
                              Wireframe
                            </span>
                            <CheckCircle2 size={10} className="text-primary" />
                          </div>
                          <div className="text-[8px] text-slate-500">
                            Client: Apex College
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </LayoutGroup>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AgencySkeleton;
