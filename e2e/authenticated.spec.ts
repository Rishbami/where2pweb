import { expect, test } from "@playwright/test";

const testEmail = process.env.E2E_TEST_EMAIL;
const testPassword = process.env.E2E_TEST_PASSWORD;

test.describe("authenticated flows", () => {
  test.skip(!testEmail || !testPassword, "E2E auth credentials not configured.");

  test("signed-in user can reach the add-toilet flow", async ({ page }) => {
    await page.goto("/auth");

    await page.getByLabel("Email").fill(testEmail ?? "");
    await page.getByLabel("Password").fill(testPassword ?? "");
    await page.getByRole("button", { name: "Login" }).click();

    await page.goto("/toilets/new");

    await expect(
      page.getByRole("heading", { name: "Drop the pin for your new toilet listing." }),
    ).toBeVisible();
    await expect(page.getByText("Listing owner")).toBeVisible();
  });
});
