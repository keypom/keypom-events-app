import { expect, test } from "@playwright/test";

test.describe("Dashboard", () => {
  test.describe("User is authenticated", () => {
    test.use({
      storageState: "playwright-tests/storage-states/wallet-connected.json",
    });

    test.beforeEach(async ({ page }) => {
      await page.goto(
        "/dashboard?connection=eyJkaXNwbGF5TmFtZSI6InByb3hpbWl0eSIsImFjY291bnRJZCI6IjE3MjQ2ODA0MzkxNzItZmFjdG9yeS50ZXN0bmV0Iiwid2FsbGV0SWQiOiJzd2VhdC13YWxsZXQiLCJzZWNyZXRLZXkiOiJlZDI1NTE5OjJiRnp4cEtVUUhpcWNjY1loTmpMWWU5dmU3eDd0ZWJKYmZDdTJ1YldEMVBmSmoySGJCUmY4NkdIaVRaeFYyeDNodmV2bUVwY0NFM2FueEdydGRLRU5GVnUifQ==",
      );
      await page.waitForLoadState("networkidle");
    });

    test("should show the dashboard", async ({ page }) => {
      await expect(page.getByText("Welcome user")).toBeVisible();
    });

    test("should show and interact with Create Drop Modal", async ({
      page,
    }) => {
      const createDropButton = page.getByRole("button", {
        name: "CREATE DROP",
      });
      await createDropButton.click();

      const tokenDropButton = page.getByRole("menuitem", {
        name: "Token Drop",
      });
      const nftDropButton = page.getByRole("menuitem", { name: "NFT Drop" });

      await expect(tokenDropButton).toBeVisible();
      await expect(nftDropButton).toBeVisible();

      await tokenDropButton.click();
      await expect(
        page.getByRole("heading", { name: "Create Drop" }),
      ).toBeVisible();

      const cancelButton = page.getByRole("button", { name: "Cancel" });
      await cancelButton.click();
    });

    test("should create a token drop", async ({ page }) => {
      await page.getByRole("button", { name: "CREATE DROP" }).click();
      await page.getByRole("menuitem", { name: "Token Drop" }).click();

      await page.getByLabel("Name*").fill("Test Token Drop");
      await page
        .locator('input[type="file"]')
        .setInputFiles("public/assets/redacted/explorer_pass.png");
      await page.getByPlaceholder("Custom").fill("100");

      await page.getByRole("button", { name: "Create" }).click();

      // await expect(page.getByText("Drop created successfully.")).toBeVisible();
      // await page.getByRole("button", { name: "Get QR Code" }).first().click();
      await expect(page.getByText("QR Code", { exact: true })).toBeVisible();
    });

    test("should create an NFT drop", async ({ page }) => {
      await page.getByRole("button", { name: "CREATE DROP" }).click();
      await page.getByRole("menuitem", { name: "NFT Drop" }).click();

      await page.getByLabel("Name*").fill("Test NFT Drop");
      await page.getByLabel("NFT Title*").fill("Test NFT Title");
      await page.getByLabel("NFT Description*").fill("Test NFT Description");
      await page
        .locator('input[type="file"]')
        .setInputFiles("public/assets/redacted/explorer_pass.png");

      await page.getByRole("button", { name: "Create" }).click();

      await expect(page.getByText("QR Code", { exact: true })).toBeVisible();
    });

    test("should show Get QR Code Modal", async ({ page }) => {
      await page.getByRole("button", { name: "Get QR Code" }).first().click();
      await expect(page.getByText("QR Code", { exact: true })).toBeVisible();
    });

    test("should delete a drop", async ({ page }) => {
      const deleteButton = page.locator("tr").nth(1).locator("button").nth(1);

      await expect(deleteButton).toBeVisible();
      await deleteButton.click();
      const deleteConfirmationButton = page.getByRole("button", {
        name: "Delete",
      });
      await expect(deleteConfirmationButton).toBeVisible();
      await deleteConfirmationButton.click();
      await expect(page.getByText("Deletion Complete")).toBeVisible();
    });
  });
});
