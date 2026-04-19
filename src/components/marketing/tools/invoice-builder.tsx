"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Plus,
  Trash2,
  FileText,
  Loader2,
  Zap,
  PlusCircle,
  Building2,
  Mail,
  User,
  Hash,
  Calendar,
  CreditCard,
  Phone,
} from "lucide-react";
import Link from "next/link";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// ── Types ────────────────────────────────────────────────────────────────────

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function today(): string {
  return new Date().toISOString().split("T")[0];
}

// ── Main Component ────────────────────────────────────────────────────────────

export const InvoiceBuilder = () => {
  const [items, setItems] = useState<LineItem[]>([
    {
      id: "1",
      description: "Design & Development Services",
      quantity: 1,
      price: 0,
    },
  ]);
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState(
    `INV-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [invoiceDate, setInvoiceDate] = useState(today());

  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const addItem = () =>
    setItems([
      ...items,
      {
        id: Math.random().toString(36).substr(2, 9),
        description: "",
        quantity: 1,
        price: 0,
      },
    ]);

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter(it => it.id !== id));
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setItems(items.map(it => (it.id === id ? { ...it, [field]: value } : it)));
  };

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  // ── PDF Generation (High Quality direct drawing) ──────────────────────────

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const W = 595,
        ml = 48,
        mr = 48,
        cw = W - ml - mr;
      let y = 60;

      const accent: [number, number, number] = [103, 61, 230]; // primary (approx #673de6)
      const dark: [number, number, number] = [15, 23, 42]; // slate-900
      const muted: [number, number, number] = [100, 116, 139]; // slate-500
      const light: [number, number, number] = [241, 245, 249]; // slate-100

      // Title
      doc
        .setFontSize(26)
        .setFont("helvetica", "bold")
        .setTextColor(...dark);
      doc.text("INVOICE", W - mr, y + 5, { align: "right" });
      doc
        .setFontSize(10)
        .setFont("helvetica", "normal")
        .setTextColor(...muted);
      doc.text(`#${invoiceNumber}`, W - mr, y + 22, { align: "right" });

      y += 80;
      doc
        .setFontSize(8)
        .setFont("helvetica", "bold")
        .setTextColor(...muted);
      doc.text("FROM", ml, y);
      doc.text("BILL TO", ml + cw / 2, y);

      y += 15;
      doc
        .setFontSize(11)
        .setFont("helvetica", "bold")
        .setTextColor(...dark);
      doc.text(businessName || "Your Business Name", ml, y);
      doc.text(clientName || "Client Name", ml + cw / 2, y);

      y += 15;
      doc
        .setFontSize(9)
        .setFont("helvetica", "normal")
        .setTextColor(...muted);
      if (businessAddress)
        doc.text(doc.splitTextToSize(businessAddress, cw / 2 - 20), ml, y);
      if (clientAddress)
        doc.text(
          doc.splitTextToSize(clientAddress, cw / 2 - 20),
          ml + cw / 2,
          y
        );

      y += 60;
      doc.setFillColor(...light).roundedRect(ml, y, cw, 40, 3, 3, "F");
      const cols = [ml + 20, ml + cw / 2 + 20];
      doc
        .setFontSize(8)
        .setFont("helvetica", "bold")
        .setTextColor(...muted);
      doc.text("INVOICE DATE", cols[0], y + 15);
      doc.text("TOTAL AMOUNT", cols[1], y + 15);
      doc
        .setFontSize(11)
        .setFont("helvetica", "bold")
        .setTextColor(...dark);
      doc.text(invoiceDate, cols[0], y + 30);
      doc.text(`NPR ${total.toLocaleString()}`, cols[1], y + 30);

      y += 70;
      doc.setFillColor(...accent).rect(ml, y, cw, 28, "F");
      const tCols = [ml + 15, ml + cw * 0.6, ml + cw * 0.75, ml + cw - 15];
      doc
        .setFontSize(9)
        .setFont("helvetica", "bold")
        .setTextColor(255, 255, 255);
      doc.text("DESCRIPTION", tCols[0], y + 18);
      doc.text("QTY", tCols[1], y + 18);
      doc.text("PRICE", tCols[2], y + 18);
      doc.text("TOTAL", tCols[3], y + 18, { align: "right" });

      y += 28;
      items.forEach((it, i) => {
        const rowH = 26;
        if (i % 2 === 0) doc.setFillColor(252, 252, 254);
        else doc.setFillColor(255, 255, 255);
        doc.rect(ml, y, cw, rowH, "F");
        doc
          .setFontSize(10)
          .setFont("helvetica", "normal")
          .setTextColor(...dark);
        doc.text(it.description || "-", tCols[0], y + 16);
        doc.text(String(it.quantity), tCols[1], y + 16);
        doc.text(it.price.toLocaleString(), tCols[2], y + 16);
        doc.setFont("helvetica", "bold");
        doc.text((it.quantity * it.price).toLocaleString(), tCols[3], y + 16, {
          align: "right",
        });
        y += rowH;
      });

      y += 40;
      doc
        .setFontSize(10)
        .setFont("helvetica", "normal")
        .setTextColor(...muted);
      doc.text("Amount Due", W - mr - 100, y);
      doc
        .setFontSize(18)
        .setFont("helvetica", "bold")
        .setTextColor(...accent);
      doc.text(`NPR ${total.toLocaleString()}`, W - mr, y + 20, {
        align: "right",
      });

      doc.setFontSize(8).setTextColor(...muted);
      doc.text(
        "This invoice was generated using Nepdora Invoice Builder, a fast and modern way to create professional invoices for businesses in Nepal.",
        W / 2,
        800,
        { align: "center" }
      );

      doc.save(`invoice-${invoiceNumber}.pdf`);
      toast.success("Invoice downloaded!");
    } catch (err) {
      toast.error("Error generating PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Render Helpers ─────────────────────────────────────────────────────────

  const placeholderStyle = "placeholder:text-slate-400";

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Editor (2/3) */}
        <div className="space-y-8 lg:col-span-2">
          <Card className="-sm relative overflow-hidden border-slate-200 bg-white px-8">
            <div className="bg-primary absolute top-0 left-0 h-full w-2" />

            {/* Header info */}
            <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row">
              <div className="flex-1 space-y-6">
                <div className="mb-4 flex items-center gap-2">
                  <Building2 className="text-primary h-5 w-5" />
                  <h2 className="text-lg font-bold">Your Business</h2>
                </div>
                <Input
                  placeholder="Your Business Name"
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  className={`-none border bg-transparent px-2 text-2xl focus-visible:ring-0 ${placeholderStyle}`}
                />
                <Input
                  placeholder="Street Address, City, Phone"
                  value={businessAddress}
                  onChange={e => setBusinessAddress(e.target.value)}
                  className={`-none border bg-transparent px-2 text-slate-500 focus-visible:ring-0 ${placeholderStyle}`}
                />
              </div>

              <div className="mt-5 min-w-[180px] space-y-4 text-right">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    Invoice #
                  </Label>
                  <Input
                    placeholder="INV-001"
                    value={invoiceNumber}
                    onChange={e => setInvoiceNumber(e.target.value)}
                    className={`focus-visible:ring-primary -none border-slate-200 text-right ${placeholderStyle}`}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    Date
                  </Label>
                  <Input
                    type="date"
                    value={invoiceDate}
                    onChange={e => setInvoiceDate(e.target.value)}
                    className={`focus-visible:ring-primary -none border-slate-200 text-right ${placeholderStyle}`}
                  />
                </div>
              </div>
            </div>

            {/* Bill to */}
            <div className="mb-12">
              <div className="mb-6 flex items-center gap-2">
                <User className="text-primary h-5 w-5" />
                <h3 className="text-md font-bold text-slate-900">Bill To</h3>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input
                  placeholder="Client Name"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  className={`-none h-10 border-slate-200 ${placeholderStyle}`}
                />
                <Input
                  placeholder="Client Address"
                  value={clientAddress}
                  onChange={e => setClientAddress(e.target.value)}
                  className={`-none h-10 border-slate-200 ${placeholderStyle}`}
                />
              </div>
            </div>

            {/* Line items */}
            <div className="space-y-6">
              <div className="grid grid-cols-12 gap-4 px-4 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-right">Qty</div>
                <div className="col-span-3 text-right">Price (NPR)</div>
                <div className="col-span-1"></div>
              </div>

              <AnimatePresence mode="popLayout">
                {items.map(item => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={item.id}
                    className="group grid grid-cols-12 items-center gap-4 rounded-xl border border-transparent bg-slate-50/50 p-2 transition-all hover:border-slate-200"
                  >
                    <div className="col-span-6">
                      <Input
                        placeholder="Project name or service description"
                        value={item.description}
                        onChange={e =>
                          updateItem(item.id, "description", e.target.value)
                        }
                        className={`-none h-10 border-slate-100 bg-white ${placeholderStyle}`}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={e =>
                          updateItem(
                            item.id,
                            "quantity",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="-none h-10 border-slate-100 bg-white text-right"
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        value={item.price}
                        onChange={e =>
                          updateItem(
                            item.id,
                            "price",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="-none h-10 border-slate-100 bg-white text-right"
                      />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-300 hover:bg-red-50 hover:text-red-500"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <Button
                variant="outline"
                className="hover:text-primary hover:border-primary/30 hover:bg-primary/5 group h-12 w-full border-2 border-dashed border-slate-200 text-slate-400 transition-all"
                onClick={addItem}
              >
                <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
                Add Line Item
              </Button>
            </div>

            {/* Total */}
            <div className="mt-12 flex justify-end">
              <div className="w-full space-y-4 border-t border-slate-100 pt-8 md:w-80">
                <div className="flex items-center justify-between font-medium text-slate-500">
                  <span>Subtotal</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-2xl text-slate-900">
                  <span>Total Due</span>
                  <span className="text-primary">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Actions (1/3) */}
        <div className="space-y-6">
          <Card className="-sm sticky top-24 border-slate-200 bg-white">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <Download className="text-primary h-5 w-5" />
              Get PDF
            </h3>
            <p className="mb-8 text-sm leading-relaxed text-slate-500">
              Enter your contact details to download a professional invoice for
              your client.
            </p>

            <div className="mb-8 space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                  Your Email
                </Label>
                <div className="relative">
                  <Mail className="absolute top-3 left-3 h-4 w-4 text-slate-300" />
                  <Input
                    placeholder="name@business.com"
                    value={clientEmail}
                    onChange={e => setClientEmail(e.target.value)}
                    className={`focus-visible:ring-primary -none h-11 border-slate-200 pl-10 ${placeholderStyle}`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                  Your Phone
                </Label>
                <div className="relative">
                  <Phone className="absolute top-3 left-3 h-4 w-4 text-slate-300" />
                  <Input
                    placeholder="98XXXXXXXX"
                    value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)}
                    className={`focus-visible:ring-primary -none h-11 border-slate-200 pl-10 ${placeholderStyle}`}
                  />
                </div>
              </div>
            </div>

            <Button
              className="bg-primary hover:bg-primary/90 -primary/10 -lg h-12 w-full rounded-xl font-bold text-white transition-all hover:translate-y-[-2px] disabled:opacity-50"
              disabled={!clientEmail || !clientPhone || isGenerating}
              onClick={handleDownloadPDF}
            >
              {isGenerating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Download className="mr-2 h-5 w-5" />
              )}
              {isGenerating ? "Exporting..." : "Download Invoice"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
