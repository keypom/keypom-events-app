import { VStack, Flex, HStack, Box, Heading, Text } from "@chakra-ui/react";
import { CalenderAddIcon } from "../icons";

export function AgendaCard({
  title,
  stage,
  description,
  presenter,
}: {
  title: string;
  stage: string;
  description: string;
  presenter: string;
}) {
  return (
    <VStack width={"100%"} alignItems={"flex-start"} gap={2}>
      <Flex width={"100%"} justifyContent={"space-between"}>
        <VStack width={"100%"} alignItems={"flex-start"} gap={1}>
          <Heading
            as="h3"
            fontSize={"sm"}
            fontFamily={"mono"}
            fontWeight={"bold"}
            color={"white"}
          >
            {title}
          </Heading>
          <Heading
            as="h4"
            color={"brand.400"}
            fontSize={"sm"}
            fontWeight={"bold"}
          >
            {presenter}
          </Heading>
        </VStack>
        <CalenderAddIcon
          width={24}
          height={24}
          color={"var(--chakra-colors-brand-400)"}
        />
      </Flex>
      <Text color={"brand.600"} fontSize={"xs"}>
        {description}
      </Text>
      <Heading as="h4" color={"brand.400"} fontSize={"sm"} fontWeight={"bold"}>
        {stage}
      </Heading>
    </VStack>
  );
}
