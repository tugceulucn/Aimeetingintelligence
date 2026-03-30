import type { AppUser, SupabaseUser } from './supabaseAuth';

export type UserProfile = {
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  initials: string;
};

function getMetadataValue(user: SupabaseUser | null | undefined, key: string) {
  const value = user?.user_metadata?.[key];
  return typeof value === 'string' ? value.trim() : '';
}

export function getUserProfile(
  user: SupabaseUser | null | undefined,
  appUser?: AppUser | null
): UserProfile {
  const email = appUser?.email?.trim() || user?.email || 'user@company.com';
  const fullNameFromAppUser = appUser?.full_name?.trim() || '';
  const fullNameFromMetadata = getMetadataValue(user, 'full_name');
  const firstNameFromMetadata = getMetadataValue(user, 'first_name');
  const lastNameFromMetadata = getMetadataValue(user, 'last_name');
  const fallbackName = email.split('@')[0] || 'MeetInsight User';
  const resolvedFullName = fullNameFromAppUser || fullNameFromMetadata || fallbackName;
  const nameParts = resolvedFullName.split(/[\s._-]+/).filter(Boolean);
  const firstName = fullNameFromAppUser ? (nameParts[0] || 'MeetInsight') : (firstNameFromMetadata || nameParts[0] || 'MeetInsight');
  const lastName = fullNameFromAppUser ? (nameParts.slice(1).join(' ') || 'User') : (lastNameFromMetadata || nameParts.slice(1).join(' ') || 'User');
  const fullName = `${firstName} ${lastName}`.trim();
  const initials = [firstName, lastName]
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'MI';

  return {
    email,
    fullName,
    firstName,
    lastName,
    initials,
  };
}
