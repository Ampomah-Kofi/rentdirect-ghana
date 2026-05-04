"use client";

import { usePathname } from "next/navigation";

type Role = {
  label: string;
  emoji: string;
  description: string;
  color: string;
  dot: string;
};

const ROLES: Record<string, Role> = {
  tenant: {
    label: "Tenant View",
    emoji: "T",
    description: "What renters see - only live, visible listings",
    color: "bg-blue-600",
    dot: "bg-blue-400",
  },
  landlord: {
    label: "Landlord View",
    emoji: "L",
    description: "Your private dashboard - manage your own listings",
    color: "bg-[#0F6E56]",
    dot: "bg-green-400",
  },
  admin: {
    label: "Admin View",
    emoji: "A",
    description: "Platform management - approve, reject, moderate all listings",
    color: "bg-gray-900",
    dot: "bg-red-400",
  },
};

function getRole(pathname: string): Role {
  if (pathname.startsWith("/admin")) return ROLES.admin;
  if (pathname.startsWith("/landlord") || pathname.startsWith("/messages")) return ROLES.landlord;
  return ROLES.tenant;
}

export default function ViewModeIndicator() {
  const pathname = usePathname();
  const role = getRole(pathname);

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 flex items-center gap-2 ${role.color} text-white text-xs font-semibold px-3 py-2 rounded-full shadow-lg opacity-90 hover:opacity-100 transition-opacity max-w-[90vw]`}
      title={role.description}
    >
      <span className={`w-2 h-2 rounded-full ${role.dot} animate-pulse shrink-0`} />
      <span>{role.emoji} {role.label}</span>
      <span className="hidden sm:inline text-white/60 font-normal">- {role.description}</span>
    </div>
  );
}



