import { useLocation, useNavigate, useParams } from "react-router-dom";

export const useSponsorDashParams = () => {
  const navigate = useNavigate();
  const { id: sponsorAccount } = useParams();
  const { hash } = useLocation();

  const accountId = sponsorAccount;
  const sponsorKey = hash ? hash.replace("#", "") : "";

  if (!accountId || !sponsorKey) {
    console.error(
      "Navigating to home page. accountId or sponsor data are not found in the URL or local storage",
    );
    navigate("/");
  }

  return {
    accountId,
    secretKey: sponsorKey,
  };
};
