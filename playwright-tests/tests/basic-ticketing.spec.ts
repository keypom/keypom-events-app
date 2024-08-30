import { expect, test } from "@playwright/test";
import { mockRpcRequest } from "../utils/rpc-mock";

const UNSCANNED_TICKET_PRIVATE_KEY =
  "2pcZwjQnvmpUXg29D7V86oPaop5KxR2RyWiPJPXub7XiBaMNGBCTuruPwoX71nGSCSQjSGopSmENtfDNkcmao2XL";
const DROP_ID = "ga_pass";
const FUNDER_ID = "benjiman.testnet";
const EVENT_ID = "aa4a7964-c917-4010-92c3-9e4b3f7dfc5e";
const FACTORY_ACCOUNT = "1724680439172-factory.testnet";

test.describe("Basic ticketing (User shows ticket)", () => {
  test.describe("Ticket has not been scanned, ticket exists", () => {
    test.beforeEach(async ({ page }) => {
      await mockRpcRequest({
        page,
        filterParams: {
          method_name: "get_key_information",
        },
        modifyOriginalResultFunction: (result) => {
          result.uses_remaining = 3;
          result.drop_id = DROP_ID;
          return result;
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
        modifyOriginalResultFunction: (result) => {
          result.uses_remaining = 2;
          result.drop_id = DROP_ID;
          return result;
        },
      });

      const WelcomePageTitle = await page.getByText("Welcome");
      await expect(WelcomePageTitle).toBeVisible();
    });
  });
});
