import test, { expect } from "@playwright/test";

test.describe("Authentication", () => {
  test.describe("User is unauthenticated", () => {
    test.use({
      storageState: "playwright-tests/storage-states/wallet-not-connected.json",
    });

    test("should be redirected to main screen", async ({ page }) => {
      // attempt to go to profile page
      await page.goto("/me");

      // expect to be redirected to help screen
      await page.waitForURL("**/help");

      await test.step("should not see nav option auth pages", async () => {
        const scanButton = page.getByRole("link", { name: "Scan" });
        await expect(scanButton).not.toBeVisible();

        const walletButton = page.getByRole("link", { name: "Wallet" });
        await expect(walletButton).not.toBeVisible();

        const meButton = page.getByRole("link", { name: "Me" });
        await expect(meButton).not.toBeVisible();
      });

      await test.step("should see nav option to agenda and be able to navigate", async () => {
        await page.getByRole("link", { name: "Agenda" }).click();

        const agendaHeader = page.getByRole("heading", { name: "Agenda" });
        await expect(agendaHeader).toBeVisible();
      });
    });
  });
});
