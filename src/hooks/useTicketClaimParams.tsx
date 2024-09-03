import { useLocation, useNavigate, useParams } from "react-router-dom";

export const useTicketClaimParams = () => {
  const navigate = useNavigate();
  const { id: dropId } = useParams();
  const { hash } = useLocation();

  const secretKey = hash ? hash.replace("#", "") : ""; // and the secret key

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
