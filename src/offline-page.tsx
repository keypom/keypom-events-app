import { Heading, VStack, Text, Button, Box, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { DinoIcon } from "./components/icons/dino";

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
      minHeight={"calc(100dvh - 168px)"}
      justifyContent={"center"}
      fontFamily={"mono"}
    >
      <Box width="112px" height="144px" overflow="clip">
        <DinoIcon color={"brand.400"} />
      </Box>
      <Heading>Oops!</Heading>
      <Text>You are not connected to the internet</Text>
      <HStack>
        <Button variant="primary" onClick={handleRetry}>
          Retry
        </Button>
        <Button variant="primary" onClick={handleGoHome}>
          Go to Home
        </Button>
      </HStack>
    </VStack>
  );
}
