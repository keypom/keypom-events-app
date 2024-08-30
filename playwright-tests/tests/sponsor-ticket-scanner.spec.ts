/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, test } from "@playwright/test";
import { mockTicketScan } from "../utils/qr-mock";

const FUNDER_ID = "benjiman.testnet";
const EVENT_ID = "aa4a7964-c917-4010-92c3-9e4b3f7dfc5e";
const DROP_ID = "ga_pass";

const NOT_SCANNED_KEY = "2pcZwjQnvmpUXg29D7V86oPaop5KxR2RyWiPJPXub7XiBaMNGBCTuruPwoX71nGSCSQjSGopSmENtfDNkcmao2XL";
const ANOTHER_UNSCANNED_KEY = "5EQLAqW9xtjWgqux7fV16ik4mknsXi1UXdu74KzXXnZu1Pcv9HpCPDTLErBtpAuP6N27veSLkUwsHnokwryn2AhE";
const ALREADY_SCANNED_KEY = "5ZbsXbmbHPrb55r391LuS3JANtNSw2peoYwWo1SzKhLqVPsWTpZDSmVpPyhABm6Sf7y7C3G4ceGw7q86ERunDEgj";

test.describe("Basic ticketing (Sponsor scans ticket)", () => {

  // Mock the QR code scanner
  test.beforeEach(async ({ page }) => {
    page.goto(`/scan/event/${FUNDER_ID}:${EVENT_ID}`);

    await page.waitForSelector("text=Scanning Tickets For");
  });


  test.describe("Ticket has not been scanned, single ticket exists", () => {

    test("should successfuly scan a valid ticket", async ({ page }) => {
      await mockTicketScan(page, NOT_SCANNED_KEY, 3, DROP_ID, 3);
      await expect(page.getByText("Success")).toBeVisible();
    });
  });

  test.describe("Ticket has not been scanned, multiple ticket exists", () => {
    test("should successfuly scan a batch of valid tickets", async ({ page }) => {
      await mockTicketScan(page, NOT_SCANNED_KEY, 3, DROP_ID, 3);
      await expect(page.getByText("Success")).toBeVisible();
      await mockTicketScan(page, ANOTHER_UNSCANNED_KEY, 3, DROP_ID, 3);
      await page.unrouteAll({ behavior: 'ignoreErrors' })
    });

    test("should display an error when ticket just scanned", async ({ page }) => {
      await mockTicketScan(page, NOT_SCANNED_KEY, 3, DROP_ID, 3);
      await expect(page.getByText("Success")).toBeVisible();
      await mockTicketScan(page, NOT_SCANNED_KEY, 3, DROP_ID, 3);
      await expect(page.getByText("Ticket already scanned.")).toBeVisible();
    });
  });

  test.describe("Ticket has already been used", () => {
    test("should display an error for an already used ticket", async ({ page }) => {
      await mockTicketScan(page, ALREADY_SCANNED_KEY, 2, DROP_ID, 3);
      await expect(page.getByText("Ticket has already been used.")).toBeVisible();
    });
  });

  test.describe("Ticket information is not found", () => {
    test("should display an error for a ticket not found", async ({ page }) => {
      await mockTicketScan(page, "invalid_key", 3, DROP_ID, 3);
      await expect(page.getByText("No ticket information found.")).toBeVisible();
    });
  });
});