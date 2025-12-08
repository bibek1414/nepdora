import React from "react";
import { motion } from "framer-motion";
import {
  Search,
  CheckCircle2,
  XCircle,
  Truck,
  Package,
  MoreHorizontal,
  CreditCard,
  RotateCcw,
} from "lucide-react";

const OrdersSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col bg-slate-50 p-4">
      {/* Search Bar */}
      <div className="mb-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
        <Search size={14} className="text-slate-400" />
        <div className="h-2 w-24 rounded bg-slate-100"></div>
        <div className="ml-auto flex gap-1">
          <div className="h-2 w-2 rounded-full bg-slate-200"></div>
          <div className="h-2 w-2 rounded-full bg-slate-200"></div>
        </div>
      </div>

      {/* Table Header */}
      <div className="mb-2 grid grid-cols-4 px-3 text-[10px] font-medium text-slate-400">
        <div className="col-span-2">Order Details</div>
        <div>Status</div>
        <div className="text-right">Action</div>
      </div>

      {/* Table Rows */}
      <div className="space-y-2">
        {[
          {
            title: "Winter Jacket",
            id: "#8823",
            status: "Delivered",
            icon: CheckCircle2,
            color: "text-green-600 bg-green-50 border-green-100",
          },
          {
            title: "Leather Boots",
            id: "#8824",
            status: "Cancelled",
            icon: XCircle,
            color: "text-red-600 bg-red-50 border-red-100",
          },
          {
            title: "Wool Scarf",
            id: "#8825",
            status: "In Transit",
            icon: Truck,
            color: "text-blue-600 bg-blue-50 border-blue-100",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="relative grid grid-cols-4 items-center rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-sm transition-all hover:shadow-md"
          >
            <div className="col-span-2 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-slate-300">
                <Package size={14} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">
                  {item.title}
                </div>
                <div className="text-[9px] text-slate-400">{item.id}</div>
              </div>
            </div>

            <div>
              <div
                className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[9px] font-bold ${item.color}`}
              >
                <item.icon size={10} />
                {item.status}
              </div>
            </div>

            <div className="text-right">
              <div className="ml-auto flex h-6 w-6 cursor-pointer items-center justify-center rounded text-slate-400 hover:bg-slate-100">
                <MoreHorizontal size={14} />
              </div>
            </div>

            {/* Interaction Demo on 2nd Item */}
            {i === 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.3 }}
                className="absolute top-8 right-8 z-20 w-32 origin-top-right rounded-lg border border-slate-200 bg-white p-1 shadow-xl"
              >
                <div className="flex items-center gap-2 px-2 py-1.5 text-[10px] text-slate-600 hover:bg-slate-50">
                  <CreditCard size={10} /> Refund
                </div>
                <div className="flex items-center gap-2 rounded bg-red-50 px-2 py-1.5 text-[10px] font-medium text-red-600">
                  <RotateCcw size={10} /> View Reason
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersSkeleton;
