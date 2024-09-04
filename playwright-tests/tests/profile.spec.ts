import { FACTORY_ACCOUNT } from "./../utils/constants";
import test, { expect } from "@playwright/test";
import { mockRpcRequest } from "../utils/rpc-mock";

test.describe("Profile", () => {
  test.describe("User is authenticated", () => {
    test.use({
      storageState: "playwright-tests/storage-states/wallet-connected.json",
    });

    test.beforeEach(async ({ page }) => {
      await page.route("https://example.com/alerts", (route) => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([]),
        });
      });

      await mockRpcRequest({
        page,
        filterParams: {
          method_name: "recover_account",
        },
        mockedResult: {
          account_id: `anybody.${FACTORY_ACCOUNT}`,
        },
      });

      await mockRpcRequest({
        page,
        filterParams: {
          method_name: "ft_balance_of",
        },
        mockedResult: "50000000000000000000000000",
      });

      await page.goto("/me");
    });

    test("should see their balance, username, and event token symbol", async ({
      page,
    }) => {
      const nickName = page.getByText("No-Name Profile"); // TODO: need to modify
      await expect(nickName).toBeVisible();

      const userName = page.getByText(`@anybody.${FACTORY_ACCOUNT}`); // TODO: need to modify
      await expect(userName).toBeVisible();

      const balance = page.getByTestId("wallet-balance");
      await expect(balance).toHaveText("50.0000"); // TODO: need to modify

      const tokenSymbol = page.getByTestId("token-symbol");
      await expect(tokenSymbol).toHaveText("$SOV3"); // TODO: need to modify
    });
  });
});
