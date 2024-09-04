import test, { expect } from "@playwright/test";

test.describe("Alerts", () => {
  test.describe("User is authenticated", () => {

    test.use({ storageState: "playwright-tests/storage-states/wallet-connected.json" })

    test.beforeEach(async ({ page }) => {
      await page.goto("/me");
    });

    test("should handle error when fetching alerts", async ({ page }) => {
      await page.route("https://example.com/alerts", (route) => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ message: "Internal Server Error" }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      });

      const alertTitle = page.getByText("[ALERTS]");
      await expect(alertTitle).toBeVisible();

      const viewAllButton = page.getByRole('link', { name: 'VIEW ALL' })
      await expect(viewAllButton).not.toBeVisible();

      // const errorMessage = page.getByText("Error: Failed to fetch.");
      // await expect(errorMessage).toBeVisible();
    });

    test("should handle no alerts found", async ({ page }) => {
      await page.route("https://example.com/alerts", (route) => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([]),
        });
      });

      const alertTitle = page.getByText("[ALERTS]");
      await expect(alertTitle).toBeVisible();

      const viewAllButton = page.getByRole('link', { name: 'VIEW ALL' })
      await expect(viewAllButton).not.toBeVisible();

      const noAlertsMessage = page.getByText("No alerts found.");
      await expect(noAlertsMessage).toBeVisible();
    });

    test("should show latest alert, navigate to alerts page and back", async ({ page }) => {
      await page.route("https://example.com/alerts", (route) => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([{
            id: "1",
            title: "System Maintenance Scheduled",
            description:
              "Our system will undergo scheduled maintenance from 12:00 AM to 4:00 AM. Please save your work and log out before the maintenance window.",
            href: "/maintenance",
            linkTitle: "CUSTOM LINK TITLE",
            creationDate: "2024-09-03T22:02:36.288Z"
          },
          {
            "id": "2",
            "title": "New Feature Released",
            "description": "We are excited to announce the release of our new feature that allows you to track your activities more effectively. Check it out now!",
            "href": "/features",
            "linkTitle": "CUSTOM LINK TITLE",
            "creationDate": "2024-09-03T05:43:13.905Z"
          },
          {
            "id": "3",
            "title": "Security Update Available",
            "description": "A critical security update has been released. Please update your software to the latest version to ensure your data remains secure.",
            "href": "/updates",
            "linkTitle": "CUSTOM LINK TITLE",
            "creationDate": "2024-09-03T22:02:00.288Z"
          },]),
        });
      });

      const alertTitle = page.getByText("[ALERTS]");
      await expect(alertTitle).toBeVisible();

      const viewAllButton = page.getByRole('link', { name: 'VIEW ALL' })
      await expect(viewAllButton).toBeVisible();

      const alertItemTitle = page.getByText("System Maintenance Scheduled");
      await expect(alertItemTitle).toBeVisible();

      await test.step("should navigate to alerts page when clicking on view all", async () => {
        await viewAllButton.click();

        // get all alerts 
        const alertItems = await page.getByTestId("alert-item").all();
        expect(alertItems).toHaveLength(3);
      });

      await test.step("should click to navigate back to profile page", async () => {
        const backButton = page.getByTestId("back-button");

        await backButton.click();
        await page.waitForURL('**/me');
      });
    });
  });
});