import assert from "node:assert/strict";
import { canAccessRole, createDemoSession, DEMO_AUTH_PROFILES, getSessionLabel } from "../lib/auth.ts";
import type { TestCase } from "./monetization.test.ts";

const STAMP = "2026-05-04T12:00:00.000Z";

export const authTests: TestCase[] = [
  {
    name: "demo auth profiles expose tenant landlord and admin journeys",
    run: () => {
      assert.equal(DEMO_AUTH_PROFILES.tenant.nextPath, "/browse");
      assert.equal(DEMO_AUTH_PROFILES.landlord.nextPath, "/landlord/dashboard");
      assert.equal(DEMO_AUTH_PROFILES.admin.nextPath, "/admin");
    },
  },
  {
    name: "createDemoSession builds a role-specific user session",
    run: () => {
      const session = createDemoSession("landlord", STAMP);

      assert.equal(session.provider, "demo");
      assert.equal(session.signed_in_at, STAMP);
      assert.equal(session.user.id, "demo-landlord");
      assert.equal(session.user.role, "landlord");
      assert.equal(session.user.name, "Kwame Asante");
    },
  },
  {
    name: "role access helper only allows matching roles",
    run: () => {
      const admin = createDemoSession("admin", STAMP);

      assert.equal(canAccessRole(admin, ["admin"]), true);
      assert.equal(canAccessRole(admin, ["tenant", "landlord"]), false);
      assert.equal(canAccessRole(null, ["admin"]), false);
    },
  },
  {
    name: "session label describes guest and signed in users",
    run: () => {
      assert.equal(getSessionLabel(null), "Guest");
      assert.equal(getSessionLabel(createDemoSession("tenant", STAMP)), "Ama Tenant (tenant)");
    },
  },
];
