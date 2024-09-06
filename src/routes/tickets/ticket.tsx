import { NotFound404 } from "@/components/dashboard/NotFound404";
import { useTicketClaimParams } from "@/hooks/useTicketClaimParams";

import TicketQRPage from "@/components/tickets/ticket-qr-code";
import { useConferenceData } from "@/hooks/useConferenceData";
import { useEventCredentials } from "@/stores/event-credentials";
import { Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Ticket() {
  const navigate = useNavigate();
  const { secretKey } = useTicketClaimParams();
  const { setEventCredentials } = useEventCredentials();
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

  const { ticketInfo, dropInfo, keyInfo, ticketExtra, eventInfo } = data!;

  const maxUses = dropInfo.max_key_uses;
  const usesRemaining = keyInfo.uses_remaining;
  const curStep = maxUses - usesRemaining + 1;
  const { funder_id } = dropInfo;
  const { eventId } = ticketExtra;
  const { account_type } = ticketInfo;

  // Redirect if ticket has been used
  if (maxUses === 2) {
    setEventCredentials(eventId, secretKey);
    navigate("/welcome");
  }

  if (curStep !== 1) {
    setEventCredentials(eventId, secretKey);
    navigate("/welcome");
  }

  switch (account_type) {
    case "Basic":
      console.log("Rendering basic ticket");
      return (
        <TicketQRPage
          eventId={eventId}
          eventInfo={eventInfo}
          funderId={funder_id}
          isLoading={isLoading}
          secretKey={secretKey}
          ticketInfo={ticketInfo}
        />
      );
    case "Sponsor":
      console.log("Rendering Sponsor ticket");
      return <div>Sponsor</div>;
    case "Admin":
      console.log("Rendering Admin ticket");
      return <div>Admin</div>;
    default:
      return <div>Unknown ticket type</div>;
  }
}
