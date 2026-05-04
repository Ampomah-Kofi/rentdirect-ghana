import type { User, UserRole } from "./types";

export interface DemoAuthProfile {
  role: UserRole;
  name: string;
  phone: string;
  email: string;
  headline: string;
  promise: string;
  nextPath: string;
}

export interface AuthSession {
  user: User;
  signed_in_at: string;
  provider: "demo";
}

export const DEMO_AUTH_PROFILES: Record<UserRole, DemoAuthProfile> = {
  tenant: {
    role: "tenant",
    name: "Ama Tenant",
    phone: "0550987654",
    email: "tenant@rentdirectghana.com",
    headline: "Find rooms without agent pressure",
    promise: "Save listings, compare options, message landlords, and report unsafe listings.",
    nextPath: "/browse",
  },
  landlord: {
    role: "landlord",
    name: "Kwame Asante",
    phone: "0244123456",
    email: "landlord@rentdirectghana.com",
    headline: "Publish verified rooms and collect receipts",
    promise: "Upload rooms, track review status, activate paid listings, and view tenant demand.",
    nextPath: "/landlord/dashboard",
  },
  admin: {
    role: "admin",
    name: "RentDirect Ops",
    phone: "0302000000",
    email: "ops@rentdirectghana.com",
    headline: "Keep the marketplace trusted",
    promise: "Review listings, resolve reports, monitor payments, and protect tenants.",
    nextPath: "/admin",
  },
};

export function createDemoSession(role: UserRole, now = new Date().toISOString()): AuthSession {
  const profile = DEMO_AUTH_PROFILES[role];

  return {
    provider: "demo",
    signed_in_at: now,
    user: {
      id: `demo-${role}`,
      role,
      name: profile.name,
      phone: profile.phone,
      email: profile.email,
      created_at: now,
    },
  };
}

export function getSessionLabel(session: AuthSession | null): string {
  if (!session) return "Guest";
  return `${session.user.name} (${session.user.role})`;
}

export function canAccessRole(session: AuthSession | null, allowedRoles: UserRole[]): boolean {
  if (!session) return false;
  return allowedRoles.includes(session.user.role);
}
