import eventHelperInstance from "@/lib/event";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export const useSponsorDashParams = () => {
  const navigate = useNavigate();
  const { id: sponsorAccount } = useParams();
  const { hash } = useLocation();

  const accountId = sponsorAccount;
  const sponsorKey = hash ? hash.replace("#", "") : "";

  if (!accountId || !sponsorKey) {
    eventHelperInstance.debugLog(
      `Navigating to home page. accountId or sponsor data are not found in the URL or local storage`,
      "error",
    );
    navigate("/");
  }

  return {
    accountId,
    secretKey: sponsorKey,
  };
};
