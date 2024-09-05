import test, { expect } from "@playwright/test";
import { mockTransactionSubmitRPCResponses } from "../utils/transaction-mock";

test.describe("Wallet", () => {
  test.use({
    storageState: "playwright-tests/storage-states/wallet-connected.json",
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/wallet");
  });

  test("should be able to send token", async ({ page }) => {
    const walletSendButton = page.getByRole("link", { name: "Send" });
    await walletSendButton.click();

    await test.step("should show set recipient page", async () => {
      const recipientPageTitle = page.getByText("choose recipient");
      await expect(recipientPageTitle).toBeVisible();
    });

    await test.step("should go back on cancel ", async () => {
      const cancelButton = page.getByRole("button", { name: "Cancel" });
      await cancelButton.click();
      const walletPageTitle = page.getByRole("heading", { name: "Wallet" });
      await expect(walletPageTitle).toBeVisible();

      await walletSendButton.click();
    });

    const recipientInput = page.getByPlaceholder("account.near");
    const continueButton = page.getByRole("button", { name: "Continue" });

    await test.step("should disable button for invalid recipient", async () => {
      await recipientInput.fill("test");
      await recipientInput.blur();
      await expect(continueButton).not.toBeEnabled();
    });

    await test.step("should be able to set recipient", async () => {
      await recipientInput.fill("anybody.near");
      await recipientInput.blur();
      await expect(continueButton).toBeEnabled();
    });

    await continueButton.click();

    await test.step("should go back on back button", async () => {
      const backButton = page.getByRole("button", { name: "Back" });
      await backButton.click();
      const recipientPageTitle = page.getByText("choose recipient");
      await expect(recipientPageTitle).toBeVisible();

      await continueButton.click();
    });

    const amountInput = page.getByPlaceholder("789.56");
    const continueSendButton = page.getByRole("button", { name: "Send" });

    await test.step("send should be disabled", async () => {
      expect(amountInput).toBeEmpty();
      expect(continueSendButton).not.toBeEnabled();
    });

    await test.step("should be able to set amount", async () => {
      await amountInput.fill("10");
      await amountInput.blur();
      await expect(continueSendButton).toBeEnabled();
    });

    await test.step("should execute transaction on send and show success splash", async () => {
      await mockTransactionSubmitRPCResponses(page);
      await continueSendButton.click();
      const numSent = page.getByText("10 SENT");
      await expect(numSent).toBeVisible();
      const sentTo = page.getByText("to anybody.near");
      await expect(sentTo).toBeVisible();
    });
  });
});
