import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import EcommerceSkeleton from "./eccomerce-skeleton";
import AgencySkeleton from "./agency-skeleton";

const UseCases: React.FC = () => {
  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* PRODUCT SALES CARD */}
          <div className="group bg-secondary relative overflow-hidden rounded-3xl transition-all duration-300">
            <div className="flex h-full flex-col p-6 sm:p-8">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  If you sell products
                </h3>
              </div>

              <p className="mb-6 text-sm leading-relaxed text-slate-600 sm:text-base">
                Complete online store with inventory management, secure checkout
                flow, and local payment gateways (eSewa, Fonepay) built-in.
              </p>

              <Button
                size="default"
                rounded={true}
                variant="outlineHover"
                className="group/btn mb-8 w-fit text-sm"
              >
                Start Building Store
                <ChevronRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
              </Button>

              {/* Animation Container */}
              <div className="relative mt-auto aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-inner">
                <EcommerceSkeleton />
              </div>
            </div>
          </div>

          {/* SERVICE SALES CARD */}
          <div className="group bg-secondary relative overflow-hidden rounded-3xl transition-all duration-300">
            <div className="flex h-full flex-col p-6 sm:p-8">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  If you sell services
                </h3>
              </div>

              <p className="mb-6 text-sm leading-relaxed text-slate-600 sm:text-base">
                Professional portfolio sites with integrated CRM, automated
                email campaigns, and comprehensive project management tools.
              </p>

              <Button
                size="default"
                rounded={true}
                variant="outlineHover"
                className="group/btn mb-8 w-fit text-sm"
              >
                Start Building Website
                <ChevronRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
              </Button>

              {/* Animation Container */}
              <div className="relative mt-auto aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-inner">
                <AgencySkeleton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
