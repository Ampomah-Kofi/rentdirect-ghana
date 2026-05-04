import { expect, test } from "@playwright/test";

test("autopilot completes listing, payment, browse, and report flow", async ({ page }) => {
  await page.goto("/demo/autopilot");

  await expect(page.getByRole("heading", { name: "Autopilot product walkthrough" })).toBeVisible();
  await page.getByRole("button", { name: "Reset Demo" }).click();
  await expect(page.getByText("Demo reset. Ready to run autopilot.")).toBeVisible();

  await page.getByRole("button", { name: "Start Autopilot" }).click();
  await expect(page.getByText("Tenant report submitted to admin queue.")).toBeVisible({ timeout: 25_000 });
  await expect(page.getByText("Featured").last()).toBeVisible();
  await expect(page.getByText("Visible").last()).toBeVisible();

  await page.goto("/browse");
  await expect(page.getByText("Self-contained room near UPSA").first()).toBeVisible();

  await page.goto("/admin");
  await page.getByRole("button", { name: /Payments/ }).click();
  await expect(page.getByText("Self-contained room near UPSA").first()).toBeVisible();
  await expect(page.getByText(/RD-/).first()).toBeVisible();

  await page.getByRole("button", { name: /Reports/ }).click();
  await expect(page.getByText("Suspected scam or fraud").first()).toBeVisible();
  await expect(page.getByText("Autopilot test report").first()).toBeVisible();
});

test("prototype guide shows clickable demo paths and test commands", async ({ page }) => {
  await page.goto("/demo");

  await expect(page.getByRole("heading", { name: "Click the whole company into shape." })).toBeVisible();
  await expect(page.getByRole("link", { name: /Start as Tenant/ })).toHaveAttribute("href", "/browse");
  await expect(page.getByRole("link", { name: /Start as Landlord/ })).toHaveAttribute("href", "/landlord/upload");
  await expect(page.getByRole("link", { name: /Open Flow/ }).first()).toBeVisible();
  await expect(page.getByText("& npm.cmd run test")).toBeVisible();
  await expect(page.getByText("& npm.cmd run typecheck")).toBeVisible();
});
