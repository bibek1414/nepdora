import { VerificationCard } from "@/components/auth/email-verification/verification-card";

export default function VerifyEmailPage({
  params,
}: {
  params: { key: string };
}) {
  const verificationKey = params.key;
  const decodedKey = decodeURIComponent(verificationKey);
  return <VerificationCard decodedKey={decodedKey} />;
}
