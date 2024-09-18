import test, { expect } from "@playwright/test";
import { mockRpcRequest } from "../utils/rpc-mock";

test.describe("Alerts", () => {
  test.describe("User is authenticated", () => {
    test.use({
      storageState: "playwright-tests/storage-states/wallet-connected.json",
    });

    test("should handle error when fetching alerts", async ({ page }) => {
      await mockRpcRequest({
        page,
        filterParams: { method_name: "get_alerts" },
        mockedError: "Internal Server Error",
      });

      await page.goto("/me");

      const alertTitle = page.getByText("[ALERTS]");
      await expect(alertTitle).toBeVisible();

      const viewAllButton = page.getByRole("link", { name: "VIEW ALL" });
      await expect(viewAllButton).not.toBeVisible();

      // const errorMessage = page.getByText("Error: Failed to fetch.");
      // await expect(errorMessage).toBeVisible();
      await page.unrouteAll({ behavior: "ignoreErrors" });
    });

    test("should handle no alerts found", async ({ page }) => {
      await mockRpcRequest({
        page,
        filterParams: { method_name: "get_alerts" },
        mockedResult: [JSON.stringify([]), 1726259361706],
      });
      await page.goto("/me");

      const alertTitle = page.getByText("[ALERTS]");
      await expect(alertTitle).toBeVisible();

      const viewAllButton = page.getByRole("link", { name: "VIEW ALL" });
      await expect(viewAllButton).not.toBeVisible();

      const noAlertsMessage = page.getByText("No alerts found.");
      await expect(noAlertsMessage).toBeVisible();

      await page.unrouteAll({ behavior: "ignoreErrors" });
    });

    test("should show latest alert, navigate to alerts page and back", async ({
      page,
    }) => {
      await mockRpcRequest({
        page,
        filterParams: { method_name: "get_alerts" },
        mockedResult: [
          JSON.stringify([
            {
              Title: "System Maintenance Scheduled",
              Description:
                "Our system will undergo scheduled maintenance from 12:00 AM to 4:00 AM. Please save your work and log out before the maintenance window.",
              "Custom Link Title": "Check it Out",
              "Redirects To": "https://www.google.com/",
              Time: "2024-09-13T20:29:21.992Z",
            },
            {
              Title: "New Feature Released",
              Description:
                "We are excited to announce the release of our new feature that allows you to track your activities more effectively. Check it out now!",
              "Custom Link Title": "CUSTOM LINK TITLE",
              "Redirects To": "https://www.google.com/",
              Time: "2024-09-13T20:29:21.992Z",
            },
            {
              Title: "Security Update Available",
              Description:
                "We are excited to announce the release of our new feature that allows you to track your activities more effectively. Check it out now!",
              "Custom Link Title": "CUSTOM LINK TITLE!",
              "Redirects To": "https://www.google.com/",
              Time: "2024-09-13T20:29:21.992Z",
            },
            {
              Title: "Maria is cool",
              Description:
                "We are excited to announce the release of our new feature that allows you to track your activities more effectively. Check it out now!",
              "Custom Link Title": "CUSTOM LINK TITLE!",
              "Redirects To": "https://www.google.com/",
              Time: "2024-09-13T20:29:21.992Z",
            },
            {
              Title: "Jake is cool",
              Description:
                "We are excited to announce the release of our new feature that allows you to track your activities more effectively. Check it out now!",
              "Custom Link Title": "CUSTOM LINK TITLE!",
              "Redirects To": "https://www.google.com/",
              Time: "2024-09-13T20:29:21.992Z",
            },
            {
              Title: "This is my new alert",
              Description:
                "We are excited to announce the release of our new feature that allows you to track your activities more effectively. Check it out now!",
              "Custom Link Title": "CUSTOM LINK TITLE!",
              "Redirects To": "https://www.google.com/",
              Time: "2024-09-13T20:29:21.992Z",
            },
          ]),
          1726259361706,
        ],
      });

      await page.goto("/me");

      const alertTitle = page.getByText("[ALERTS]");
      await expect(alertTitle).toBeVisible();

      const viewAllButton = page.getByRole("link", { name: "VIEW ALL" });
      await expect(viewAllButton).toBeVisible();

      const alertItemTitle = page.getByText("System Maintenance Scheduled");
      await expect(alertItemTitle).toBeVisible();

      await test.step("should navigate to alerts page when clicking on view all", async () => {
        await viewAllButton.click();

        await page.waitForURL("**/alerts");

        // get all alerts
        const alertItems = await page.getByTestId("alert-item").all();
        expect(alertItems).toHaveLength(6);
      });

      await test.step("should click to navigate back to profile page", async () => {
        const backButton = page.getByTestId("back-button");

        await backButton.click();
        await page.waitForURL("**/me");
      });

      await page.unrouteAll({ behavior: "ignoreErrors" });
    });
  });
});
