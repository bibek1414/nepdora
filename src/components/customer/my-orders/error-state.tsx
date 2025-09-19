import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
      <div className="mb-4 text-red-400">
        <AlertCircle className="mx-auto h-12 w-12" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-red-900">
        Something went wrong
      </h3>
      <p className="mb-6 text-red-700">{error}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
};

export default ErrorState;
