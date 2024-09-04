import test, { expect } from "@playwright/test";
import { mockRpcRequest } from "../utils/rpc-mock";

test.describe("Profile", () => {
  test.describe("User is authenticated", () => {
    test.use({
      storageState: "playwright-tests/storage-states/wallet-connected.json",
    });

    test.beforeEach(async ({ page }) => {
      await mockRpcRequest({
        page,
        filterParams: {
          method_name: "recover_account",
        },
        mockedResult: {
          account_id: "anybody.testnet", // TODO: need to modify
        },
      });

      await mockRpcRequest({
        page,
        filterParams: {
          method_name: "ft_balance_of",
        },
        mockedResult: {
          balance: "100", // TODO: need to modify
        },
      });

      await page.goto("/me");
    });

    test("should see their balance, username, and event token symbol", async ({
      page,
    }) => {
      const userName = page.getByText("No-Name Profile"); // TODO: need to modify
      await expect(userName).toBeVisible();

      const balance = page.getByTestId("wallet-balance");
      await expect(balance).toHaveText("789.56"); // TODO: need to modify

      const tokenSymbol = page.getByTestId("token-symbol");
      await expect(tokenSymbol).toHaveText("$SOV3"); // TODO: need to modify
    });
  });
});
