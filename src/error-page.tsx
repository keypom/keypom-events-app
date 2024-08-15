import { Heading, VStack, Text } from "@chakra-ui/react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError() as Error;
  console.error(error);

  if (!isRouteErrorResponse(error)) {
    return null;
  }

  return (
    <VStack
      alignItems="center"
      gap={4}
      minHeight={"100vh"}
      justifyContent={"center"}
    >
      <Heading>Oops!</Heading>
      <Text>Sorry, an unexpected error has occurred.</Text>
      <Text as="i">{error.statusText || error.message}</Text>
    </VStack>
  );
}
