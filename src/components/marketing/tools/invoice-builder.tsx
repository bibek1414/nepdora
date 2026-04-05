"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Plus, Trash2, FileText, Loader2, Zap } from "lucide-react";
import Link from "next/link";
import CTA from "@/components/marketing/cta-section/cta-section";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const InvoiceBuilder = () => {
  const [items, setItems] = useState([
    { description: "", quantity: 1, price: 0 },
  ]);
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const addItem = () =>
    setItems([...items, { description: "", quantity: 1, price: 0 }]);
  const removeItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index));

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    setIsGenerating(true);

    try {
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold md:text-5xl">
            Professional Invoice Builder
          </h1>
          <p className="text-lg text-slate-600">
            Create and download professional invoices for your business in
            Nepal. Free and instant.
          </p>
        </div>

        {/* Growth Banner */}
        <div className="bg-primary shadow-primary/20 group relative mb-8 flex flex-col items-center justify-between gap-6 overflow-hidden rounded-3xl p-6 text-white shadow-2xl md:flex-row">
          <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-[80px] transition-transform duration-700 group-hover:scale-110" />
          <div className="relative z-10 flex items-center gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/20 shadow-inner backdrop-blur-md">
              <Zap className="h-7 w-7 animate-pulse fill-white text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tighter uppercase italic md:text-2xl">
                Love this tool?
              </h3>
              <p className="font-bold text-white/80">
                Build a professional website with integrated payments in 2
                minutes.
              </p>
            </div>
          </div>
          <Link
            href="/create-website"
            className="relative z-10 rounded-full bg-slate-900 px-8 py-4 text-sm font-black tracking-widest text-white uppercase shadow-xl transition-all hover:scale-110 active:scale-95"
          >
            Build My Website
          </Link>
        </div>

        <div className="mb-20 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div
              ref={invoiceRef}
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <div className="mb-12 flex items-start justify-between">
                <div className="space-y-4">
                  <h2 className="flex items-center gap-2 text-xl font-bold">
                    <FileText className="text-primary h-5 w-5" /> Invoice
                    Details
                  </h2>
                  <Input
                    placeholder="Your Business Name"
                    className="border-none px-0 text-lg font-bold focus-visible:ring-0"
                  />
                  <Input
                    placeholder="Your Address"
                    className="border-none px-0 text-base focus-visible:ring-0"
                  />
                </div>
                <div className="space-y-2 text-right">
                  <p className="text-xs font-medium text-slate-500">
                    Invoice #
                  </p>
                  <Input
                    placeholder="INV-001"
                    className="border-slate-200 text-right shadow-none"
                  />
                  <p className="mt-4 text-xs font-medium text-slate-500">
                    Date
                  </p>
                  <Input
                    type="date"
                    className="border-slate-200 text-right shadow-none"
                  />
                </div>
              </div>

              <div className="mb-12">
                <h3 className="mb-4 font-semibold text-slate-900">Bill To:</h3>
                <Input placeholder="Client Name" className="mb-2 shadow-none" />
                <Input placeholder="Client Address" className="shadow-none" />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 px-4 text-xs font-semibold text-slate-400 uppercase">
                  <div className="col-span-6">Description</div>
                  <div className="col-span-2">Qty</div>
                  <div className="col-span-3">Price (NPR)</div>
                  <div className="col-span-1"></div>
                </div>

                {items.map((item, index) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={index}
                    className="grid grid-cols-12 items-center gap-4"
                  >
                    <div className="col-span-6">
                      <Input
                        placeholder="Item name or description"
                        value={item.description}
                        onChange={e =>
                          updateItem(index, "description", e.target.value)
                        }
                        className="shadow-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={e =>
                          updateItem(
                            index,
                            "quantity",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="shadow-none"
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        value={item.price}
                        onChange={e =>
                          updateItem(
                            index,
                            "price",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="shadow-none"
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-red-500"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}

                <Button
                  variant="outline"
                  className="hover:border-primary hover:text-primary mt-4 w-full border-2 border-dashed shadow-none"
                  onClick={addItem}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </div>

              <div className="mt-12 flex justify-end">
                <div className="w-64 space-y-4 border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Subtotal</span>
                    <span>Rs. {total.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      Rs. {total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="mb-6 text-xl font-bold">Download Invoice</h3>
              <p className="mb-6 text-sm text-slate-500">
                Enter your contact info to download your professional invoice
                PDF.
              </p>

              <div className="mb-8 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-400 uppercase">
                    Your Email
                  </label>
                  <Input
                    placeholder="name@business.com"
                    value={clientEmail}
                    onChange={e => setClientEmail(e.target.value)}
                    className="shadow-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-400 uppercase">
                    Your Phone
                  </label>
                  <Input
                    placeholder="98XXXXXXXX"
                    value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)}
                    className="shadow-none"
                  />
                </div>
              </div>

              <Button
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl font-bold"
                disabled={!clientEmail || !clientPhone || isGenerating}
                onClick={handleDownloadPDF}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {isGenerating ? "Generating..." : "Download PDF"}
              </Button>

              <p className="mt-4 text-center text-[10px] text-slate-400">
                By downloading, you agree to receive helpful business tips from
                Nepdora.
              </p>
            </div>

            {/* Growth Loop CTA */}
            <div className="rounded-2xl bg-slate-900 p-8 text-white shadow-xl shadow-slate-200">
              <div className="bg-primary/20 ring-primary/30 mb-6 flex h-12 w-12 items-center justify-center rounded-xl ring-1">
                <Zap className="text-primary h-6 w-6" />
              </div>
              <h3 className="mb-4 text-xl font-bold">
                Never lose an invoice again.
              </h3>
              <p className="mb-8 text-sm leading-relaxed text-slate-400">
                Save this invoice and automate your entire billing process by
                creating a{" "}
                <span className="font-semibold text-white">free website</span>{" "}
                on Nepdora.
              </p>
              <Button
                asChild
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white font-bold text-slate-950 hover:bg-slate-100"
              >
                <Link href="/create-website">
                  Save this Invoice
                  <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                </Link>
              </Button>
              <p className="mt-4 text-center text-[10px] font-medium tracking-widest text-slate-500 uppercase">
                No Credit Card Required
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
