import { expect, test } from "@playwright/test";

test.describe("account page", () => {
  test("shows the guest auth prompt when signed out", async ({ page }) => {
    await page.goto("/auth");

    await expect(page.locator("body")).toContainText(
      /Loading account|Log in to unlock your profile\./,
    );
  });
});
