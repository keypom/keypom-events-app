import eventHelperInstance from "@/lib/event";
import { useNavigate, useParams } from "react-router-dom";

export const useTicketScanningParams = () => {
  const navigate = useNavigate();
  const { funderAndEventId } = useParams();

  if (funderAndEventId === undefined || funderAndEventId === "") {
    eventHelperInstance.debugLog(
      "Navigating to home page. eventId is not found in the URL paramater",
      "error",
    );
    navigate("/");
    return {
      eventId: "",
      funderId: "",
    };
  }

  const split = funderAndEventId.split(":");
  if (split.length !== 2) {
    eventHelperInstance.debugLog(
      "Navigating to home page. eventId is not found in the URL paramater",
      "error",
    );
    navigate("/");
    return {
      eventId: "",
      funderId: "",
    };
  }

  const [funderId, eventId] = split;
  if (
    eventId === undefined ||
    eventId === "" ||
    funderId === undefined ||
    funderId === ""
  ) {
    eventHelperInstance.debugLog(
      "Navigation to home page. dropId or SecretKey are not found in the URL paramater",
      "error",
    );
    navigate("/");
    return {
      eventId: "",
      funderId: "",
    };
  }

  return {
    eventId,
    funderId,
  };
};
