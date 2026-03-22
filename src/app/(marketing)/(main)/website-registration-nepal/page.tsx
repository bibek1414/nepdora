import { Metadata } from "next";
import CTASection from "@/components/marketing/cta-section/cta-section";

export const metadata: Metadata = {
  title: "Website Registration & Legal Compliance in Nepal | Business Guide",
  description: "How to legally register your website and online business in Nepal. Guide on PAN/VAT, company registration, and Department of Commerce requirements.",
};

export default function RegistrationPage() {
  return (
    <main className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight">
          Registering Your <span className="text-primary">Online Business</span> in Nepal
        </h1>
        <div className="prose prose-slate prose-lg lg:prose-xl max-w-none">
           <p className="lead">
             Starting an online business in Nepal involves more than just building a website. 
             You need to ensure legal compliance to avoid penalties.
           </p>
           <h3>1. PAN and VAT Registration</h3>
           <p>
             Every business must be registered with the Inland Revenue Department (IRD). 
             Depending on your turnover, you might need a PAN or a VAT certificate.
           </p>
           <h3>2. Department of Commerce</h3>
           <p>
             E-commerce businesses are required to register with the Department of Commerce, 
             Supplies and Consumer Protection.
           </p>
           <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 my-10 text-slate-800">
               <h4 className="font-bold mb-2">Pro Tip:</h4>
               <p>Nepdora partners with legal experts to help our users navigate the registration process easily.</p>
           </div>
        </div>
      </div>
      <CTASection />
    </main>
  );
}
