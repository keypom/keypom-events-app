import { Heading, VStack, Text, Button, Box, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { DinoIcon } from "./components/icons/dino";

export function OfflinePage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Box
      position="absolute"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={1}
    >
      <VStack
        gap={4}
        alignItems="center"
        justifyContent={"center"}
        fontFamily={"mono"}
      >
        <Box width="112px" height="144px" overflow="clip">
          <DinoIcon color={"var(--chakra-colors-brand-400)"} />
        </Box>
        <Heading>Oops!</Heading>
        <Text>You are not connected to the internet</Text>
        <HStack>
          <Button variant="primary" onClick={handleGoBack}>
            Back
          </Button>
          <Button variant="primary" onClick={handleGoHome}>
            Go to Home
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
