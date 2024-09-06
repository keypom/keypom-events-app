import { FACTORY_ACCOUNT, MOCK_RPC_URL } from "./constants";

const access_keys = [
  {
    access_key: {
      nonce: 172893486000004,
      permission: {
        FunctionCall: {
          allowance: null,
          method_names: ["claim_drop", "ft_transfer"],
          receiver_id: FACTORY_ACCOUNT,
        },
      },
    },
    public_key: "ed25519:8Cai5LU7KTmFmbSfv69aV2gtCPN9Qkd6cebp2rk2sLKT",
  },
  {
    access_key: {
      "nonce": 172579845000120,
      "permission": {
        "FunctionCall": {
          "allowance": null,
          "method_names": [
            "create_token_drop",
            "create_nft_drop",
            "delete_drop"
          ],
          "receiver_id": "1724680439172-factory.testnet"
        }
      }
    },
    public_key: "ed25519:79wz2P2qtw72bmTRQqsJCAvmGCUXc3GZP7TnU3FsqQHZ"
  }
];

export function decodeResultJSON(resultArray) {
  return JSON.parse(new TextDecoder().decode(new Uint8Array(resultArray)));
}

export function encodeResultJSON(resultObj) {
  return Array.from(new TextEncoder().encode(JSON.stringify(resultObj)));
}

export async function mockTransactionSubmitRPCResponses(page, customhandler?) {
  const status = {
    transaction_completed: false,
    last_receiver_id: undefined,
    lastViewedAccessKey: undefined,
    last_transaction: undefined,
  };

  await page.route(
    (url) =>
      url.origin === "https://rpc.mainnet.near.org" ||
      url.toString().startsWith(MOCK_RPC_URL),
    async (route) => {
      const request = await route.request();
      const requestPostData = request.postDataJSON();

      if (
        requestPostData.params &&
        requestPostData.params.request_type === "view_access_key_list"
      ) {
        const response = await route.fetch();
        const json = await response.json();
        json.result.keys = access_keys;

        await route.fulfill({ response, json });
      } else if (
        requestPostData.params &&
        requestPostData.params.request_type === "view_access_key"
      ) {
        const response = await route.fetch();
        const json = await response.json();

        // @ts-expect-error lastViewedAccessKey may be undefined
        status.lastViewedAccessKey = access_keys.find(
          (k) => k.public_key === requestPostData.params.public_key,
        );
        // @ts-expect-error lastViewedAccessKey may be undefined
        json.result = status.lastViewedAccessKey.access_key;
        delete json.error;

        await route.fulfill({ response, json });
      } else if (
        requestPostData.params &&
        requestPostData.params.request_type === "call_function" &&
        requestPostData.params.method_name === "get_account_storage"
      ) {
        const response = await route.fetch();
        const json = await response.json();

        const storage = { used_bytes: 221234, available_bytes: 1337643 };
        json.result.result = Array.from(
          new TextEncoder().encode(JSON.stringify(storage)),
        );

        await route.fulfill({ response, json });
      } else if (requestPostData.method == "broadcast_tx_commit") {
        status.transaction_completed = false;
        status.last_receiver_id =
          // @ts-expect-error lastViewedAccessKey may be undefined
          status.lastViewedAccessKey.access_key.permission.FunctionCall.receiver_id;
        status.last_transaction = requestPostData;

        await page.waitForTimeout(1000);
        await route.fulfill({
          json: {
            jsonrpc: "2.0",
            result: {
              status: {
                SuccessValue: "whatever",
              },
              transaction: {
                receiver_id: status.last_receiver_id,
              },
              transaction_outcome: {
                proof: [],
                block_hash: "9MzuZrRPW1BGpFnZJUJg6SzCrixPpJDfjsNeUobRXsLe",
                id: "ASS7oYwGiem9HaNwJe6vS2kznx2CxueKDvU9BAYJRjNR",
                outcome: {
                  logs: [],
                  receipt_ids: ["BLV2q6p8DX7pVgXRtGtBkyUNrnqkNyU7iSksXG7BjVZh"],
                  gas_burnt: 223182562500,
                  tokens_burnt: "22318256250000000000",
                  executor_id: "sender.testnet",
                  status: {
                    SuccessReceiptId:
                      "BLV2q6p8DX7pVgXRtGtBkyUNrnqkNyU7iSksXG7BjVZh",
                  },
                },
              },
              receipts_outcome: [],
            },
          },
        });
        status.transaction_completed = true;
      } else if (customhandler) {
        await customhandler({
          route,
          request,
          transaction_completed: status.transaction_completed,
          last_receiver_id: status.last_receiver_id,
          last_transaction: status.last_transaction,
          requestPostData,
        });
      } else {
        await route.continue();
      }
    },
  );
  return status;
}
