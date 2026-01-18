import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  isVisible: boolean;
}

export const LoadingScreen = ({ isVisible }: LoadingScreenProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      {/* Progress Bar */}
      <div className="absolute top-0 right-0 left-0 h-1 bg-gray-200">
        <div
          className="bg-primary h-full transition-all duration-[5000ms] ease-linear"
          style={{ width: "100%" }}
        />
      </div>

      {/* Logo and Content */}
      <div className="flex flex-col items-center space-y-6">
        <img
          src="/nepdora-logooo.svg"
          alt="Nepdora Sitebuilder+"
          className="h-16 w-auto"
        />

        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-light text-gray-800">
            Nepdora Sitebuilder+
          </h2>
          <p className="text-gray-500">Getting everything ready...</p>
        </div>

        {/* Spinner */}
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>

      {/* Nepdora text at bottom */}
      <div className="absolute bottom-8">
        <p className="text-sm text-gray-400">nepdora</p>
      </div>
    </div>
  );
};
