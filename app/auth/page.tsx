"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BadgeCheck, Database, ShieldCheck, UserRoundCheck } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/providers/AuthProvider";
import { DEMO_AUTH_PROFILES, getSessionLabel } from "@/lib/auth";
import type { UserRole } from "@/lib/types";

const ROLE_STYLES: Record<UserRole, string> = {
  tenant: "from-[#0F6E56] to-[#1EA97C]",
  landlord: "from-[#B45309] to-[#F2B84B]",
  admin: "from-[#111827] to-[#475569]",
};

const ROLE_ICONS: Record<UserRole, typeof UserRoundCheck> = {
  tenant: UserRoundCheck,
  landlord: BadgeCheck,
  admin: ShieldCheck,
};

export default function AuthPage() {
  const router = useRouter();
  const { session, signInAs, signOut } = useAuth();
  const roles = Object.values(DEMO_AUTH_PROFILES);

  const handleSignIn = (role: UserRole) => {
    const nextSession = signInAs(role);
    router.push(DEMO_AUTH_PROFILES[nextSession.user.role].nextPath);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8EA]">
      <Nav />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-[#101A18] text-white">
          <div className="rd-kente-strip h-1.5" />
          <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-brand/30 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#F2B84B]/20 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-4 py-16">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F2B84B]">Account foundation</p>
            <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
                  Sign in as tenant, landlord, or ops before we connect the real database.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-white/68">
                  This is a demo session system. It helps us test role-based journeys now, then swap the storage behind it for real authentication when Supabase, Firebase, or another provider is connected.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/8 p-5 shadow-2xl backdrop-blur">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-[#F2B84B] p-3 text-[#101A18]">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black">Current session</p>
                    <p className="mt-1 text-sm text-white/62">{getSessionLabel(session)}</p>
                  </div>
                </div>
                {session && (
                  <button
                    type="button"
                    onClick={signOut}
                    className="mt-4 rounded-full border border-white/15 px-4 py-2 text-xs font-black text-white/75 hover:bg-white/10"
                  >
                    Sign out demo user
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-5 md:grid-cols-3">
            {roles.map((profile) => {
              const Icon = ROLE_ICONS[profile.role];
              return (
                <article key={profile.role} className="rd-card group overflow-hidden rounded-[1.75rem]">
                  <div className={`h-2 bg-linear-to-r ${ROLE_STYLES[profile.role]}`} />
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className={`rounded-2xl bg-linear-to-br ${ROLE_STYLES[profile.role]} p-3 text-white shadow-lg`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-surface px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#64748B]">
                        {profile.role}
                      </span>
                    </div>
                    <h2 className="mt-5 text-xl font-black text-[#0F172A]">{profile.headline}</h2>
                    <p className="mt-3 text-sm leading-6 text-[#64748B]">{profile.promise}</p>
                    <div className="mt-5 rounded-2xl border border-black/10 bg-white px-4 py-3">
                      <p className="text-sm font-black text-[#0F172A]">{profile.name}</p>
                      <p className="mt-0.5 text-xs text-[#64748B]">{profile.phone} - {profile.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSignIn(profile.role)}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#101A18] px-5 py-3 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-brand"
                    >
                      Continue as {profile.role}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-black/10 bg-white p-5">
            <p className="text-sm font-black text-[#0F172A]">Next production connection</p>
            <p className="mt-2 text-sm leading-6 text-[#64748B]">
              When you are ready, we connect these roles to a real auth provider, move listings/reports/payments into a database, and protect landlord/admin actions on the server.
            </p>
            <Link href="/launch" className="mt-4 inline-flex text-sm font-black text-brand hover:underline">
              View launch plan
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
