import { expect, test } from "@playwright/test";

test.describe("Dashboard", () => {
  test.describe("User is authenticated", () => {
    test.use({
      storageState: "playwright-tests/storage-states/wallet-connected.json",
    });

    test("should show the dashboard", async ({ page }) => {
      await page.goto(
        "/dashboard?connection=eyJkaXNwbGF5TmFtZSI6InByb3hpbWl0eSIsImFjY291bnRJZCI6IjE3MjQ2ODA0MzkxNzItZmFjdG9yeS50ZXN0bmV0Iiwid2FsbGV0SWQiOiJzd2VhdC13YWxsZXQiLCJzZWNyZXRLZXkiOiJlZDI1NTE5OjJiRnp4cEtVUUhpcWNjY1loTmpMWWU5dmU3eDd0ZWJKYmZDdTJ1YldEMVBmSmoySGJCUmY4NkdIaVRaeFYyeDNodmV2bUVwY0NFM2FueEdydGRLRU5GVnUifQ==",
      );

      const dashboardTitle = page.getByText("Welcome user");
      await expect(dashboardTitle).toBeVisible();
    });
    test("should show Create Drop Modal", async ({ page }) => {
      await page.goto("/dashboard");

      await page.waitForLoadState("networkidle");
      const createDropButton = page.getByRole("button", {
        name: "CREATE DROP",
      });
      await expect(createDropButton).toBeVisible();
      await createDropButton.click();

      const createDropModal = page.getByRole("dialog", {
        name: "Create Drop",
      });
      await expect(createDropModal).toBeVisible();
    });
  });
});
