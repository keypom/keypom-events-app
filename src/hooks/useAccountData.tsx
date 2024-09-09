import { KEYPOM_TOKEN_FACTORY_CONTRACT } from "@/constants/common";
import eventHelperInstance from "@/lib/event";
import { decryptOnChainData, decryptStoredData } from "@/lib/helpers/crypto";
import { RecoveredAccountInfo } from "@/lib/helpers/events";
import { useEventCredentials } from "@/stores/event-credentials";
import { getPubFromSecret } from "@keypom/core";
import { useQuery } from "@tanstack/react-query";

export interface UserData {
  name: string;
  email: string;
}

export interface AccountData {
  accountId: string;
  displayAccountId: string;
  userData: UserData;
  balance: string;
}

const fetchAccountData = async (secretKey: string) => {
  try {
    const pubKey = getPubFromSecret(`ed25519:${secretKey}`);

    const recoveredAccount: RecoveredAccountInfo =
      await eventHelperInstance.viewCall({
        methodName: "recover_account",
        args: { key_or_account_id: pubKey },
      });

    if (!recoveredAccount) {
      throw new Error("Account not found");
    }

    const attendeeKeyInfo = await eventHelperInstance.viewCall({
      methodName: "get_key_information",
      args: { key: pubKey },
    });
    const decryptedMetadata = decryptStoredData(
      secretKey,
      attendeeKeyInfo.metadata,
    );
    const userData = JSON.parse(decryptedMetadata);

    const tokensAvailable = eventHelperInstance.yoctoToNearWith4Decimals(
      recoveredAccount.ft_balance,
    );

    const accountId = recoveredAccount.account_id;
    return {
      accountId,
      userData,
      displayAccountId: accountId
        .split(".")[0]
        .substring(KEYPOM_TOKEN_FACTORY_CONTRACT),
      balance: tokensAvailable,
    };
  } catch (error) {
    // Re-throw the error to ensure React Query handles it
    return Promise.reject(error);
  }
};

export const useAccountData = () => {
  const { secretKey } = useEventCredentials();

  return useQuery<AccountData, Error>({
    queryKey: ["accountData", secretKey],
    queryFn: async () => await fetchAccountData(secretKey),
    enabled: !!secretKey,
    retry: 3,
  });
};
