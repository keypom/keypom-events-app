import { Page } from "@playwright/test";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const MOCK_RPC_URL = "https://rpc.testnet.near.org/";

export async function mockRpcRequest({
  page,
  filterParams = {},
  mockedResult = {},
  modifyOriginalResultFunction,
}: {
  page: Page;
  filterParams?: any;
  mockedResult?: any;
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
      console.log(
        `It's a HIT for ${filterParams.method_name}, with args: `,
        JSON.stringify(filterParams.args_base64),
      );
      const json = await route.fetch().then((r) => r.json());

      if (modifyOriginalResultFunction) {
        const originalResult = JSON.parse(
          new TextDecoder().decode(new Uint8Array(json.result.result)),
        );
        mockedResult = await modifyOriginalResultFunction(originalResult);
      }

      const mockedResponse = {
        jsonrpc: "2.0",
        id: "dontcare",
        result: {
          result: Array.from(
            new TextEncoder().encode(JSON.stringify(mockedResult)),
          ),
        },
      };

      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockedResponse),
      });
    } else {
      console.log(
        `It's a MISS for ${filterParams.method_name}, with args: `,
        JSON.stringify(filterParams.args_base64),
      );
      route.fallback();
    }
  });
}
