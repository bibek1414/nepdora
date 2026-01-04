"use client";

import { Suspense } from "react";
import ContactManagement from "@/components/super-admin/contact/contact-management";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export default function ContactMessagesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactManagement />
    </Suspense>
  );
}
