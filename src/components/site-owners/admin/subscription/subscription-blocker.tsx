"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSubscription } from "@/contexts/SubscriptionContext";
import {
  usePricingPlans,
  useUpgradeSubscription,
} from "@/hooks/use-subscription";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Check, Crown, Sparkles, Lock, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Payment method types
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

export function SubscriptionBlocker() {
  const router = useRouter();
  const {
    isActive,
    subscription,
    isLoading: statusLoading,
  } = useSubscription();
  const { data: plans, isLoading: plansLoading } = usePricingPlans();
  const [open, setOpen] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);

  useEffect(() => {
    // Show dialog if subscription is not active
    if (!statusLoading && !isActive) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isActive, statusLoading]);
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChoosePlan = (plan: any) => {
    if (plan.plan_type === "free") return;

    setSelectedPlan(plan);
    setShowPaymentDialog(true);
  };

  const handleBackToPlans = () => {
    setShowPaymentDialog(false);
    setSelectedPlan(null);
    setSelectedPaymentMethod(null);
  };

  const handleConfirmPayment = () => {
    if (!selectedPlan || !selectedPaymentMethod) return;

    // Store plan and payment data in sessionStorage for the payment page
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

    // Redirect to the appropriate payment page
    if (selectedPaymentMethod === "esewa") {
      router.push("/subscription/esewa-payment");
    } else if (selectedPaymentMethod === "khalti") {
      router.push("/subscription/khalti-payment");
    }
  };

  // Don't render anything while loading initial status
  if (statusLoading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="max-h-[90vh] !max-w-5xl scale-85"
        onInteractOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
        showCloseButton={false}
      >
        <AnimatePresence mode="wait">
          {!showPaymentDialog ? (
            // Plans Selection View
            <motion.div
              key="plans"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <div className="mb-2 flex items-center justify-center gap-2">
                  <DialogTitle className="text-3xl font-bold">
                    Upgrade Your Plan
                  </DialogTitle>
                </div>
                <DialogDescription className="text-center text-base">
                  {subscription?.status === "expired"
                    ? `Your subscription expired on ${new Date(subscription.expires_on).toLocaleDateString()}. Choose a plan to continue using all features.`
                    : "You need an active subscription to access admin features. Choose a plan to get started."}
                </DialogDescription>
              </DialogHeader>

              <div className="py-6">
                {plansLoading ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {[1, 2, 3].map(i => (
                      <Card key={i}>
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
                    {plans.map(plan => (
                      <Card
                        key={plan.id}
                        className={`relative gap-0 py-2 ${plan.is_popular ? "border-primary border-2 shadow-lg" : ""}`}
                      >
                        {plan.is_popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <Badge className="flex items-center gap-1 px-3 py-1">
                              <Sparkles className="h-3 w-3" />
                              POPULAR
                            </Badge>
                          </div>
                        )}

                        <CardHeader>
                          <CardTitle className="flex items-center justify-between text-xl">
                            {plan.name}
                            <Badge variant="outline" className="text-xs">
                              {plan.plan_type.toUpperCase()}
                            </Badge>
                          </CardTitle>
                          <CardDescription className="mb-2 text-sm">
                            {plan.tagline}
                          </CardDescription>
                          <div className="pt-2">
                            <span className="text-foreground text-4xl font-bold">
                              {Number(plan.price).toLocaleString("en-IN")}
                            </span>
                            <span className="text-muted-foreground ml-1 text-sm">
                              /{plan.unit}
                            </span>
                          </div>
                          {plan.description && (
                            <p className="text-muted-foreground mt-2 text-xs">
                              {plan.description}
                            </p>
                          )}
                        </CardHeader>
                        <CardFooter>
                          <Button
                            className="mb-2 w-full shadow-none"
                            variant={plan.is_popular ? "default" : "outline"}
                            size="lg"
                            onClick={() => handleChoosePlan(plan)}
                            disabled={plan.plan_type === "free"}
                          >
                            {plan.plan_type === "free"
                              ? "Current Plan"
                              : "Choose Plan"}
                          </Button>
                        </CardFooter>
                        <CardContent>
                          <ul className="space-y-1">
                            {plan.features
                              .sort((a, b) => a.order - b.order)
                              .map(feature => (
                                <li
                                  key={feature.id}
                                  className={`flex items-start gap-2 ${
                                    !feature.is_available ? "opacity-50" : ""
                                  }`}
                                >
                                  <Check
                                    className={`mt-0.5 h-5 w-5 flex-shrink-0 ${
                                      feature.is_available
                                        ? "text-green-500"
                                        : "text-gray-400"
                                    }`}
                                  />
                                  <div className="flex-1">
                                    <span className="text-xs">
                                      {feature.feature}
                                    </span>
                                    {feature.description && (
                                      <p className="text-muted-foreground mt-0.5 text-xs">
                                        {feature.description}
                                      </p>
                                    )}
                                  </div>
                                </li>
                              ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Lock className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                    <h3 className="mb-2 text-xl font-semibold">
                      No Plans Available
                    </h3>
                    <p className="text-muted-foreground">
                      Please contact support to activate your subscription.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            // Payment Method Selection View
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 left-4"
                  onClick={handleBackToPlans}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <div className="mb-2 flex flex-col items-center justify-center gap-2 pt-8">
                  <DialogTitle className="text-3xl font-bold">
                    Choose Payment Method
                  </DialogTitle>
                </div>
                <DialogDescription className="text-center text-base">
                  Select how you&apos;d like to pay for your{" "}
                  {selectedPlan?.name} subscription
                </DialogDescription>
              </DialogHeader>

              <div className="py-6">
                {/* Selected Plan Summary */}
                <Card className="border-primary/20 bg-primary/5 mb-6 border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {selectedPlan?.name}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {selectedPlan?.tagline}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">
                          Rs.{selectedPlan?.price}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          per {selectedPlan?.unit}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Methods */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Payment Options</h3>
                  <p className="text-muted-foreground text-sm">
                    Select your preferred payment method
                  </p>

                  <div className="grid gap-3">
                    <AnimatePresence mode="wait">
                      {PAYMENT_METHODS.map(method => (
                        <motion.div
                          key={method.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            className={cn(
                              "relative h-20 w-full justify-start overflow-hidden border text-left font-normal transition-all duration-300",
                              selectedPaymentMethod === method.id
                                ? "border-primary bg-primary/10 border-2"
                                : "border border-gray-300"
                            )}
                            onClick={() => setSelectedPaymentMethod(method.id)}
                          >
                            <div className="relative z-10 flex items-center gap-4">
                              <div className="relative h-12 w-12 flex-shrink-0">
                                <Image
                                  src={method.image}
                                  alt={method.name}
                                  fill
                                  className="object-contain"
                                  sizes="48px"
                                />
                              </div>
                              <span className="text-lg font-medium">
                                {method.name}
                              </span>
                            </div>

                            {selectedPaymentMethod === method.id && (
                              <motion.div
                                className="absolute top-1/2 right-4 -translate-y-1/2"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Check className="text-primary h-6 w-6" />
                              </motion.div>
                            )}
                          </Button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Confirm Button */}
                <div className="mt-8 space-y-3">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleConfirmPayment}
                    disabled={!selectedPaymentMethod}
                  >
                    {selectedPaymentMethod
                      ? `Continue to ${PAYMENT_METHODS.find(m => m.id === selectedPaymentMethod)?.name}`
                      : "Select Payment Method"}
                  </Button>

                  {selectedPaymentMethod && (
                    <p className="text-muted-foreground text-center text-xs">
                      You will be redirected to the payment page
                    </p>
                  )}
                </div>
              </div>

              <div className="text-muted-foreground border-t pt-4 text-center text-sm">
                <p>🔒 All payments are secure and encrypted</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
