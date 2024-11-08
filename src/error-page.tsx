import { Heading, VStack, Text } from "@chakra-ui/react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import eventHelperInstance from "./lib/event";

export function ErrorPage() {
  const error = useRouteError() as Error;
  eventHelperInstance.debugLog(`Error: ${error}`, "error");

  if (!isRouteErrorResponse(error)) {
    return null;
  }

  return (
    <VStack
      alignItems="center"
      gap={4}
      minHeight={"100dvh"}
      justifyContent={"center"}
    >
      <Heading>Oops!</Heading>
      <Text>Sorry, an unexpected error has occurred.</Text>
      <Text as="i">{error.statusText || error.message}</Text>
    </VStack>
  );
}
