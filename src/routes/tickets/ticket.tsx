import { NotFound404 } from "@/components/dashboard/not-found-404";
import { useTicketClaimParams } from "@/hooks/useTicketClaimParams";

import TicketQRPage from "@/components/tickets/ticket-qr-code";
import { useConferenceData } from "@/hooks/useConferenceData";
import { useEventCredentials } from "@/stores/event-credentials";
import { Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function Ticket() {
  const navigate = useNavigate();
  const { secretKey, userData } = useTicketClaimParams();
  const { setEventCredentials } = useEventCredentials();
  const { data, isLoading, isError, error } = useConferenceData(secretKey);

  const hasHandledScanRef = useRef(false);

  useEffect(() => {
    if (!data) return; // Prevent running effect before data is available

    const { keyInfo } = data;

    if (keyInfo.has_scanned === true && !hasHandledScanRef.current) {
      hasHandledScanRef.current = true; // Set the flag to prevent re-running

      setEventCredentials(secretKey, userData, false);

      if (keyInfo.account_id === null) {
        navigate("/nameselect");
      } else {
        navigate("/me");
      }
    }
  }, [data, secretKey, userData, navigate, setEventCredentials]);

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

  const { ticketInfo, keyInfo } = data!;

  // Prevent rendering if ticket has been scanned and handled
  if (keyInfo.has_scanned === true && hasHandledScanRef.current) {
    return null; // Or render a placeholder
  }

  const { account_type } = ticketInfo;

  switch (account_type) {
    case "Basic":
      return (
        <TicketQRPage
          isLoading={isLoading}
          secretKey={secretKey}
          userData={userData}
        />
      );
    case "Sponsor":
      return <div>Sponsor</div>;
    case "Admin":
      return <div>Admin</div>;
    default:
      return <div>Unknown ticket type</div>;
  }
}
