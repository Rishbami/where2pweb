import { expect, test } from "@playwright/test";

test.describe("search experience", () => {
  test("redirects root traffic into search", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/search$/);
    await expect(
      page.getByRole("heading", { name: "Find a clean toilet fast." }),
    ).toBeVisible();
  });

  test("shows the guest browse shell on search", async ({ page }) => {
    await page.goto("/search");

    await expect(
      page.getByRole("heading", { name: "Find a clean toilet fast." }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Use my location" }),
    ).toBeVisible();
    await expect(
      page.getByPlaceholder("Enter a neighbourhood or landmark"),
    ).toBeVisible();
  });

  test("shows the add-toilet guest entry point on the map card", async ({ page }) => {
    await page.goto("/search");

    await expect(
      page.getByRole("link", { name: "Log in to add a new toilet" }),
    ).toBeVisible();
  });
});
