import { TOKEN_FACTORY_CONTRACT } from "@/constants/common";
import keypomInstance from "@/lib/keypom";
import { getPubFromSecret } from "@keypom/core";

export interface AccountData {
  accountId: string;
  balance: string;
}

export const fetchAccountData = async (secretKey: string) => {
  try {
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

    return {
      accountId,
      balance,
    };
  } catch (error) {
    // Re-throw the error to ensure React Query handles it
    return Promise.reject(error);
  }
};
