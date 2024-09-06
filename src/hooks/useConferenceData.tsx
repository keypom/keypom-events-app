import { KEYPOM_TOKEN_FACTORY_CONTRACT } from "@/constants/common";
import eventHelperInstance from "@/lib/event";
import {
  EventDrop,
  FunderEventMetadata,
  TicketInfoMetadata,
  TicketMetadataExtra,
} from "@/lib/helpers/events";
import { AttendeeKeyItem } from "@/lib/keypom";
import { useEventCredentials } from "@/stores/event-credentials";
import { TokenAsset } from "@/types/common";
import { getPubFromSecret } from "@keypom/core";
import { useQuery } from "@tanstack/react-query";

export interface ConferenceData {
  ticketInfo: TicketInfoMetadata;
  dropInfo: EventDrop;
  keyInfo: AttendeeKeyItem;
  ticketMetadata: TicketInfoMetadata;
  ticketExtra: TicketMetadataExtra;
  eventInfo: FunderEventMetadata;
  tokenInfo: TokenAsset;
}

const fetchConferenceData = async (secretKey: string) => {
  try {
    const pubKey = getPubFromSecret(secretKey);
    const keyInfo = await eventHelperInstance.viewCall({
      methodName: "get_key_information",
      args: { key: pubKey },
    });

    const dropInfo = await eventHelperInstance.viewCall({
      methodName: "get_drop_information",
      args: { drop_id: keyInfo.drop_id },
    });

    const tokenInfo = await eventHelperInstance.viewCall({
      contractId: KEYPOM_TOKEN_FACTORY_CONTRACT,
      methodName: "ft_metadata",
      args: { drop_id: dropInfo.drop_id },
    });

    const factoryAccount = dropInfo.asset_data[1].config.root_account_id;
    const ticketInfo = await eventHelperInstance.viewCall({
      contractId: factoryAccount,
      methodName: "get_ticket_data",
      args: { drop_id: keyInfo.drop_id },
    });

    const maxUses = dropInfo.max_key_uses;

    const ticketMetadata = dropInfo.drop_config.nft_keys_config.token_metadata;
    const ticketExtra = JSON.parse(ticketMetadata.extra);
    const eventId: string = ticketExtra.eventId;

    const eventInfo = await eventHelperInstance.getEventInfo({
      accountId: dropInfo.funder_id,
      eventId,
    });

    if (!eventInfo) {
      throw new Error("Event not found");
    }

    if (maxUses !== 3 && maxUses !== 2) {
      throw new Error("Invalid ticket");
    }

    return {
      keyInfo,
      dropInfo,
      ticketInfo,
      tokenInfo,
      ticketMetadata,
      ticketExtra,
      eventInfo,
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
