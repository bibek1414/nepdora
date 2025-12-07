import { useState } from "react";

export const useNewsletter = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = (email: string, options?: { onSuccess?: () => void }) => {
    setIsPending(true);
    // Simulate API call
    setTimeout(() => {
      setIsPending(false);
      if (options?.onSuccess) {
        options.onSuccess();
      }
    }, 1000);
  };

  return { mutate, isPending };
};
