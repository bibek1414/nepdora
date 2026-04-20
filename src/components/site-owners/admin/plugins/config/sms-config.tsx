"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  Save,
  User,
  Package,
  MapPin,
  IndianRupee,
  Undo2,
  Redo2,
} from "lucide-react";
import {
  useSMSSettings,
  usePatchSMSSettings,
} from "@/hooks/owner-site/admin/use-sms-setting";
import { toast } from "sonner";
import Tiptap, { TiptapRef } from "@/components/ui/tip-tap";

interface SMSConfigProps {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugin: any;
  onClose: () => void;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (data: any) => void;
}

const DEFAULT_TEMPLATE =
  "Hi {{name}}, your order containing {{products}} worth Rs. {{total_amount}} has been delivered to {{location}}. Thank you for your purchase!";

export function SMSConfig({ plugin, onClose, onSave }: SMSConfigProps) {
  const { data: smsSettings = [], isLoading, refetch } = useSMSSettings();
  const patchMutation = usePatchSMSSettings();
  const tiptapRef = useRef<TiptapRef>(null);

  const smsData = Array.isArray(smsSettings) ? smsSettings[0] : smsSettings;

  const [formData, setFormData] = useState({
    sms_enabled: false,
    delivery_sms_enabled: false,
    delivery_sms_template: "",
  });

  useEffect(() => {
    if (smsData) {
      setFormData({
        sms_enabled: smsData.sms_enabled || false,
        delivery_sms_enabled: smsData.delivery_sms_enabled || false,
        delivery_sms_template:
          smsData.delivery_sms_template || DEFAULT_TEMPLATE,
      });
    }
  }, [smsData]);

  const insertTag = (tag: string) => {
    if (tiptapRef.current?.editor) {
      tiptapRef.current.editor.commands.insertContent(`{{${tag}}}`);
      tiptapRef.current.editor.commands.focus();
    }
  };

  const handleSubmit = async () => {
    try {
      await patchMutation.mutateAsync({
        sms_enabled: formData.sms_enabled,
        delivery_sms_enabled: formData.delivery_sms_enabled,
        delivery_sms_template: formData.delivery_sms_template,
      });
      toast.success("Configuration updated successfully");
      refetch();
      onSave(formData);
    } catch (error) {
      toast.error("Failed to update configuration");
    }
  };

  const isSubmitting = patchMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const tags = [
    { label: "Name", value: "name", icon: <User className="h-3 w-3" /> },
    {
      label: "Products",
      value: "products",
      icon: <Package className="h-3 w-3" />,
    },
    {
      label: "Total amount",
      value: "total_amount",
      icon: <IndianRupee className="h-3 w-3" />,
    },
    {
      label: "Location",
      value: "location",
      icon: <MapPin className="h-3 w-3" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {/* Main Enable Switch */}
        <div className="-sm flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
          <div className="space-y-0.5">
            <Label className="text-sm font-bold text-slate-900">
              Enable Service
            </Label>
            <p className="text-[11px] text-slate-500">
              Turn on/off all notification automations
            </p>
          </div>
          <Switch
            checked={formData.sms_enabled}
            onCheckedChange={checked =>
              setFormData(prev => ({ ...prev, sms_enabled: checked }))
            }
            className="data-[state=checked]:bg-blue-600"
          />
        </div>

        {/* Delivery Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="space-y-0.5">
              <h4 className="-widest text-xs font-semibold text-slate-500">
                Delivery Notification
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="-wider text-[10px] font-medium text-slate-400">
                {formData.delivery_sms_enabled ? "Active" : "Disabled"}
              </span>
              <Switch
                checked={formData.delivery_sms_enabled}
                onCheckedChange={checked =>
                  setFormData(prev => ({
                    ...prev,
                    delivery_sms_enabled: checked,
                  }))
                }
                className="scale-90 data-[state=checked]:bg-green-600"
              />
            </div>
          </div>

          {formData.delivery_sms_enabled && (
            <div className="animate-in fade-in slide-in-from-top-1 space-y-4 duration-300">
              <div className="-xl overflow-hidden rounded-xl border border-slate-200 bg-white ring-1 ring-slate-900/5">
                {/* Editor Container */}
                <div className="relative">
                  <Tiptap
                    ref={tiptapRef}
                    value={formData.delivery_sms_template}
                    onChange={val =>
                      setFormData(prev => ({
                        ...prev,
                        delivery_sms_template: val,
                      }))
                    }
                    toolbar="advanced"
                    minHeight="240px"
                    placeholder="Compose your delivery message..."
                    className="border-none focus-within:ring-0"
                  />

                  {/* Tag Toolbar - Styled as per screenshot */}
                  <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50/50 px-4 py-2.5">
                    <span className="-tight text-[11px] font-semibold text-slate-400">
                      Personalize:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {tags.map(tag => (
                        <Button
                          key={tag.value}
                          variant="outline"
                          size="sm"
                          onClick={() => insertTag(tag.value)}
                          className="-sm h-7 border-slate-200 bg-white px-3 text-[11px] font-bold text-slate-700 transition-all hover:border-blue-400 hover:bg-blue-50 active:scale-95"
                        >
                          {tag.icon}
                          <span className="ml-1.5">{tag.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview & Tips */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-2 rounded-lg border border-slate-100 bg-slate-50/30 p-3">
                  <div className="-wider flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                    <Undo2 className="h-3 w-3" />
                    Character Usage
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    SMS formatting counts towards credit usage. Plain text is
                    recommended for critical delivery updates.
                  </p>
                </div>
                <div className="space-y-2 rounded-lg border border-blue-100 bg-blue-50/20 p-3">
                  <div className="-wider flex items-center gap-1.5 text-[10px] font-bold text-blue-500">
                    <Redo2 className="h-3 w-3" />
                    Live Status
                  </div>
                  <p className="text-[11px] leading-relaxed text-blue-700/70">
                    Dynamic tags will be replaced with real order data before
                    sending.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleSubmit}
            className="-lg h-11 flex-1 bg-slate-900 text-sm font-bold transition-all hover:bg-slate-800 active:scale-[0.98]"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Configuration
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="h-11 flex-1 border-slate-200 font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
