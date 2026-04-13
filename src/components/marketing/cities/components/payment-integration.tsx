import { Check } from "lucide-react";

const paymentFeatures = [
  "Direct checkout - no redirect, no friction",
  "Instant payment alerts to your dashboard",
  "Secure, encrypted transactions",
  "Easy settlement tracking and reports",
];

const gateways = [
  { name: "eSewa", logo: "/images/payment-gateway/esewa.png" },
  { name: "Khalti", logo: "/images/payment-gateway/khalti.png" },
  { name: "Fonepay", logo: "/images/payment-gateway/fonepay.png" },
  { name: "ConnectIPS", logo: "/images/payment-gateway/connectips.png" },
];

export const PaymentIntegration: React.FC = () => {
  return (
    <section className="border-t border-slate-100 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-0">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text */}
          <div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Accept Nepal&apos;s favourite payments, instantly
            </h2>
            <p className="mb-7 text-base leading-relaxed text-slate-500">
              Your customers pay with eSewa, Khalti, Fonepay, or ConnectIPS -
              the wallets they already use. No manual transfers, no payment
              screenshots.
            </p>
            <ul className="space-y-3">
              {paymentFeatures.map(f => (
                <li key={f} className="flex items-start gap-3">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                    strokeWidth={2}
                  />
                  <span className="text-sm leading-relaxed text-slate-700">
                    {f}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment logos */}
          <div className="grid grid-cols-2 gap-4">
            {gateways.map(gw => (
              <div
                key={gw.name}
                className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-8"
              >
                <img
                  src={gw.logo}
                  alt={`${gw.name} payment gateway`}
                  className="h-10 w-auto object-contain"
                />
                <span className="text-xs font-semibold text-slate-600">
                  {gw.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
