import { expect, test } from "@playwright/test";
import {
  DROP_ID,
  EVENT_ID,
  FACTORY_ACCOUNT,
  FUNDER_ID,
  UNSCANNED_TICKET_HASH,
} from "../utils/constants";
import { mockRpcRequest } from "../utils/rpc-mock";
// import { mockTransactionSubmitRPCResponses } from "../utils/transaction-mock";

test.describe("Basic valid ticketing (User shows ticket)", () => {
  test.describe("Ticket has not been scanned, ticket exists", () => {
    test.beforeEach(async ({ page }) => {
      await mockRpcRequest({
        page,
        filterParams: {
          method_name: "get_key_information",
        },
        mockedResult: {
          uses_remaining: 3,
          drop_id: DROP_ID,
        },
      });

      await mockRpcRequest({
        page,
        filterParams: {
          method_name: "get_drop_information",
        },
        modifyOriginalResultFunction: (result) => {
          result.funder_id = FUNDER_ID;
          result.drop_config.nft_keys_config.token_metadata.extra =
            JSON.stringify({ eventId: EVENT_ID });
          result.max_key_uses = 3;
          result.asset_data = [
            { config: { root_account_id: "1724680439172-kp-ticketing" } },
            { config: { root_account_id: FACTORY_ACCOUNT } },
          ];
          return result;
        },
      });

      await mockRpcRequest({
        page,
        filterParams: {
          methodName: "ft_metadata",
        },
        modifyOriginalResultFunction: (result) => {
          result.symbol = "SOV3";
          return result;
        },
      });

      await mockRpcRequest({
        page,
        filterParams: {
          contract_id: FACTORY_ACCOUNT,
          method_name: "get_ticket_data",
        },
        modifyOriginalResultFunction: (result) => {
          result.account_type = "Basic";
          return result;
        },
      });

      await mockRpcRequest({
        page,
        filterParams: {
          method_name: "get_funder_info",
        },
        modifyOriginalResultFunction: (result) => {
          result.metadata = JSON.stringify({
            [EVENT_ID]: {
              name: "Redacted 2025",
              dateCreated: "1724680461141",
              id: EVENT_ID,
              description:
                "Join us in Bangkok this November for [REDACTED] - a convergence of visionaries, builders, and pioneers from AI x Web3 backgrounds united in shaping a future where technology belongs to the people, not corporations.",
              location: "257 CHAROENNAKORN ROAD THONBURI BANGKOK 10600",
              date: {
                startDate: 1742702400000,
                endDate: 1743652800000,
              },
              artwork:
                "https://cloudflare-ipfs.com/ipfs/bafybeibadywqnworqo5azj4rume54j5wuqgphljds7haxdf2kc45ytewpy",
            },
          });

          return result;
        },
      });

      await page.goto(`/tickets/ticket/ga_pass#${UNSCANNED_TICKET_HASH}`);
    });

    test("should show the ticket QR page", async ({ page }) => {
      const QRPageTitle = await page.getByText(
        "You're attending Redacted 2025",
      );
      await expect(QRPageTitle).toBeVisible();
    });

    test("should navigate to welcome page after successful scan", async ({
      page,
    }) => {
      await mockRpcRequest({
        page,
        filterParams: {
          method_name: "get_key_information",
        },
        mockedResult: {
          uses_remaining: 2,
          drop_id: DROP_ID,
          message_nonce: 1,
        },
      });

      const WelcomePageTitle = await page.getByText("Welcome");
      await expect(WelcomePageTitle).toBeVisible();

      await test.step("should show appropriate token balance", async () => {
        const tokenBalance = await page.getByText("50 $SOV3");
        await expect(tokenBalance).toBeVisible();
      });

      const continueButton = page.getByRole("button", {
        name: "Begin Journey",
      });

      await test.step("should not enable begin journey if invalid username submitted", async () => {
        await mockRpcRequest({
          page,
          filterParams: {
            request_type: "view_account",
          },
          mockedResult: {
            // account already exists
            account_id: "testing123",
            balance: "0",
          },
        });
        await page.getByPlaceholder("Username").fill("testing123");

        // NEED TO BLUR TO TRIGGER VALIDATION
        await page.getByPlaceholder("Username").blur();

        const errorMessage = page.getByText(
          "Username is invalid or already taken.",
        );
        await expect(errorMessage).toBeVisible();

        expect(continueButton).not.toBeEnabled();
      });

      await mockRpcRequest({
        page,
        filterParams: {
          request_type: "view_account",
        },
        mockedError:
          "account testing12345.1724680439172-factory.testnet does not exist while viewing", // account does not exist
      });

      await test.step("should enable begin journey if valid username submitted", async () => {
        await page
          .getByPlaceholder("Username")
          .fill("basic-ticket-testing-unknown");

        // NEED TO BLUR TO TRIGGER VALIDATION
        await page.getByPlaceholder("Username").blur();

        await page.waitForTimeout(1000);

        const errorMessage = page.getByText(
          "Username is invalid or already taken.",
        );
        await expect(errorMessage).not.toBeVisible();

        expect(continueButton).toBeEnabled();
      });

      // TODO: I can't seem to mock the get_key_information, maybe because of an outdated contract?
      // If we can mock this, then the rest should validate the username and navigate to the me page

      // await mockRpcRequest({
      //   page,
      //   filterParams: {
      //     method_name: "get_key_information",
      //   },
      //   mockedResult: {
      //     uses_remaining: 2,
      //     drop_id: DROP_ID,
      //     message_nonce: 1,
      //     required_gas: "100000000000000",
      //   },
      // })

      // await test.step("should navigate to the me page after successful username submission", async () => {
      //   await mockTransactionSubmitRPCResponses(page);

      //   await continueButton.click();

      //   const mePageTitle = page.getByText("basic-ticket-testing-unknown");
      //   await expect(mePageTitle).toBeVisible();
      // });

      await page.unrouteAll({ behavior: "ignoreErrors" });
    });
  });
});
