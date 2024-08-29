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
    navigate(`/me`, { replace: true });
  } else {
    // Fallback to local storage
    dropId = localStorage.getItem("EVENT_DROP_ID") || "";
    secretKey = localStorage.getItem("EVENT_SECRET_KEY") || "";
  }

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
