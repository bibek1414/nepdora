"use client";

import { useState } from "react";
import {
  useSubscriptionStatus,
  usePricingPlans,
} from "@/hooks/use-subscription";
import { cn } from "@/lib/utils";
import {
  Zap,
  ChevronRight,
  Calendar,
  Crown,
  Check,
  ArrowLeft,
  Loader2,
  Lock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

// --- Types ---
interface SidebarSubscriptionWidgetProps {
  collapsed: boolean;
}

const PAYMENT_METHODS = [
  {
    id: "esewa",
    name: "eSewa",
    image: "/images/payment-gateway/esewa.png",
  },
  {
    id: "khalti",
    name: "Khalti",
    image: "/images/payment-gateway/khalti.png",
  },
];

const ENTERPRISE_PLAN = {
  id: "enterprise",
  name: "Enterprise",
  plan_type: "pro",
  tagline: "Custom solutions for large organisations",
  price: "Custom",
  unit: "",
  is_popular: false,
  cta: "Contact Sales",
  href: "https://wa.me/9779866316114",
  features: [
    { id: "e1", feature: "Everything in Pro", is_available: true, order: 1 },
    { id: "e2", feature: "Unlimited Websites", is_available: true, order: 2 },
    { id: "e3", feature: "SLA Guarantee", is_available: true, order: 3 },
    { id: "e4", feature: "White-label Option", is_available: true, order: 4 },
    { id: "e5", feature: "On-premise Hosting", is_available: true, order: 5 },
    {
      id: "e6",
      feature: "Dedicated Account Manager",
      is_available: true,
      order: 6,
    },
  ],
};

// --- Sub-Components ---

/**
 * Individual Plan Card used in Pricing Dialog
 */
const PlanCard = ({
  plan,
  isCurrentPlan,
  onChoosePlan,
}: {
  plan: any;
  isCurrentPlan: boolean;
  onChoosePlan: (plan: any) => void;
}) => (
  <Card
    key={plan.id}
    className={cn(
      "hover:-lg relative flex flex-col transition-all duration-300",
      plan.is_popular && "border-primary -md"
    )}
  >
    {plan.is_popular && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <Badge className="bg-primary hover:bg-primary px-3 py-0.5 text-[10px] text-white">
          MOST POPULAR
        </Badge>
      </div>
    )}
    <CardHeader className="pb-4">
      <CardTitle className="flex flex-col justify-between gap-1 text-lg">
        {plan.name}
        <Badge variant="outline" className="w-fit text-[10px] uppercase">
          {plan.plan_type}
        </Badge>
      </CardTitle>
      <div className="mt-2">
        <span className="text-3xl font-bold">
          {plan.price === "Custom" ? (
            plan.price
          ) : (
            <>Rs.{Number(plan.price).toLocaleString()}</>
          )}
        </span>
        {plan.unit && (
          <span className="text-muted-foreground text-sm">/{plan.unit}</span>
        )}
      </div>
    </CardHeader>
    <CardContent className="flex-1">
      <ul className="space-y-2 text-sm leading-snug text-balance">
        {plan.features
          .sort((a: any, b: any) => a.order - b.order)
          .map((feature: any) => (
            <li key={feature.id} className="flex items-start gap-2">
              <Check
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0",
                  feature.is_available
                    ? "text-green-500"
                    : "text-muted-foreground/30"
                )}
              />
              <span
                className={cn(
                  !feature.is_available && "text-muted-foreground/50"
                )}
              >
                {feature.feature}
              </span>
            </li>
          ))}
      </ul>
    </CardContent>
    <CardFooter className="pt-4">
      <Button
        className="w-full"
        variant={plan.is_popular || isCurrentPlan ? "default" : "outline"}
        disabled={isCurrentPlan}
        onClick={() => onChoosePlan(plan)}
      >
        {isCurrentPlan ? "Current Plan" : plan.cta || "Choose Plan"}
      </Button>
    </CardFooter>
  </Card>
);

/**
 * Trigger UI for the Sidebar
 */
