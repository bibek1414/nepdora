import React from "react";

export const PaymentIntegration: React.FC = () => {
  return (
    <section className="bg-white py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="max-w-2xl text-center lg:text-left">
            <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:mb-8 md:text-5xl">
              Accept Local Payments Instantly
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-slate-600 md:mb-10 md:text-xl">
              Your customers in Nepal can pay directly through your website
              using their favorite digital wallets. No more manual bank
              transfers or payment confirmation screenshots.
            </p>
            <ul className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              {[
                "Direct Checkout Integration",
                "Instant Payment Alerts",
                "Secure Transactions",
                "Easy Settlement Tracking",
              ].map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center justify-center gap-3 text-base font-medium text-slate-700 sm:justify-start md:text-lg"
                >
                  <div className="h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid w-full shrink-0 grid-cols-2 justify-items-center gap-4 sm:gap-8 lg:w-auto lg:grid-cols-2">
            {[
              { name: "eSewa", logo: "/images/payment-gateway/esewa.png" },
              { name: "Khalti", logo: "/images/payment-gateway/khalti.png" },
            ].map((payment, i) => (
              <div
                key={i}
                className="flex aspect-square h-32 w-32 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 shadow-sm transition-all hover:scale-105 hover:bg-white hover:shadow-md sm:h-40 sm:w-40 sm:gap-4 sm:rounded-3xl"
              >
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden sm:h-16 sm:w-16">
                  <img
                    src={payment.logo}
                    alt={`${payment.name} logo`}
                    className="h-full w-full object-contain grayscale transition-all hover:grayscale-0"
                  />
                </div>
                <span className="text-xs font-bold text-slate-700 sm:text-sm">
                  {payment.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
