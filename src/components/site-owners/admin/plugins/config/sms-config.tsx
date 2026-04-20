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
  Eye,
} from "lucide-react";
import {
  useSMSSettings,
  usePatchSMSSettings,
} from "@/hooks/owner-site/admin/use-sms-setting";
import { toast } from "sonner";
import TipTapSimple, { TipTapSimpleRef } from "@/components/ui/tip-tap-simple";
import { htmlToPlainText } from "@/utils/html-sanitizer";

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
  const tiptapRef = useRef<TipTapSimpleRef>(null);

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
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
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

  const plainText = htmlToPlainText(formData.delivery_sms_template);
  const charCount = plainText.length;
  const getSmsCredits = (len: number) => {
    if (len === 0) return 0;
    if (len < 160) return 1;
    if (len <= 315) return 2;
    return 3;
  };
  const estimatedCredits = getSmsCredits(charCount);

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {/* Main Enable Switch */}
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
          <div className="space-y-0.5">
            <Label className="text-sm font-bold text-gray-900">
              Enable Service
            </Label>
            <p className="text-[11px] text-gray-500">
              Turn on/off all notification automations
            </p>
          </div>
          <Switch
            checked={formData.sms_enabled}
            onCheckedChange={checked =>
              setFormData(prev => ({ ...prev, sms_enabled: checked }))
            }
            className="data-[state=checked]:bg-primary"
          />
        </div>

        {/* Delivery Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-gray-500">
                Delivery Notification
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">
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
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white ring-1 ring-gray-900/5">
                {/* Editor Container */}
                <div className="relative">
                  <TipTapSimple
                    ref={tiptapRef}
                    value={formData.delivery_sms_template}
                    onChange={val =>
                      setFormData(prev => ({
                        ...prev,
                        delivery_sms_template: val,
                      }))
                    }
                    minHeight="160px"
                    placeholder="Compose your delivery message..."
                    className="border-none focus-within:ring-0"
                  />

                  {/* Tag Toolbar */}
                  <div className="flex items-center gap-3 border-t border-gray-100 bg-gray-50/50 px-4 py-2.5">
                    <span className="text-[11px] font-semibold text-gray-500">
                      Personalize:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {tags.map(tag => (
                        <Button
                          key={tag.value}
                          variant="outline"
                          size="sm"
                          onMouseDown={e => {
                            e.preventDefault();
                            insertTag(tag.value);
                          }}
                          className="h-7 border-gray-200 bg-white px-3 text-[11px] font-bold text-gray-700 transition-all hover:border-blue-400 hover:bg-blue-50 active:scale-95"
                        >
                          {tag.icon}
                          <span className="ml-1.5">{tag.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-4 rounded-xl border border-blue-50 bg-blue-50/10 p-4">
                <div className="flex items-center justify-between px-1">
                  <div className="text-primary -tight flex items-center gap-2 text-xs font-bold">
                    <Eye className="h-3 w-3" />
                    Live SMS Preview
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    <span className="flex items-center gap-1">
                      Characters:{" "}
                      <span className="text-gray-900">{charCount}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      Estimated Credits:{" "}
                      <span
                        className={
                          estimatedCredits > 1
                            ? "text-primary"
                            : "text-gray-900"
                        }
                      >
                        {estimatedCredits}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border border-blue-100/50 bg-white p-3 text-xs leading-relaxed font-medium whitespace-pre-wrap text-gray-600">
                  {plainText
                    .replace(/{{name}}/g, "John Doe")
                    .replace(/{{products}}/g, "1x T-Shirt, 1x Jeans")
                    .replace(/{{total_amount}}/g, "2500")
                    .replace(/{{location}}/g, "Kathmandu") || (
                    <span className="text-gray-300 italic">
                      Start typing to see preview...
                    </span>
                  )}
                </div>
                <p className="px-1 text-xs text-gray-500">
                  Formatting like bold/italic will be stripped for the actual
                  SMS delivery.
                </p>
              </div>

              {/* Tips */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-2 rounded-lg border border-gray-100 bg-gray-50/30 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                    <Undo2 className="h-3 w-3" />
                    Character Usage
                  </div>
                  <p className="text-[11px] leading-relaxed text-gray-600">
                    Character limit for 1 SMS is 160. Long messages will use
                    more credits.
                  </p>
                </div>
                <div className="space-y-2 rounded-lg border border-blue-100 bg-blue-50/20 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-500">
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
            className="h-11 flex-1 bg-gray-900 text-sm font-bold transition-all hover:bg-gray-800 active:scale-[0.98]"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Configuration
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="h-11 flex-1 border-gray-200 font-semibold text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
