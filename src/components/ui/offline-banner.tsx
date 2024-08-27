import { Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export function OfflineBanner() {
  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setOnlineStatus(navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, []);

  return (
    <>
      {!onlineStatus && (
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text
            fontFamily="mono"
            color="brand.400"
            textAlign="center"
            fontSize="lg"
            fontWeight="bold"
          >
            You are offline
          </Text>
        </Box>
      )}
    </>
  );
}
