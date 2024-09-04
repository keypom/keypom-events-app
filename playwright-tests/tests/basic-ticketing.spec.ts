import { expect, test } from "@playwright/test";
import {
  DROP_ID,
  EVENT_ID,
  FACTORY_ACCOUNT,
  FUNDER_ID,
  UNSCANNED_TICKET_PRIVATE_KEY,
} from "../utils/constants";
import { mockRpcRequest } from "../utils/rpc-mock";

test.describe("Basic ticketing (User shows ticket)", () => {
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

      await page.goto(
        `/tickets/ticket/ga_pass#${UNSCANNED_TICKET_PRIVATE_KEY}`,
      );
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
        },
      });

      const WelcomePageTitle = await page.getByText("Welcome");
      await expect(WelcomePageTitle).toBeVisible();

      await test.step("should show appropriate token balance", async () => {
        const tokenBalance = await page.getByText("50 $SOV3");
        await expect(tokenBalance).toBeVisible();
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

        const continueButton = page.getByRole("button", {
          name: "Begin Journey",
        });
        expect(continueButton).not.toBeEnabled();
      });

      await test.step("should enable begin journey if valid username submitted", async () => {
        await mockRpcRequest({
          page,
          filterParams: {
            request_type: "view_account",
          },
          mockedResult: {}, // account does not exist
        });
        await page.getByPlaceholder("Username").fill("basic-ticket-testing");

        // NEED TO BLUR TO TRIGGER VALIDATION
        await page.getByPlaceholder("Username").blur();

        const errorMessage = page.getByText(
          "Username is invalid or already taken.",
        );
        await expect(errorMessage).not.toBeVisible();

        const continueButton = page.getByRole("button", {
          name: "Begin Journey",
        });
        expect(continueButton).toBeEnabled();
      });
    });
  });

  test.describe("Ticket is invalid", () => {
    test("should show error, ticket invalid", async ({ page }) => {
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
          result.max_key_uses = 1;
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

      await page.goto(
        `/tickets/ticket/ga_pass#${UNSCANNED_TICKET_PRIVATE_KEY}`,
      );

      const errorMessage = await page.getByText("Invalid ticket");
      await expect(errorMessage).toBeVisible();
    });
  });

  test.describe("Event is not found", () => {
    test("should show error, event not found", async ({ page }) => {
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
            nope: {
              name: "Some other event",
              dateCreated: "1724680461141",
              id: "nope",
              description: "Join us at some other event",
              location: "somewhere else",
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

      await page.goto(
        `/tickets/ticket/ga_pass#${UNSCANNED_TICKET_PRIVATE_KEY}`,
      );

      const errorMessage = await page.getByText("Event not found");
      await expect(errorMessage).toBeVisible();
    });
  });
});
