import { getPubFromSecret } from "@keypom/core";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { TOKEN_FACTORY_CONTRACT } from "@/constants/common";
import { useConferenceClaimParams } from "@/hooks/useConferenceClaimParams";
import keypomInstance from "@/lib/keypom";

interface ConferenceContextProps {
  dropId: string;
  // eventId: string;
  secretKey: string;
  accountId: string;
  tokensAvailable: string;
}

const ConferenceContext = createContext<ConferenceContextProps | undefined>(
  undefined,
);

export const ConferenceProvider = ({ children }: { children: ReactNode }) => {
  const [accountId, setAccountId] = useState<string>("");
  const [tokensAvailable, setTokensAvailable] = useState<string>("0");
  const { dropId, secretKey } = useConferenceClaimParams();

  useEffect(() => {
    const recoverAccount = async () => {
      const recoveredAccountId = await keypomInstance.viewCall({
        contractId: TOKEN_FACTORY_CONTRACT,
        methodName: "recover_account",
        args: { key: getPubFromSecret(secretKey) },
      });

      const balance = await keypomInstance.viewCall({
        contractId: TOKEN_FACTORY_CONTRACT,
        methodName: "ft_balance_of",
        args: { account_id: recoveredAccountId },
      });

      setTokensAvailable(keypomInstance.yoctoToNearWith4Decimals(balance));
      setAccountId(recoveredAccountId);
    };
    recoverAccount();
  }, [dropId, secretKey]);

  return (
    <ConferenceContext.Provider
      value={{
        dropId,
        secretKey,
        accountId,
        tokensAvailable,
      }}
    >
      {children}
    </ConferenceContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useConferenceContext = () => {
  const context = useContext(ConferenceContext);
  if (!context) {
    throw new Error(
      "useConferenceContext must be used within a ConferenceProvider",
    );
  }
  return context;
};
