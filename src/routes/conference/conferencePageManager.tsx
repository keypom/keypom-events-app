import { Center, Spinner, Text, VStack } from "@chakra-ui/react";

import { NotFound404 } from "@/components/dashboard/NotFound404";
import { useConferenceData } from "@/hooks/useConferenceData";
import eventHelperInstance from "@/lib/event";
import { Navigate } from "react-router-dom";
import WelcomePage from "./WelcomePage";
import { useEventCredentials } from "@/stores/event-credentials";

export default function ConferencePageManager() {
  const { secretKey } = useEventCredentials();
  const { data, isLoading, isError, error } = useConferenceData(secretKey);

  if (isError) {
    return <NotFound404 header="Error" subheader={error?.message} />;
  }

  if (isLoading) {
    return (
      <Center minH="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading ticket information...</Text>
        </VStack>
      </Center>
    );
  }

  const { ticketInfo, dropInfo, tokenInfo, keyInfo, eventInfo } = data!;
  const maxUses = dropInfo.max_key_uses;
  const usesRemaining = keyInfo.uses_remaining;
  const curStep = maxUses - usesRemaining + 1;
  const { starting_token_balance } = ticketInfo;

  const { symbol } = tokenInfo;

  const tokensToClaim = eventHelperInstance.yoctoToNear(
    starting_token_balance!,
  );

  switch (curStep) {
    case 2:
      return (
        <WelcomePage
          eventInfo={eventInfo}
          isLoading={isLoading}
          secretKey={secretKey}
          ticker={symbol}
          ticketInfo={ticketInfo}
          tokensToClaim={tokensToClaim}
        />
      );
    case 3:
      return <Navigate to="/me" replace={true} />;
    default:
      return (
        <NotFound404
          header="Invalid ticket"
          subheader="Please contact the event organizers"
        />
      );
  }
}