const SubscriptionTrigger = ({
  collapsed,
  status,
  statusLoading,
  onClick,
}: {
  collapsed: boolean;
  status: any;
  statusLoading: boolean;
  onClick: () => void;
}) => {
  if (statusLoading) {
    return (
      <div className={cn("px-4 py-2", collapsed && "px-2")}>
        <Skeleton
          className={cn("h-16 w-full rounded-xl", collapsed && "h-10 w-10")}
        />
      </div>
    );
  }

  const planName = status?.plan || "No Plan";
  const statusColor = status?.active ? "text-green-500" : "text-red-500";
  const rawExpiry = status?.expires_on;
  let expiryDate = "N/A";

  if (rawExpiry) {
    const expiryString =
      typeof rawExpiry === "string" ? rawExpiry.trim() : String(rawExpiry);

    if (expiryString.toLowerCase().includes("never")) {
      expiryDate = "Never";
    } else {
      const parsedDate = new Date(rawExpiry);
      expiryDate = Number.isNaN(parsedDate.getTime())
        ? expiryString || "N/A"
        : parsedDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          });
    }
  }

  if (collapsed) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div className="flex justify-center px-2 py-2">
              <button
                onClick={onClick}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300",
                  status?.active
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "bg-red-50 text-red-600 hover:bg-red-100"
                )}
              >
                <Zap className="h-5 w-5" />
              </button>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex flex-col gap-1 p-3">
            <p className="font-semibold">{planName} Plan</p>
            <p className="text-muted-foreground text-xs">
              Expires on: {expiryDate}
            </p>
            <div
              className={cn(
                "mt-1 text-[10px] font-medium uppercase",
                statusColor
              )}
            >
              {status?.status || "Inactive"}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="mt-auto px-4 py-4">
      <div className="group border-primary/10 hover:border-primary/20 from-primary/5 via-primary/[0.02] hover:-md relative overflow-hidden rounded-2xl border bg-gradient-to-br to-transparent p-4 transition-all duration-300">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <Zap className="h-4 w-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-primary/80 text-sm font-semibold">
                Active Plan
              </p>
              <h3 className="max-w-[120px] truncate text-sm font-bold capitalize">
                {planName}
              </h3>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Expires {expiryDate}
            </span>
          </div>

          <Button
            size="sm"
            className="bg-primary hover:bg-primary/95 -sm h-8 w-full text-xs font-semibold transition-colors"
            onClick={onClick}
          >
            Upgrade Plan
            <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </div>

        {/* Decorative background element */}
        <div className="bg-primary/5 group-hover:bg-primary/10 absolute -right-4 -bottom-4 h-16 w-16 rounded-full blur-2xl transition-colors duration-500" />
      </div>
    </div>
  );
};

// --- Main Widget Component ---

