import { TOKEN_FACTORY_CONTRACT } from "@/constants/common";
import keypomInstance from "@/lib/keypom";
import { useEventCredentials } from "@/stores/event-credentials";
import { getPubFromSecret } from "@keypom/core";
import { useQuery } from "@tanstack/react-query";

export interface AccountData {
  accountId: string;
  balance: string;
}

export const fetchAccountData = async (secretKey: string) => {
  const pubKey = getPubFromSecret(secretKey);

  const recoveredAccount = await keypomInstance.viewCall({
    contractId: TOKEN_FACTORY_CONTRACT,
    methodName: "recover_account",
    args: { key_or_account_id: pubKey },
  });

  if (!recoveredAccount) {
    throw new Error("Account not found");
  }

  const balance = await keypomInstance.viewCall({
    contractId: TOKEN_FACTORY_CONTRACT,
    methodName: "ft_balance_of",
    args: { account_id: recoveredAccount.account_id },
  });

  const tokensAvailable = keypomInstance.yoctoToNearWith4Decimals(balance);

  return {
    accountId: recoveredAccount.account_id,
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
