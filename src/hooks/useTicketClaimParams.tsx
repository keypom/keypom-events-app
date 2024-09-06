import { useLocation, useNavigate, useParams } from "react-router-dom";

export const useTicketClaimParams = () => {
  const navigate = useNavigate();
  const { id: dropIdParam } = useParams();
  const { hash } = useLocation();

  const dropId = dropIdParam;
  const secretKey = hash ? hash.replace("#", "") : "";
  console.log(`Received dropId: ${dropId} and secretKey: ${secretKey}`);

  if (!dropId || !secretKey) {
    console.error(
      "Navigating to home page. dropId or SecretKey are not found in the URL or local storage",
    );
    navigate("/");
  }

  return {
    dropId,
    secretKey,
  };
};
