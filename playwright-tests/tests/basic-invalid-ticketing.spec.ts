import { expect, test } from "@playwright/test";
import {
  DROP_ID,
  EVENT_ID,
  FACTORY_ACCOUNT,
  FUNDER_ID,
  UNSCANNED_TICKET_HASH,
} from "../utils/constants";
import { mockRpcRequest } from "../utils/rpc-mock";

test.describe("Basic invalid ticketing (User shows ticket)", () => {
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
        `/tickets/ticket/ga_pass#${UNSCANNED_TICKET_HASH}`,
      );

      page.waitForTimeout(3000);

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
        `/tickets/ticket/ga_pass#${UNSCANNED_TICKET_HASH}`,
      );

      page.waitForTimeout(3000);

      const errorMessage = await page.getByText("Event not found");
      await expect(errorMessage).toBeVisible();
    });
  });
});
