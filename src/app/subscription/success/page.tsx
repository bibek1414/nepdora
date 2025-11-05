import { Suspense } from "react";
import SuccessPage from "./success-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          <Card className="mx-4 w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                <span>Loading...</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600">
                Preparing payment verification...
              </p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <SuccessPage />
    </Suspense>
  );
}
