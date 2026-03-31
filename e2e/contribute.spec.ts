import { expect, test } from "@playwright/test";

test.describe("contribution guards", () => {
  test("requires login before adding a toilet", async ({ page }) => {
    await page.goto("/toilets/new");

    await expect(page.locator("body")).toContainText(
      /Checking account access|Log in to add a new toilet\./,
    );
  });
});
