import { expect, test } from "@playwright/test";
import { EVENT_FUNDER_KEY } from "../utils/constants";
import { mockTransactionSubmitRPCResponses } from "../utils/transaction-mock";
import { mockRpcRequest } from "../utils/rpc-mock";

test.describe("Dashboard", () => {
  test.describe("Sponsor is unauthenticated", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/dashboard");
    });

    // test("should show error, please connect page", async ({ page }) => {
    //   // TODO: Add test for this
    // });
  });

  test.describe("Sponsor is authenticated", () => {
    test.beforeEach(async ({ page }) => {
      await mockRpcRequest({
        page,
        filterParams: {
          method_name: "get_drops_created_by_account",
        },
        mockedResult: [
          {
            type: "token",
            base: {
              scavenger_hunt: null,
              name: "Testing",
              image:
                "bafybeibadywqnworqo5azj4rume54j5wuqgphljds7haxdf2kc45ytewpy",
              id: "proximity.1724680439172-factory.testnet||0",
              num_claimed: 0,
            },
            amount: "1000000000000000000000000",
          },
        ],
      });

      await page.goto(`/dashboard?connection=${EVENT_FUNDER_KEY}`);
      await page.waitForLoadState("networkidle");
    });

    test("should create a token drop", async ({ page }) => {
      const createDropButton = page.getByRole("button", {
        name: "CREATE DROP",
      });

      const tokenDropButton = page.getByRole("menuitem", {
        name: "Token Drop",
      });

      await test.step("should show token drop button in dropdown", async () => {
        await createDropButton.click();

        await expect(tokenDropButton).toBeVisible();
      });

      await test.step("should show token drop form", async () => {
        await page.getByRole("menuitem", { name: "Token Drop" }).click();
        await expect(
          page.getByRole("heading", { name: "Create Drop" }),
        ).toBeVisible();
      });

      await test.step("should close the token drop modal", async () => {
        const cancelButton = page.getByRole("button", { name: "Cancel" });
        await cancelButton.click();
        await expect(
          page.getByRole("heading", { name: "Create Drop" }),
        ).not.toBeVisible();
      });

      await test.step("should create a token drop", async () => {
        await createDropButton.click();

        await page.getByRole("menuitem", { name: "Token Drop" }).click();

        await page.getByLabel("Name*").fill("Test Token Drop");
        await page
          .locator('input[type="file"]')
          .setInputFiles("public/assets/redacted/explorer-pass.png");
        await page.getByPlaceholder("Custom").fill("100");

        // MOCKING THE API CALL

        await mockTransactionSubmitRPCResponses(page);

        await page.getByRole("button", { name: "Create" }).click();

        const successMessage = page.getByText("Drop created successfully.");

        await expect(successMessage).toBeVisible();

        await expect(page.getByText("QR Code", { exact: true })).toBeVisible();
      });
    });

    test("should create an nft drop", async ({ page }) => {
      const createDropButton = page.getByRole("button", {
        name: "CREATE DROP",
      });

      const nftDropButton = page.getByRole("menuitem", {
        name: "NFT Drop",
      });

      await test.step("should show nft drop button in dropdown", async () => {
        await createDropButton.click();

        await expect(nftDropButton).toBeVisible();
      });

      await test.step("should show nft drop form", async () => {
        await page.getByRole("menuitem", { name: "NFT Drop" }).click();

        await expect(
          page.getByRole("heading", { name: "Create Drop" }),
        ).toBeVisible();
      });

      await test.step("should close the nft drop modal", async () => {
        const cancelButton = page.getByRole("button", { name: "Cancel" });
        await cancelButton.click();
        await expect(
          page.getByRole("heading", { name: "Create Drop" }),
        ).not.toBeVisible();
      });

      await test.step("should create an nft drop", async () => {
        await createDropButton.click();

        await page.getByRole("menuitem", { name: "NFT Drop" }).click();

        await page.getByLabel("Name*").fill("Test NFT Drop");
        await page.getByLabel("NFT Title*").fill("Test NFT Title");
        await page.getByLabel("NFT Description*").fill("Test NFT Description");
        await page
          .locator('input[type="file"]')
          .setInputFiles("public/assets/redacted/explorer-pass.png");

        // MOCKING THE API CALL

        await mockTransactionSubmitRPCResponses(page);

        await page.getByRole("button", { name: "Create" }).click();

        const successMessage = page.getByText("Drop created successfully.");

        await expect(successMessage).toBeVisible();

        await expect(page.getByText("QR Code", { exact: true })).toBeVisible();
      });
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
