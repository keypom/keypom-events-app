import { TOKEN_FACTORY_CONTRACT } from "@/constants/common";
import keypomInstance from "@/lib/keypom";
import { useEventCredentials } from "@/stores/event-credentials";
import { getPubFromSecret } from "@keypom/core";
import { useQuery } from "@tanstack/react-query";

export interface AccountData {
  accountId: string;
  balance: string;
}

const fetchAccountData = async (secretKey: string) => {
  const pubKey = getPubFromSecret(secretKey);

  const accountId = await keypomInstance.viewCall({
    contractId: TOKEN_FACTORY_CONTRACT,
    methodName: "recover_account",
    args: { key: pubKey },
  });

  if (!accountId) {
    throw new Error("Account not found");
  }

  const balance = await keypomInstance.viewCall({
    contractId: TOKEN_FACTORY_CONTRACT,
    methodName: "ft_balance_of",
    args: { account_id: accountId },
  });

  const tokensAvailable = keypomInstance.yoctoToNearWith4Decimals(balance);

  return {
    accountId,
    balance: tokensAvailable,
  };
};

export const useAccountData = () => {
  const { secretKey } = useEventCredentials();

  return useQuery<AccountData, Error>({
    queryKey: ["accountData", secretKey],
    queryFn: () => fetchAccountData(secretKey),
    enabled: !!secretKey,
  });
};
