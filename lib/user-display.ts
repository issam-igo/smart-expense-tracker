import type { User } from "@supabase/supabase-js";

function readMetadataString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

// Ordre de priorité : full_name > name > email.
export function getDisplayName(user: User): string {
  const fullName = readMetadataString(user.user_metadata.full_name);
  const name = readMetadataString(user.user_metadata.name);
  return fullName ?? name ?? user.email ?? "";
}

// "Issam Igout" -> "II" ; "John Doe" -> "JD" ; "john@gmail.com" -> "JO".
export function getInitials(source: string): string {
  const trimmed = source.trim();
  if (!trimmed) return "";

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  return trimmed.slice(0, 2).toUpperCase();
}
