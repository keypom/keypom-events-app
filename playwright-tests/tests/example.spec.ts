import { test, expect } from "@playwright/test";

test.describe("wallet", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/wallet");
  });

  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected.json",
  });

  test('should be able to go to ', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Click the get started link.
    await page.getByRole('link', { name: 'Get started' }).click();

    // Expects page to have a heading with the name of Installation.
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  });
});
