import { Button, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function PageNotFound() {
  const navigate = useNavigate();

  return (
    <VStack
      alignItems="center"
      gap={4}
      minHeight={"100dvh"}
      justifyContent={"center"}
    >
      <Heading>404</Heading>
      <Text>Page not found.</Text>
      <HStack>
        <Button variant="primary" onClick={() => navigate("/")}>
          Go to Home
        </Button>
      </HStack>
    </VStack>
  );
}
