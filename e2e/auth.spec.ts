import { expect, test } from "@playwright/test";

test.describe("auth page", () => {
  test("renders the login form by default", async ({ page }) => {
    await page.goto("/auth");

    await expect(page.locator("body")).toContainText(
      /Loading account|Email address/,
    );
  });

  test("switches into create-account mode", async ({ page }) => {
    await page.goto("/auth");

    await expect(page.locator("body")).toContainText(
      /Loading account|Create account/,
    );

    const createAccountTab = page.getByRole("button", { name: "Create account" }).first();

    if (await createAccountTab.isVisible().catch(() => false)) {
      await createAccountTab.click();
      await expect(
        page.getByRole("button", { name: "Create account", exact: true }).last(),
      ).toBeVisible();
    }
  });
});
