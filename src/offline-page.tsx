import { Heading, VStack, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function OfflinePage() {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate(0);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <VStack
      alignItems="center"
      gap={4}
      minHeight={"100dvh"}
      justifyContent={"center"}
    >
      <Heading>Oops!</Heading>
      <Text>You are not connected to the internet</Text>
      <Button onClick={handleRetry}>Retry</Button>
      <Button onClick={handleGoHome}>Go to Home</Button>
    </VStack>
  );
}
