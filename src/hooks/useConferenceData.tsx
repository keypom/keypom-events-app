import eventHelperInstance from "@/lib/event";
import { AttendeeKeyInfo, TicketTypeInfo } from "@/lib/helpers/events";
import { useEventCredentials } from "@/stores/event-credentials";
import { TokenAsset } from "@/types/common";
import { useQuery } from "@tanstack/react-query";

export interface ConferenceData {
  ticketInfo: TicketTypeInfo;
  keyInfo: AttendeeKeyInfo;
  tokenInfo: TokenAsset;
  conferenceOver: boolean;
}

const fetchConferenceData = async (secretKey: string) => {
  try {
    const pubKey = eventHelperInstance.getPubFromSecret(secretKey);
    const keyInfo: AttendeeKeyInfo | undefined =
      await eventHelperInstance.viewCall({
        methodName: "get_key_information",
        args: { key: pubKey },
      });

    if (keyInfo === undefined) {
      throw new Error("Invalid ticket");
    }

    const tokenInfo = await eventHelperInstance.viewCall({
      methodName: "ft_metadata",
      args: {},
    });

    let ticketInfo: TicketTypeInfo;
    if (keyInfo.drop_id) {
      ticketInfo = await eventHelperInstance.viewCall({
        methodName: "get_ticket_data",
        args: { drop_id: keyInfo.drop_id },
      });
    } else {
      ticketInfo = {
        account_type: "Admin",
        starting_near_balance: "0",
        starting_token_balance: "0",
      };
    }

    const isConferenceOver = await eventHelperInstance.viewCall({
      methodName: "is_contract_frozen",
      args: {},
    });

    return {
      keyInfo,
      conferenceOver: isConferenceOver,
      ticketInfo,
      tokenInfo,
    };
  } catch (error) {
    eventHelperInstance.debugLog(
      `Error fetching conference data: ${error}`,
      "error",
    );
    // Re-throw the error to ensure React Query handles it
    return Promise.reject(error);
  }
};

export const useConferenceData = (providedKey?: string) => {
  const { secretKey: savedKey } = useEventCredentials();

  const secretKey = providedKey ? providedKey : savedKey;

  return useQuery<ConferenceData, Error>({
    queryKey: ["conferenceData", secretKey],
    queryFn: async () => await fetchConferenceData(secretKey),
    retry: 1,
    enabled: !!secretKey,
  });
};
