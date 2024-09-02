import { Page } from "@playwright/test";
import { mockRpcRequest } from "./rpc-mock";

// Helper function to simulate a QR code scan
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const simulateQrScan = async (page: Page, rawValue: any) => {
  await page.evaluate((value) => {
    const validDetectedBarcode = [
      {
        rawValue: value,
        // DO NOT CHANGE THE BELOW
        format: "qr_code",
        cornerPoints: [
          { x: 32, y: 32 },
          { x: 232, y: 32 },
          { x: 232, y: 232 },
          { x: 32, y: 232 },
        ],
        boundingBox: {
          x: 32,
          y: 32,
          width: 200,
          height: 200,
          top: 32,
          right: 232,
          bottom: 232,
          left: 32,
        },
      },
    ];
    // @ts-expect-error - Expose the triggerTestScan function to the window
    window.triggerTestScan(validDetectedBarcode);
  }, rawValue);
};

export const mockTicketScan = async (
  page: Page,
  secretKey: string,
  remainingUses: number,
  drop_id: string,
  maxUses: number,
) => {
  await mockRpcRequest({
    page,
    filterParams: { method_name: "get_key_information" },
    modifyOriginalResultFunction: (result) => {
      result.uses_remaining = remainingUses;
      result.drop_id = drop_id;
      return result;
    },
  });

  await mockRpcRequest({
    page,
    filterParams: { method_name: "get_drop_information" },
    modifyOriginalResultFunction: (result) => {
      result.max_key_uses = maxUses;
      return result;
    },
  });

  await simulateQrScan(page, secretKey);
};