export function SidebarSubscriptionWidget({
  collapsed,
}: SidebarSubscriptionWidgetProps) {
  const router = useRouter();
  const { data: status, isLoading: statusLoading } = useSubscriptionStatus();
  const { data: plans, isLoading: plansLoading } = usePricingPlans();
  const [showPlansDialog, setShowPlansDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);

  const handleChoosePlan = (plan: any) => {
    if (plan.href) {
      window.open(plan.href, "_blank");
      return;
    }
    if (plan.plan_type === "free" && status?.plan?.toLowerCase() === "free")
      return;
    setSelectedPlan(plan);
    setShowPaymentDialog(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedPlan || !selectedPaymentMethod) return;

    const paymentData = {
      plan_id: selectedPlan.id,
      plan_name: selectedPlan.name,
      amount: selectedPlan.price.toString(),
      payment_method: selectedPaymentMethod,
    };

    sessionStorage.setItem(
      "subscription_payment_data",
      JSON.stringify(paymentData)
    );

    if (selectedPaymentMethod === "esewa") {
      router.push("/subscription/esewa-payment");
    } else if (selectedPaymentMethod === "khalti") {
      router.push("/subscription/khalti-payment");
    }
  };

  return (
    <>
      <SubscriptionTrigger
        collapsed={collapsed}
        status={status}
        statusLoading={statusLoading}
        onClick={() => setShowPlansDialog(true)}
      />

      {/* Plans Selection Dialog */}
      <Dialog open={showPlansDialog} onOpenChange={setShowPlansDialog}>
        <DialogContent className="max-h-[92vh] max-w-5xl! overflow-y-auto p-4 md:p-8">
          <DialogHeader className="mb-6">
            <div className="mb-4 flex flex-col items-start justify-start gap-4">
              <img
                src="/nepdora-logooo.svg"
                alt="Nepdora"
                className="h-5 opacity-90"
              />
              <div className="flex items-center gap-3">
                <DialogTitle className="text-left text-2xl font-bold md:text-3xl">
                  Upgrade Your Experience
                </DialogTitle>
              </div>
            </div>
            <DialogDescription className="text-left text-sm text-balance md:text-base">
              {status?.status === "expired"
                ? `Your subscription expired on ${new Date(status.expires_on).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}. Re-activate to continue growing your business.`
                : "Unlock powerful features and scale your online presence with a plan that fits your vision."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            {plansLoading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <Skeleton className="mb-2 h-6 w-24" />
                      <Skeleton className="h-8 w-32" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-40 w-full" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : plans && plans.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {[
                  ...plans.filter(
                    (p: any) =>
                      p.price !== "0.00" &&
                      p.price !== 0 &&
                      p.plan_type !== "free"
                  ),
                  ENTERPRISE_PLAN,
                ].map(plan => {
                  const isCurrent =
                    status?.plan?.toLowerCase() === plan.name?.toLowerCase() ||
                    (plan.plan_type === "free" &&
                      status?.plan?.toLowerCase() === "free");

                  return (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      isCurrentPlan={isCurrent}
                      onChoosePlan={handleChoosePlan}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Lock className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                <h3 className="mb-2 text-xl font-semibold">
                  No Plans Available
                </h3>
                <p className="text-muted-foreground">
                  Please contact support or check back later.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Selection Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="p-6 sm:max-w-[450px] md:p-8">
          <DialogHeader className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 left-4 h-8 w-8 p-0"
              onClick={() => setShowPaymentDialog(false)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="mb-4 flex flex-col items-start justify-start gap-4 pt-4">
              <img
                src="/nepdora-logooo.svg"
                alt="Nepdora"
                className="h-4 opacity-80"
              />
              <DialogTitle className="text-left text-2xl font-bold">
                Payment Method
              </DialogTitle>
            </div>
            <DialogDescription className="text-left text-sm text-balance md:text-base">
              Finalize your subscription to{" "}
              <strong>{selectedPlan?.name}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Selected Plan Summary */}
            <Card className="border-primary/20 bg-primary/5 -sm border-2">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <h3 className="text-base font-bold md:text-lg">
                      {selectedPlan?.name}
                    </h3>
                    <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                      {selectedPlan?.tagline}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="text-primary text-2xl font-black">
                      Rs.{Number(selectedPlan?.price || 0).toLocaleString()}
                    </div>
                    <div className="text-muted-foreground text-xs font-medium">
                      per {selectedPlan?.unit}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-muted-foreground/80 text-sm font-bold tracking-widest uppercase">
                Choose Payment Option
              </h3>
              <div className="grid gap-3">
                {PAYMENT_METHODS.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={cn(
                      "group relative flex items-center justify-between rounded-2xl border-2 p-4 transition-all duration-300",
                      selectedPaymentMethod === method.id
                        ? "border-primary bg-primary/[0.03] ring-primary/20 -md ring-1"
                        : "border-border hover:border-primary/30 hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 grayscale transition-all duration-300 group-hover:grayscale-0">
                        <Image
                          src={method.image}
                          alt={method.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-base font-bold">{method.name}</span>
                    </div>
                    <div
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300",
                        selectedPaymentMethod === method.id
                          ? "border-primary bg-primary scale-110"
                          : "border-muted-foreground/30"
                      )}
                    >
                      {selectedPaymentMethod === method.id && (
                        <Check className="h-3 w-3 stroke-[4] text-white" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <Button
                className="bg-primary hover:bg-primary/95 -lg hover:-xl w-full py-6 text-base font-black transition-all duration-300"
                disabled={!selectedPaymentMethod}
                onClick={handleConfirmPayment}
              >
                {selectedPaymentMethod
                  ? `Proceed with ${PAYMENT_METHODS.find(m => m.id === selectedPaymentMethod)?.name}`
                  : "Select a Method"}
              </Button>
              <p className="text-muted-foreground text-center text-[10px] font-bold tracking-tighter uppercase">
                🔒 Secure 256-bit SSL Encrypted Payment
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
