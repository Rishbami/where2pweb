import { expect, test } from "@playwright/test";

test.describe("account page", () => {
  test("shows the guest auth prompt when signed out", async ({ page }) => {
    await page.goto("/auth");

    await expect(
      page.getByRole("heading", { name: "Log in to unlock your profile." }),
    ).toBeVisible();
  });
});
