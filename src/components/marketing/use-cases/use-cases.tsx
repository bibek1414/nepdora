import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import EcommerceSkeleton from "./eccomerce-skeleton";
import AgencySkeleton from "./agency-skeleton";

const UseCases: React.FC = () => {
  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between sm:mb-12 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Build Custom Website For Every Business
            </h2>
            <p className="text-lg text-slate-600">
              Whether you need to ship products or manage client relationships,
              we provide the specialized tools to help you scale.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* PRODUCT SALES CARD */}
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/40">
            <div className="flex h-full flex-col p-6 sm:p-8">
              <div className="mb-4">
                <div className="text-primary mb-3 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium">
                  E-Commerce
                </div>
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
                variant="outlineHover"
                className="group/btn mb-8 w-fit text-sm font-semibold"
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
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/40">
            <div className="flex h-full flex-col p-6 sm:p-8">
              <div className="mb-4">
                <div className="text-primary mb-3 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium">
                  Service Agency
                </div>
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
                variant="outlineHover"
                className="group/btn mb-8 w-fit text-sm font-semibold"
              >
                Start Building Agency
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
