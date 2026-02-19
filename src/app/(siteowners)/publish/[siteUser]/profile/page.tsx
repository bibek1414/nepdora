import { ProfilePageContent } from "@/components/customer/profile/ProfilePageContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile - Nepdora",
  description: "Manage your Nepdora profile and preferences.",
};

export default function ProfilePage() {
  return (
    <div className="bg-secondary/10 min-h-screen">
      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-foreground mb-2 text-3xl font-extrabold md:text-4xl">
              My Profile
            </h1>
            <p className="text-muted-foreground">
              Manage your personal information and preferences.
            </p>
          </div>

          <ProfilePageContent />
        </div>
      </main>
    </div>
  );
}
