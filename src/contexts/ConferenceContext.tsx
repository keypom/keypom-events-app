import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { getPubFromSecret } from "@keypom/core";

import keypomInstance from "@/lib/keypom";
import {
  type TicketInfoMetadata,
  type TicketMetadataExtra,
  type FunderEventMetadata,
  type EventDrop,
} from "@/lib/eventsHelper";
import { TOKEN_FACTORY_CONTRACT } from "@/constants/common";

interface ConferenceContextProps {
  eventInfo: FunderEventMetadata;
  ticketInfo: TicketInfoMetadata;
  ticketInfoExtra: TicketMetadataExtra;
  dropInfo: EventDrop;
  isLoading: boolean;
  eventId: string;
  funderId: string;
  ticker: string;
  secretKey: string;
  accountId: string;
  tokensAvailable: string;
  setTriggerRefetch: Dispatch<SetStateAction<number>>;
  triggerRefetch: number;
  //queryString: URLSearchParams;
}

const ConferenceContext = createContext<ConferenceContextProps | undefined>(
  undefined,
);

export const ConferenceProvider = ({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: Omit<
    ConferenceContextProps,
    "accountId" | "tokensAvailable" | "setTriggerRefetch" | "triggerRefetch"
  >;
}) => {
  const [accountId, setAccountId] = useState<string>("");
  const [tokensAvailable, setTokensAvailable] = useState<string>("0");
  const [triggerRefetch, setTriggerRefetch] = useState<number>(0);
  const { dropInfo, isLoading, secretKey } = initialData;

  useEffect(() => {
    const recoverAccount = async () => {
      if (!isLoading && dropInfo.drop_id !== "loading") {
        console.log("Secret Key: ", secretKey);
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
        console.log("recovered account id: ", recoveredAccountId);
        console.log("balance: ", balance);
        setTokensAvailable(keypomInstance.yoctoToNearWith4Decimals(balance));
        setAccountId(recoveredAccountId);
      }
    };
    recoverAccount();
  }, [dropInfo, isLoading, secretKey, triggerRefetch]);

  return (
    <ConferenceContext.Provider
      value={{
        ...initialData,
        accountId,
        tokensAvailable,
        setTriggerRefetch,
        triggerRefetch,
      }}
    >
      {children}
    </ConferenceContext.Provider>
  );
};

export const useConferenceContext = () => {
  const context = useContext(ConferenceContext);
  if (!context) {
    throw new Error(
      "useConferenceContext must be used within a ConferenceProvider",
    );
  }
  return context;
};