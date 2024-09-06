import { Page } from "@playwright/test";
import { MOCK_RPC_URL } from "./constants";

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function mockRpcRequest({
  page,
  filterParams = {},
  mockedResult = {},
  mockedError,
  modifyOriginalResultFunction,
}: {
  page: Page;
  filterParams?: any;
  mockedResult?: any;
  mockedError?: any;
  modifyOriginalResultFunction?: (result: any) => any | null;
}) {
  await page.route(MOCK_RPC_URL, async (route, request) => {
    const postData = request.postDataJSON();

    const filterParamsKeys = Object.keys(filterParams);
    if (
      filterParamsKeys.filter(
        (param) => postData.params[param] === filterParams[param],
      ).length === filterParamsKeys.length
    ) {
      // console.log(`It's a HIT for ${JSON.stringify(filterParams)}`);

      const json = await route.fetch().then((r) => r.json());

      if (modifyOriginalResultFunction) {
        const originalResult = JSON.parse(
          new TextDecoder().decode(new Uint8Array(json.result.result)),
        );
        mockedResult = await modifyOriginalResultFunction(originalResult);
      }

      const mockedResponse: {
        jsonrpc: string;
        id: string;
        error?: {
          code: number;
          message: string;
          data: any;
        };
        result?: {
          result: number[];
        };
      } = {
        jsonrpc: "2.0",
        id: "dontcare",
      };

      if (mockedError) {
        mockedResponse.error = {
          code: -32000,
          message: "Server error",
          data: mockedError,
        };
      } else {
        mockedResponse.result = {
          result: Array.from(
            new TextEncoder().encode(JSON.stringify(mockedResult)),
          ),
        };
      }

      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockedResponse),
      });
    } else {
      // console.log(`It's a MISS for ${filterParams.method_name}`);
      route.fallback();
    }
  });
}
