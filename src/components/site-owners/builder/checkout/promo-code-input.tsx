"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useValidatePromoCode } from "@/hooks/owner-site/admin/use-promo-code-validate";
import { PromoCode } from "@/types/owner-site/admin/promo-code-validate";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Tag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PromoCodeInputProps {
  onPromoCodeApplied: (promoCode: PromoCode | null) => void;
  appliedPromoCode: PromoCode | null;
  primaryColor: string;
  subtlePrimaryBg: string;
}

export const PromoCodeInput: React.FC<PromoCodeInputProps> = ({
  onPromoCodeApplied,
  appliedPromoCode,
  primaryColor,
  subtlePrimaryBg,
}) => {
  const [promoCode, setPromoCode] = useState("");
  const validatePromoCodeMutation = useValidatePromoCode();

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    try {
      const response = await validatePromoCodeMutation.mutateAsync({
        code: promoCode.trim(),
      });

      if (response.valid && response.promo_code) {
        toast.success("Promo code applied successfully!");
        onPromoCodeApplied(response.promo_code);
        setPromoCode("");
      } else {
        toast.error(response.message || "Invalid promo code");
        onPromoCodeApplied(null);
      }
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Invalid promo code");
      onPromoCodeApplied(null);
    }
  };

  const handleRemovePromoCode = () => {
    onPromoCodeApplied(null);
    setPromoCode("");
    toast.info("Promo code removed");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleApplyPromoCode();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-gray-500" />
        <h3 className="text-sm font-medium">Have a promo code?</h3>
      </div>

      <AnimatePresence mode="wait">
        {appliedPromoCode ? (
          <motion.div
            key="applied"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-lg border p-3"
            style={{
              borderColor: primaryColor,
              backgroundColor: subtlePrimaryBg,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className="h-5 w-5"
                  style={{ color: primaryColor }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {appliedPromoCode.code}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-xs"
                      style={{
                        backgroundColor: primaryColor,
                        color: "white",
                      }}
                    >
                      {appliedPromoCode.discount_percentage}% OFF
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">
                    Valid until{" "}
                    {new Date(appliedPromoCode.valid_to).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemovePromoCode}
                className="h-8 w-8 p-0 hover:bg-red-50"
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex gap-2"
          >
            <Input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={e => setPromoCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              disabled={validatePromoCodeMutation.isPending}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleApplyPromoCode}
              disabled={
                validatePromoCodeMutation.isPending || !promoCode.trim()
              }
              style={{
                backgroundColor: primaryColor,
                color: "white",
              }}
            >
              {validatePromoCodeMutation.isPending ? "Validating..." : "Apply"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
