import { Button, Center, Hide, Show, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const NotFound404 = ({
  header = "404",
  subheader = "This page could not be found.",
  cta = "back to homepage",
}: {
  header?: string;
  subheader?: string;
  cta?: string;
}) => {
  const navigate = useNavigate();
  return (
    <Center h="calc(100vh - 64px)" zIndex={5}>
      <Show above="md">
        <VStack
          spacing="40px"
          border={"1px solid var(--chakra-colors-brand-400)"}
          p={4}
          borderRadius={"lg"}
        >
          <VStack fontFamily={"mono"} gap={8}>
            <Text fontSize={"4xl"}>{header}</Text>

            <Text fontSize="md">{subheader}</Text>
          </VStack>
          <Button
            variant={"primary"}
            onClick={() => {
              navigate("/");
            }}
          >
            {cta}
          </Button>
        </VStack>
      </Show>
      <Hide above="md">
        <VStack>
          <Text fontSize="4xl">{header}</Text>
          <Text pb="20px" size="md">
            {subheader}
          </Text>
          <Button
            variant={"primary"}
            onClick={() => {
              navigate("/");
            }}
          >
            {cta}
          </Button>
        </VStack>
      </Hide>
    </Center>
  );
};
