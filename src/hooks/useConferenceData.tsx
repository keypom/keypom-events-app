import eventHelperInstance from "@/lib/event";
import { AttendeeKeyInfo, TicketTypeInfo } from "@/lib/helpers/events";
import { useEventCredentials } from "@/stores/event-credentials";
import { TokenAsset } from "@/types/common";
import { getPubFromSecret } from "@keypom/core";
import { useQuery } from "@tanstack/react-query";

export interface ConferenceData {
  ticketInfo: TicketTypeInfo;
  keyInfo: AttendeeKeyInfo;
  tokenInfo: TokenAsset;
}

const fetchConferenceData = async (secretKey: string) => {
  try {
    const pubKey = getPubFromSecret(`ed25519:${secretKey}`);
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

    const ticketInfo: TicketTypeInfo = await eventHelperInstance.viewCall({
      methodName: "get_ticket_data",
      args: { drop_id: keyInfo.drop_id },
    });
    console.log(ticketInfo);

    return {
      keyInfo,
      ticketInfo,
      tokenInfo,
    };
  } catch (error) {
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
