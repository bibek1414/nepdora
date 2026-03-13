"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Plus, Trash2, FileText } from "lucide-react";
import CTA from "@/components/marketing/cta-section/cta-section";

export const InvoiceBuilder = () => {
  const [items, setItems] = useState([{ description: "", quantity: 1, price: 0 }]);
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  const addItem = () => setItems([...items, { description: "", quantity: 1, price: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-12 pt-24">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold md:text-5xl">Professional Invoice Builder</h1>
          <p className="text-lg text-slate-600">Create and download professional invoices for your business in Nepal. Free and instant.</p>
        </div>

        <div className="mb-20 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-12 flex items-start justify-between">
                <div className="space-y-4">
                  <h2 className="flex items-center gap-2 text-xl font-bold">
                    <FileText className="h-5 w-5 text-primary" /> Invoice Details
                  </h2>
                  <Input placeholder="Your Business Name" className="border-none px-0 text-lg font-bold focus-visible:ring-0" />
                  <Input placeholder="Your Address" className="border-none px-0 text-base focus-visible:ring-0" />
                </div>
                <div className="space-y-2 text-right">
                  <p className="text-xs font-medium text-slate-500">Invoice #</p>
                  <Input placeholder="INV-001" className="text-right border-slate-200 shadow-none" />
                  <p className="mt-4 text-xs font-medium text-slate-500">Date</p>
                  <Input type="date" className="text-right border-slate-200 shadow-none" />
                </div>
              </div>

              <div className="mb-12">
                <h3 className="mb-4 font-semibold text-slate-900">Bill To:</h3>
                <Input placeholder="Client Name" className="mb-2 shadow-none" />
                <Input placeholder="Client Address" className="shadow-none" />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 px-4 text-xs font-semibold uppercase text-slate-400">
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
                    className="grid grid-cols-12 gap-4 items-center"
                  >
                    <div className="col-span-6">
                      <Input 
                        placeholder="Item name or description" 
                        value={item.description}
                        onChange={(e) => updateItem(index, "description", e.target.value)}
                        className="shadow-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input 
                        type="number" 
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 0)}
                        className="shadow-none"
                      />
                    </div>
                    <div className="col-span-3">
                      <Input 
                        type="number" 
                        value={item.price}
                        onChange={(e) => updateItem(index, "price", parseFloat(e.target.value) || 0)}
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
                  className="mt-4 w-full border-2 border-dashed shadow-none hover:border-primary hover:text-primary"
                  onClick={addItem}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </div>

              <div className="mt-12 flex justify-end">
                <div className="w-64 space-y-4 border-t border-slate-100 pt-6">
                  <div className="flex justify-between items-center text-sm text-slate-500">
                    <span>Subtotal</span>
                    <span>Rs. {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">Rs. {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="mb-6 text-xl font-bold">Download Invoice</h3>
              <p className="mb-6 text-sm text-slate-500">Enter your contact info to download your professional invoice PDF.</p>
              
              <div className="mb-8 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-slate-400">Your Email</label>
                  <Input 
                    placeholder="name@business.com" 
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="shadow-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-slate-400">Your Phone</label>
                  <Input 
                    placeholder="98XXXXXXXX" 
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="shadow-none"
                  />
                </div>
              </div>

              <Button 
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl font-bold"
                disabled={!clientEmail || !clientPhone}
              >
                <Download className="h-4 w-4" /> Download PDF
              </Button>
              
              <p className="mt-4 text-center text-[10px] text-slate-400">
                By downloading, you agree to receive helpful business tips from Nepdora.
              </p>
            </div>
          </div>
        </div>
      </div>

      <CTA />
    </div>
  );
};
