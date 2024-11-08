import eventHelperInstance from "@/lib/event";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export const useConferenceClaimParams = () => {
  const navigate = useNavigate();
  const { id: dropIdParam } = useParams();
  const { hash } = useLocation();

  let dropId = dropIdParam;
  let secretKey = hash ? hash.replace("#", "") : "";

  if (dropId && secretKey) {
    // Store in local storage
    localStorage.setItem("EVENT_DROP_ID", dropId);
    localStorage.setItem("EVENT_SECRET_KEY", secretKey);

    // Clear URL
    navigate(`/conference/app/profile`, { replace: true });
  } else {
    // Fallback to local storage
    dropId = localStorage.getItem("EVENT_DROP_ID") || "";
    secretKey = localStorage.getItem("EVENT_SECRET_KEY") || "";
  }

  if (!dropId || !secretKey) {
    eventHelperInstance.debugLog(
      "Navigating to home page. dropId or SecretKey not found in URL or local storage",
      "error",
    );
    navigate("/");
  }

  return {
    dropId,
    secretKey,
  };
};
