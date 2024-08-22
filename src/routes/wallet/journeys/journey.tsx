import { VStack, Image, Heading, Text, Flex } from "@chakra-ui/react";

import { PageHeading } from "@/components/ui/page-heading";
import { CheckIcon } from "@/components/icons";

import Dragon from "/collectible.webp";

function Step({
  index,
  description,
  completed,
}: {
  index: number;
  description: string;
  completed: boolean;
}) {
  return (
    <VStack
      width={"100%"}
      alignItems={"flex-start"}
      borderBottom="1px solid var(--chakra-colors-brand-400)"
      p={2}
      gap={0}
    >
      <Flex width="100%" alignItems="center" justifyContent="space-between">
        <Heading
          as="h3"
          fontSize="md"
          fontFamily={"mono"}
          color={completed ? "brand.400" : "white"}
        >
          Step {index}
        </Heading>
        {completed && (
          <CheckIcon
            width={24}
            height={24}
            color={"var(--chakra-colors-brand-400)"}
          />
        )}
      </Flex>
      <Text fontSize="sm">{description}</Text>
    </VStack>
  );
}

export function Journey() {
  return (
    <VStack spacing={4} p={4}>
      <PageHeading
        title="Journey Details"
        titleSize="16px"
        showBackButton
        backUrl="/wallet/journeys"
      />
      <VStack alignItems="flex-start" gap={"30px"} maxWidth="320px">
        <Image
          src={Dragon}
          width={"100%"}
          height={"100%"}
          bg={"brand.400"}
          borderRadius={"md"}
        />
        <VStack alignItems="flex-start" gap={3}>
          <Heading
            as="h3"
            fontSize="20px"
            fontFamily={"mono"}
            fontWeight="700"
            color="white"
          >
            NEAR Purple Scavenger Hunt
          </Heading>
          <Text fontSize="xs" lineHeight={"120%"}>
            Here are some instructions on how to accomplish this journey and
            perhaps some sponsor info. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit.
          </Text>
          <VStack alignItems="flex-start" gap={4} width={"100%"}>
            <Step index={1} description="Find the purple dragon" completed />
            <Step index={2} description="Find the purple dragon" completed />
            <Step index={3} description="Find the purple dragon" completed />
            <Step index={4} description="Find the purple dragon" completed />
          </VStack>
        </VStack>
      </VStack>
    </VStack>
  );
}
