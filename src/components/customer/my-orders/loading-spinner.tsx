const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200"></div>
        <div className="border-t-primary absolute top-0 left-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent"></div>
      </div>
      <p className="mt-4 text-sm text-gray-600">Loading your orders...</p>
    </div>
  );
};

export default LoadingSpinner;
