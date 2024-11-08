import eventHelperInstance, { AttendeeTicketData } from "@/lib/event";
import { decodeAndParseBase64 } from "@/lib/helpers/crypto";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export const useTicketClaimParams = () => {
  const navigate = useNavigate();
  const { id: dropIdParam } = useParams();
  const { hash } = useLocation();

  const dropId = dropIdParam;
  const encodedTicketData = hash ? hash.replace("#", "") : "";

  if (!dropId || !encodedTicketData) {
    eventHelperInstance.debugLog(
      "Navigating to home page. dropId or SecretKey are not found in the URL or local storage",
      "error",
    );
    navigate("/");
  }

  const ticketData: AttendeeTicketData =
    decodeAndParseBase64(encodedTicketData);

  return {
    dropId,
    secretKey: ticketData.ticket,
    userData: ticketData.userData,
  };
};
