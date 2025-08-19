import { VerificationCard } from "@/components/auth/email-verification/verification-card";
import { use } from "react";
interface VerifyEmailPageProps {
  params: Promise<{ key: string }>;
}

export default function VerifyEmailPage({ params }: VerifyEmailPageProps) {
  const { key } = use(params);
  const verificationKey = key;
  const decodedKey = decodeURIComponent(verificationKey);

  return <VerificationCard decodedKey={decodedKey} />;
}
