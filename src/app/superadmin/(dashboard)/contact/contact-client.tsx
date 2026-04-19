"use client";

import { Suspense } from "react";
import ContactManagement from "@/components/super-admin/contact/contact-management";

export default function ContactClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactManagement />
    </Suspense>
  );
}
