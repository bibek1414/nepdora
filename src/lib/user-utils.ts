import { User } from "@/types/auth/auth";

/**
 * Extract initials from a user's name
 * @param name - The user's full name
 * @returns Initials (max 2 characters)
 */
export function getUserInitials(name: string): string {
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase())
    .join("")
    .substring(0, 2);
}

/**
 * Generate an avatar URL for a user using UI Avatars service
 * @param name - The user's name to display in the avatar
 * @returns Avatar URL
 */
export function generateUserAvatar(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=3b82f6&color=ffffff&size=32&rounded=true&bold=true`;
}

/**
 * Get the display name for a user with fallbacks
 * @param user - The user object
 * @returns Display name (store_name, email, or "User")
 */
export function getUserDisplayName(user: User): string {
  return user.store_name || user.email || "User";
}
