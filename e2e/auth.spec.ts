import { expect, test } from "@playwright/test";

test.describe("auth page", () => {
  test("renders the login form by default", async ({ page }) => {
    await page.goto("/auth");

    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(
      page.locator("form").getByRole("button", { name: "Login" }),
    ).toBeVisible();
  });

  test("switches into create-account mode", async ({ page }) => {
    await page.goto("/auth");

    const createAccountTab = page.getByRole("button", { name: "Create account" }).first();
    await createAccountTab.click();
    await expect(
      page.getByRole("button", { name: "Create account", exact: true }).last(),
    ).toBeVisible();
  });
});
